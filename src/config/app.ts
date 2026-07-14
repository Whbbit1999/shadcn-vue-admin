/**
 * Application-wide configuration defaults
 *
 * This file consolidates small, cross-cutting config values
 * that don't belong to a specific domain (theme, navigation, etc.).
 */

// ── Pagination ────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 10 as const
export const PAGE_SIZES = [10, 20, 50, 100] as const

// ── Routing ───────────────────────────────────────────────
export const HOME_PATH = '/dashboard' as const
export const LOGIN_PATH = '/auth/sign-in' as const
