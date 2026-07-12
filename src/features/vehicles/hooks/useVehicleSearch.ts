import { useState, useEffect, useCallback } from 'react';
import { VehicleSearchService } from '../services/search/VehicleSearchService';
import { VehicleFilterOptions, VehicleSortOptions, SearchPaginationState } from '../types/search.types';
import { VehicleSchemaType } from '../schemas/vehicle.schema';
import { VehicleDocument } from '../services/search/VehicleSearchService';

export function useVehicleSearch(
  filters: VehicleFilterOptions, 
  sort: VehicleSortOptions
) {
  const [results, setResults] = useState<VehicleDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [pagination, setPagination] = useState<SearchPaginationState>({ pageSize: 50, lastVisibleDocId: null });
  const [hasMore, setHasMore] = useState(false);

  const searchService = new VehicleSearchService();

  // Reset pagination when filters or sort changes
  useEffect(() => {
    setPagination({ pageSize: 50, lastVisibleDocId: null });
    setResults([]);
  }, [filters, sort]);

  const fetchResults = useCallback(async (isLoadMore = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await searchService.search(filters, sort, pagination);
      
      setResults(prev => isLoadMore ? [...prev, ...response.data] : response.data);
      setHasMore(response.hasMore);
      
      if (response.lastDocId) {
        setPagination(prev => ({ ...prev, lastVisibleDocId: response.lastDocId }));
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setError('Failed to fetch vehicles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, sort, pagination]);

  // Trigger search on filter/sort change (with debouncing handled in the UI input level)
  useEffect(() => {
    // Only fire if it's the first page
    if (pagination.lastVisibleDocId === null) {
      fetchResults(false);
    }
  }, [filters, sort, fetchResults]); // Note: In a real app, careful with fetchResults dependency loop

  const loadMore = () => {
    if (hasMore && !isLoading) {
      fetchResults(true);
    }
  };

  return {
    results,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh: () => fetchResults(false)
  };
}
