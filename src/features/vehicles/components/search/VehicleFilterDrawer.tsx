import React from 'react';
import { VehicleFilterOptions } from '../../types/search.types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VehicleSavedFilters } from './VehicleSavedFilters';
import { SavedFilter } from '../../types/search.types';

interface VehicleFilterDrawerProps {
  filters: VehicleFilterOptions;
  updateFilters: (updates: Partial<VehicleFilterOptions>) => void;
  savedFilters: SavedFilter[];
  onLoadSaved: (id: string) => void;
  onRemoveSaved: (id: string) => void;
  onSaveCurrent: (name: string) => void;
}

export function VehicleFilterDrawer({
  filters,
  updateFilters,
  savedFilters,
  onLoadSaved,
  onRemoveSaved,
  onSaveCurrent
}: VehicleFilterDrawerProps) {

  // For a real app, this would be wrapped in a Sheet/Drawer component.
  // Rendering the body here for architecture completion.

  return (
    <div className="p-4 space-y-6 w-full max-w-sm border-l bg-card h-full overflow-y-auto">
      <h2 className="text-lg font-bold">Advanced Filters</h2>

      <VehicleSavedFilters 
        savedFilters={savedFilters}
        onLoad={onLoadSaved}
        onRemove={onRemoveSaved}
        onSaveCurrent={onSaveCurrent}
      />

      <hr className="my-4" />

      <div className="space-y-4">
        <div>
          <Label>Status</Label>
          <Select 
            value={filters.status?.[0] || ''} 
            onValueChange={(val: string) => updateFilters({ status: [val] })}
          >
            <SelectTrigger><SelectValue placeholder="Any Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="OnTrip">On Trip</SelectItem>
              <SelectItem value="UnderMaintenance">Under Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Fuel Type</Label>
          <Select 
            value={filters.fuelType?.[0] || ''} 
            onValueChange={(val: string) => updateFilters({ fuelType: [val] })}
          >
            <SelectTrigger><SelectValue placeholder="Any Fuel Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Electric">Electric</SelectItem>
              <SelectItem value="Petrol">Petrol</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Smart Filters (Presets)</Label>
          <div className="flex flex-col gap-2 mt-2">
            <button className="text-sm text-left text-blue-600 hover:underline" onClick={() => updateFilters({ insuranceExpiryMax: new Date(Date.now() + 30*24*60*60*1000).toISOString() })}>
              Insurance expiring in 30 days
            </button>
            <button className="text-sm text-left text-blue-600 hover:underline" onClick={() => updateFilters({ status: ['Available'] })}>
              Available Now
            </button>
            <button className="text-sm text-left text-blue-600 hover:underline" onClick={() => updateFilters({ status: ['Inspection'] })}>
              Needs Safety Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
