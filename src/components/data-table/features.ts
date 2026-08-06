import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/vue-table'

/**
 * Shared feature registry for all data tables in the app.
 *
 * TanStack Table v9 requires explicit feature registration via `tableFeatures()`.
 * The resolved type flows through every `ColumnDef`, `Table`, `Row`, and
 * `Column` generic in the codebase (e.g. `ColumnDef<typeof features, Task>`).
 */
export const features = tableFeatures({
  columnFacetingFeature,
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  filterFns,
  sortFns,
})
