import { useState, useCallback } from 'react';
import { VehicleFilterOptions, SavedFilter } from '../types/search.types';
import { v4 as uuidv4 } from 'uuid';

export function useVehicleFilters() {
  const [filters, setFilters] = useState<VehicleFilterOptions>({});
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]); // In reality, fetch from Firestore

  const updateFilters = useCallback((updates: Partial<VehicleFilterOptions>) => {
    setFilters(prev => {
      const next = { ...prev, ...updates };
      // Clean up empty arrays or strings to avoid bad queries
      Object.keys(next).forEach(key => {
        const val = next[key as keyof VehicleFilterOptions];
        if (Array.isArray(val) && val.length === 0) delete next[key as keyof VehicleFilterOptions];
        if (val === '') delete next[key as keyof VehicleFilterOptions];
      });
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const saveCurrentFilter = useCallback((name: string) => {
    const newSaved: SavedFilter = {
      id: uuidv4(),
      name,
      filters: { ...filters },
      createdAt: new Date().toISOString()
    };
    setSavedFilters(prev => [...prev, newSaved]);
    // TODO: Persist to Firestore subcollection
  }, [filters]);

  const loadSavedFilter = useCallback((id: string) => {
    const found = savedFilters.find(f => f.id === id);
    if (found) {
      setFilters(found.filters);
    }
  }, [savedFilters]);

  const removeSavedFilter = useCallback((id: string) => {
    setSavedFilters(prev => prev.filter(f => f.id !== id));
  }, []);

  return {
    filters,
    updateFilters,
    clearFilters,
    savedFilters,
    saveCurrentFilter,
    loadSavedFilter,
    removeSavedFilter
  };
}
