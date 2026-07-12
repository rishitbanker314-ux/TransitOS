import React, { useState } from 'react';
import { VehicleSearchBar } from './VehicleSearchBar';
import { VehicleFilterChips } from './VehicleFilterChips';
import { VehicleBulkActions } from './VehicleBulkActions';
import { useVehicleFilters } from '../../hooks/useVehicleFilters';
import { useVehicleSearch } from '../../hooks/useVehicleSearch';
import { VehicleSortOptions } from '../../types/search.types';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, Download, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function VehicleSearch() {
  const { filters, updateFilters } = useVehicleFilters();
  const [sort, setSort] = useState<VehicleSortOptions>({ field: 'createdAt', direction: 'desc' });
  
  // Data Fetching Hook
  const { results, isLoading, hasMore, loadMore, error } = useVehicleSearch(filters, sort);
  
  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSearchTerm = (term: string) => {
    updateFilters({ searchTerm: term });
  };

  const handleRemoveChip = (key: keyof typeof filters, valueToRemove?: string) => {
    if (valueToRemove && Array.isArray(filters[key])) {
      const arr = filters[key] as string[];
      updateFilters({ [key]: arr.filter(v => v !== valueToRemove) });
    } else {
      updateFilters({ [key]: undefined });
    }
  };

  const toggleSelection = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <VehicleSearchBar 
          onSearch={handleSearchTerm}
          onAIFilterApply={(aiFilters) => updateFilters(aiFilters)}
          initialValue={filters.searchTerm || ''}
        />
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none">
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
          </Button>
          <Button variant="outline" className="hidden sm:flex">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button className="flex-1 sm:flex-none">
            <Plus className="mr-2 h-4 w-4" /> Add Vehicle
          </Button>
        </div>
      </div>

      {/* Active Filter Chips */}
      <VehicleFilterChips filters={filters} onRemove={handleRemoveChip} />

      {/* Error State */}
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md text-sm font-medium">
          {error}
        </div>
      )}

      {/* Results Area (Mocked List for Architecture demo) */}
      <Card className="flex-1 overflow-hidden min-h-[400px]">
        {isLoading && results.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-muted-foreground">Loading fleet data...</div>
        ) : results.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-muted-foreground">
            <p className="text-lg font-medium text-foreground">No vehicles found</p>
            <p className="text-sm">Try adjusting your filters or search term.</p>
            <Button variant="link" onClick={() => updateFilters({ searchTerm: undefined, status: undefined })}>Clear all filters</Button>
          </div>
        ) : (
          <div className="p-4">
            <div className="text-sm text-muted-foreground mb-4" aria-live="polite">
              Showing {results.length} results
            </div>
            {/* Mocked rendering of results to show integration of selection */}
            <div className="space-y-2">
              {results.map(v => (
                <div key={v.id} className="flex items-center p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <input 
                    type="checkbox" 
                    className="mr-4 rounded border-gray-300"
                    checked={selectedIds.has(v.id)}
                    onChange={() => toggleSelection(v.id)}
                  />
                  <div>
                    <div className="font-semibold">{v.registrationNumber}</div>
                    <div className="text-xs text-muted-foreground">{v.make} - {v.status}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {hasMore && (
              <div className="flex justify-center mt-6">
                <Button variant="outline" onClick={loadMore} disabled={isLoading}>
                  {isLoading ? 'Loading more...' : 'Load More'}
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Bulk Action Floating Bar */}
      <VehicleBulkActions 
        selectedIds={Array.from(selectedIds)} 
        onClearSelection={() => setSelectedIds(new Set())} 
      />
    </div>
  );
}
