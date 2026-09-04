---
name: table-pagination
description: Design, implement, or review data tables that use client-side or server-side pagination, including state ownership, query parameters, loading, filtering, sorting, and total-count handling.
metadata:
  short-description: Client and server table pagination guidance
---

# Table pagination

Use this skill when adding or changing a paginated table. First decide where
the complete dataset lives; do not mix client and server responsibilities by
accident.

## Choose the mode

- **Client-side pagination**: the client has the complete dataset. The table
  owns or controls `pageIndex` and `pageSize`, and its pagination row model may
  slice, filter, and sort locally.
- **Server-side pagination**: the API returns only one page. The page or a
  feature composable owns pagination state and the request; the table receives
  the current rows and total count. Enable manual pagination so the table does
  not slice an already-paginated page.
- If filtering or sorting is remote, treat those state slices like pagination:
  include them in the request and query key, enable their manual modes, and
  reset to the first page when they change.

## Client-side checklist

1. Load the full dataset only when its size is bounded and acceptable.
2. Pass the complete rows to the table and use the table's local pagination,
   filtering, and sorting row models.
3. Keep one owner for pagination state. If the page controls it externally,
   pass a reactive controlled state and preserve TanStack's updater callback.
4. Confirm that filtering and sorting operate on all rows, not only the visible
   page. Add a loading state for the initial dataset request.

Do not call this mode "server pagination" merely because the initial data came
from an API; pagination is server-side only when the API returns a page.

## Server-side checklist

Keep this flow in the page/feature layer:

```text
pagination + filters + sorting
        -> query key and API parameters
        -> current-page rows + total count
        -> controlled table state
        <- table pagination callbacks
```

Use a state shape equivalent to:

```ts
const pagination = shallowRef<PaginationState>({
  pageIndex: 0,
  pageSize: 20,
})

const query = useQuery(() => ({
  queryKey: ['users', pagination.value.pageIndex, pagination.value.pageSize],
  queryFn: () => fetchUsers({
    page: pagination.value.pageIndex + 1,
    pageSize: pagination.value.pageSize,
  }),
  placeholderData: keepPreviousData,
}))

const rows = computed(() => query.data.value?.rows ?? [])
const rowCount = computed(() => query.data.value?.total ?? 0)
```

Connect the table with `manualPagination: true`, a reactive `rowCount`, and a
controlled pagination state. If the project already has a shared `DataTable`,
use its server-pagination seam rather than recreating a second table instance:

```ts
const serverPagination = computed(() => ({
  state: pagination.value,
  rowCount: rowCount.value,
  onChange: (next: Updater<PaginationState>) => {
    pagination.value = typeof next === 'function'
      ? next(pagination.value)
      : next
  },
}))
```

The API contract must provide the current page and a total (`rows` plus
`total`, or an equivalent shape). Never use `rows.length` as the total. A
`pageIndex` is normally zero-based in TanStack Table; convert it explicitly to
the API's one-based `page` or to `offset = pageIndex * pageSize`.

The query key must include every server input: page, page size, search,
facets, sort order, and any tenant or scope that changes the result. Do not
copy query data into a second mutable ref just to render it.

## Loading and errors

- Use `isPending`/equivalent for an empty initial state.
- Use `isFetching`/equivalent when page changes must visibly indicate a new
  request. Decide whether to hide the old rows or keep them with an overlay;
  `placeholderData: keepPreviousData` only controls data retention, not UI
  semantics.
- Show an error state without replacing the query with a manually synchronized
  data ref. Keep pagination controls disabled or hidden when there is no valid
  total, according to the existing table contract.

## Page-size, filters, sorting, and selection

- Changing page size commonly resets `pageIndex` to `0`; make this explicit if
  the API or product expects it.
- Search, facet, and sort changes should normally reset to the first page.
- Do not apply local filtering/sorting to one server-fetched page and present
  it as a result over the whole dataset.
- For selection across remote pages, use a stable row id (for example the
  backend id) and define whether selection is page-only or global. Do not
  assume the default index-based row id is globally stable.
- Cursor pagination is a different state model. Do not force cursors into
  `pageIndex/pageSize`; give it cursor-specific controls and cache keys.

## Layering rules

The shared table should render columns, rows, and generic pagination controls.
The page/feature should own API adapters, query keys, server state, and domain
reset rules. The pagination component should call table methods and must not
know whether data is local or remote.

Before adding a new abstraction, inspect existing table hooks and types. Add a
shared server-pagination composable only after multiple pages have the same
request contract; different APIs may use `page`, `offset`, or cursors and do
not benefit from a premature universal adapter.

## Verification

For a server-paginated table, verify at least:

- first page request and page-index conversion;
- next/previous/last buttons use the server total;
- page-size changes trigger a request;
- query keys change for every remote input;
- loading and error states are visible;
- remote filtering/sorting does not accidentally run only on the current page.
