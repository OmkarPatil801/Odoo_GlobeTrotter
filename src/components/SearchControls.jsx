import { ArrowUpDown, Filter, Layers, Search } from 'lucide-react'
import Input from './ui/Input'
import Dropdown from './ui/Dropdown'
import { cn } from '../utils/cn'

export function SearchControls({
  query,
  onQueryChange,
  placeholder = 'Search destinations…',
  groupBy,
  onGroupByChange,
  groupByOptions = [],
  filter,
  onFilterChange,
  filterOptions = [],
  sortBy,
  onSortByChange,
  sortByOptions = [],
  className,
}) {
  return (
    <div className={cn('grid gap-3 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]', className)}>
      <Input
        icon={Search}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search"
      />

      {groupByOptions.length > 0 && (
        <Dropdown
          label="Group"
          icon={Layers}
          options={groupByOptions}
          value={groupBy}
          onChange={onGroupByChange}
        />
      )}

      {filterOptions.length > 0 && (
        <Dropdown
          label="Filter"
          icon={Filter}
          options={filterOptions}
          value={filter}
          onChange={onFilterChange}
        />
      )}

      {sortByOptions.length > 0 && (
        <Dropdown
          label="Sort"
          icon={ArrowUpDown}
          options={sortByOptions}
          value={sortBy}
          onChange={onSortByChange}
        />
      )}
    </div>
  )
}

export default SearchControls
