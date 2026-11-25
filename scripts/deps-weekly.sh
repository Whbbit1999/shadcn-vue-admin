#!/usr/bin/env bash
#
# Weekly dependency refresh for the template.
#
# The automatic part bumps patch and minor versions only, installs, then runs
# lint, tests and build. If every gate is green, the change goes to its own
# branch and a pull request is opened. Major bumps are only reported: they need a
# human, and a `pnpm` major also has to raise `engines.pnpm` in package.json.
#
# Usage:
#   bash scripts/deps-weekly.sh             # full run, opens a pull request
#   bash scripts/deps-weekly.sh --dry-run   # only list what is outdated
#   bash scripts/deps-weekly.sh --no-pr     # everything except the push and the PR
#
# Options:
#   --dry-run         List outdated dependencies and exit. Nothing is written.
#   --no-pr           Run every gate and commit locally, but do not push.
#   --base <ref>      Base ref for the new branch (default: origin/main).
#   --branch <name>   Branch to create (default: chore/deps-<date>).
#
# Environment:
#   MATURITY_DAYS     Skip releases younger than this many days (default: 7).
#   EXCLUDE           Packages the automatic run must not touch (default: none).
#
set -euo pipefail

# A run switches git branches, which deletes the files bash and node are still
# reading. Copy both script files to a temporary directory and continue there.
if [[ -z "${DEPS_WEEKLY_COPY:-}" ]]; then
  self_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  copy_dir="$(mktemp -d -t deps-weekly.XXXXXX)"
  cp "$self_dir/deps-weekly.sh" "$copy_dir/deps-weekly.sh"
  cp "$self_dir/deps-weekly-report.mjs" "$copy_dir/deps-weekly-report.mjs"
  DEPS_WEEKLY_COPY="$copy_dir/deps-weekly.sh" \
    DEPS_WEEKLY_REPORT="$copy_dir/deps-weekly-report.mjs" \
    DEPS_WEEKLY_ROOT="$(cd "$self_dir/.." && pwd)" \
    exec bash "$copy_dir/deps-weekly.sh" "$@"
fi
trap 'rm -rf "$(dirname "$DEPS_WEEKLY_COPY")"' EXIT

ROOT="${DEPS_WEEKLY_ROOT:-$(git rev-parse --show-toplevel)}"
REPORT="${DEPS_WEEKLY_REPORT:-$ROOT/scripts/deps-weekly-report.mjs}"
TAZE="taze@21"
MATURITY_DAYS="${MATURITY_DAYS:-7}"
EXCLUDE="${EXCLUDE:-}"

# `pnpm` is not always on PATH (corepack-only installs), so resolve it once.
PKG_CMD=()
if command -v pnpm >/dev/null 2>&1; then
  PKG_CMD=(pnpm)
elif command -v corepack >/dev/null 2>&1; then
  PKG_CMD=(corepack pnpm)
fi
run_pkg() { "${PKG_CMD[@]}" "$@"; }

DRY_RUN=0
MAKE_PR=1
BASE="origin/main"
BRANCH=""

usage() {
  sed -n '3,25p' "$DEPS_WEEKLY_COPY" | sed 's/^# \{0,1\}//'
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1 ;;
    --no-pr) MAKE_PR=0 ;;
    --base)
      BASE="${2:?--base needs a value}"
      shift
      ;;
    --branch)
      BRANCH="${2:?--branch needs a value}"
      shift
      ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      printf 'unknown option: %s\n\n' "$1" >&2
      usage >&2
      exit 2
      ;;
  esac
  shift
done

say() { printf '\n==> %s\n' "$*"; }
info() { printf '    %s\n' "$*"; }
warn() { printf '    [warn] %s\n' "$*"; }
die() {
  printf '\n[FAIL] %s\n' "$*" >&2
  exit 1
}

cd "$ROOT"
STAMP="$(date +%F-%H%M%S)"
LOGDIR="${DEPS_WEEKLY_LOG_DIR:-${XDG_STATE_HOME:-$HOME/.local/state}/deps-weekly/$STAMP}"

say "Preconditions"
info "repo: $ROOT"
git rev-parse --git-dir >/dev/null 2>&1 || die "not a git repository"
if [[ -n "$(git status --porcelain)" ]]; then
  die "working tree is not clean, commit or stash these files first:
$(git status --short)"
fi
[[ ${#PKG_CMD[@]} -gt 0 ]] || die "pnpm is not installed and corepack is missing"
info "package manager: ${PKG_CMD[*]}"
info "node: $(node --version)"
if [[ "$MAKE_PR" == 1 && "$DRY_RUN" == 0 ]]; then
  gh auth status >/dev/null 2>&1 || die "gh is not authenticated, run: gh auth login"
  info "gh user: $(gh api user --jq .login)"
fi

say "Sync $BASE"
git fetch --quiet origin --prune || die "git fetch failed"
git rev-parse --verify --quiet "$BASE" >/dev/null || die "unknown ref: $BASE"
info "$BASE at $(git rev-parse --short "$BASE") ($(git log -1 --pretty=%s "$BASE"))"

if [[ -z "$BRANCH" ]]; then
  BRANCH="chore/deps-$(date +%F)"
  n=2
  while git rev-parse --verify --quiet "refs/heads/$BRANCH" >/dev/null; do
    BRANCH="chore/deps-$(date +%F)-$n"
    n=$((n + 1))
  done
fi

EXCLUDE_ARGS=()
[[ -n "$EXCLUDE" ]] && EXCLUDE_ARGS=(--exclude "$EXCLUDE")

list_deps() { # $1 = taze mode, rest = extra taze args. Prints the json path.
  local mode="$1"
  shift
  local out="$LOGDIR/taze-$mode.json"
  if ! run_pkg dlx "$TAZE" "$mode" --json --loglevel warn "$@" >"$out" 2>"$LOGDIR/taze-$mode.err"; then
    tail -5 "$LOGDIR/taze-$mode.err" >&2
    die "taze $mode failed"
  fi
  printf '%s' "$out"
}

say "Check what is outdated"
mkdir -p "$LOGDIR"
AUTO_JSON="$(list_deps minor --maturity-period "$MATURITY_DAYS" "${EXCLUDE_ARGS[@]}")"
ALL_JSON="$(list_deps major --maturity-period "$MATURITY_DAYS")"
export MATURITY_DAYS EXCLUDE
node "$REPORT" summary "$AUTO_JSON" "$ALL_JSON"

if [[ "$DRY_RUN" == 1 ]]; then
  say "Dry run"
  info "nothing was written"
  info "a full run would create branch $BRANCH from $BASE"
  info "then: taze minor --write (maturity ${MATURITY_DAYS}d, exclude ${EXCLUDE:-none})"
  info "      install, lint, test:coverage, build, git push, gh pr create"
  exit 0
fi

ORIG_REF="$(git symbolic-ref --quiet --short HEAD || git rev-parse --short HEAD)"
say "Create branch $BRANCH from $BASE"
git switch --create "$BRANCH" --no-track "$BASE" >"$LOGDIR/switch.log" 2>&1 ||
  die "cannot create $BRANCH, see $LOGDIR/switch.log"
info "left $ORIG_REF, now on $BRANCH"

say "Write patch and minor updates"
info "mode: minor, maturity: ${MATURITY_DAYS}d, exclude: ${EXCLUDE:-none}"
run_pkg dlx "$TAZE" minor --write --maturity-period "$MATURITY_DAYS" "${EXCLUDE_ARGS[@]}" \
  >"$LOGDIR/taze-write.log" 2>&1 || die "taze --write failed, see $LOGDIR/taze-write.log"

if [[ -z "$(git status --porcelain)" ]]; then
  say "Nothing to update"
  info "every patch and minor release is either installed or younger than ${MATURITY_DAYS}d"
  git switch --quiet "$ORIG_REF"
  git branch --quiet --delete --force "$BRANCH"
  info "back on $ORIG_REF, branch $BRANCH removed"
  exit 0
fi
info "changed files:"
git status --short | sed 's/^/      /'

say "Install"
if ! run_pkg install >"$LOGDIR/install.log" 2>&1; then
  tail -20 "$LOGDIR/install.log" >&2
  die "install failed, see $LOGDIR/install.log (changes are left in the working tree on $BRANCH)"
fi
peer_notes="$(grep -iE 'peer|warn' "$LOGDIR/install.log" | head -20 || true)"
if [[ -n "$peer_notes" ]]; then
  info "warnings from the install:"
  printf '%s\n' "$peer_notes" | sed 's/^/      /'
else
  info "no warnings"
fi
if git diff --quiet -- pnpm-lock.yaml; then
  warn "package.json changed but pnpm-lock.yaml did not, check the peer notes above"
fi

GATES=(lint test:coverage build)
failed_gate=""
for gate in "${GATES[@]}"; do
  say "Gate: ${PKG_CMD[*]} $gate"
  if run_pkg "$gate" >"$LOGDIR/gate-${gate//:/-}.log" 2>&1; then
    info "ok"
  else
    failed_gate="$gate"
    break
  fi
done

if [[ -n "$failed_gate" ]]; then
  printf '\n----- last lines of %s %s -----\n' "${PKG_CMD[*]}" "$failed_gate" >&2
  tail -30 "$LOGDIR/gate-${failed_gate//:/-}.log" >&2
  cat >&2 <<EOF

[FAIL] gate failed: ${PKG_CMD[*]} $failed_gate
    branch $BRANCH is checked out and keeps the changed files, nothing was pushed
    full log: $LOGDIR/gate-${failed_gate//:/-}.log
    next: fix or drop the guilty dependency, then rerun:
          bash scripts/deps-weekly.sh --branch $BRANCH-base $BASE
EOF
  exit 1
fi

say "Commit"
git add --update
node "$REPORT" markdown "$AUTO_JSON" "$ALL_JSON" "$LOGDIR/body.md" \
  "${BASE#origin/}" "${GATES[*]}"
git commit --quiet --message "chore(deps): weekly dependency update $(date +%F)" \
  --message "Patch and minor bumps only. Major bumps are reported in the pull request body." ||
  die "git commit failed"
info "$(git log -1 --pretty='%h %s')"

if [[ "$MAKE_PR" == 0 ]]; then
  say "Done (--no-pr)"
  info "branch $BRANCH is committed, nothing was pushed"
  info "logs: $LOGDIR"
  exit 0
fi

say "Push and open a pull request"
manual_steps() {
  cat >&2 <<EOF

[FAIL] $1
    branch $BRANCH is committed locally, nothing is lost
    next: git push --set-upstream origin $BRANCH
          gh pr create --base ${BASE#origin/} --head $BRANCH \\
            --title "chore(deps): weekly dependency update $(date +%F)" \\
            --body-file $LOGDIR/body.md
EOF
  exit 1
}

# --no-verify: the pre-push hook runs a bare `pnpm build`, and pnpm is not always
# on PATH. The build gate above already ran `build` on exactly this tree.
attempt=1
while ! git push --quiet --no-verify --set-upstream origin "$BRANCH"; do
  if [[ "$attempt" -ge 3 ]]; then
    manual_steps "git push failed three times (network?)"
  fi
  attempt=$((attempt + 1))
  warn "push failed, retry $attempt of 3 in 15s"
  sleep 15
done

pr_url="$(gh pr create \
  --base "${BASE#origin/}" \
  --head "$BRANCH" \
  --title "chore(deps): weekly dependency update $(date +%F)" \
  --body-file "$LOGDIR/body.md")" || manual_steps "gh pr create failed"
say "Pull request: $pr_url"
info "branch: $BRANCH"
info "logs:   $LOGDIR"
info "the major table at the end of the pull request body still needs a human"
