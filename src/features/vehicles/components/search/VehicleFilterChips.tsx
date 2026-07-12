import React from 'react';
import { VehicleFilterOptions } from '../../types/search.types';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface VehicleFilterChipsProps {
  filters: VehicleFilterOptions;
  onRemove: (key: keyof VehicleFilterOptions, value?: string) => void;
}

export function VehicleFilterChips({ filters, onRemove }: VehicleFilterChipsProps) {
  const renderChips = () => {
    const chips: React.ReactNode[] = [];

    // Helper to add array-based chips
    const addArrayChips = (key: keyof VehicleFilterOptions, label: string) => {
      const arr = filters[key] as string[];
      if (arr && arr.length > 0) {
        arr.forEach(val => {
          chips.push(
            <Badge key={`${key}-${val}`} variant="secondary" className="flex items-center gap-1 px-2 py-1 text-sm">
              <span className="text-muted-foreground">{label}:</span> {val}
              <button 
                onClick={() => onRemove(key, val)}
                className="ml-1 hover:bg-muted rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${val} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          );
        });
      }
    };

    addArrayChips('status', 'Status');
    addArrayChips('fuelType', 'Fuel');
    addArrayChips('vehicleType', 'Type');

    if (filters.insuranceExpiryMax) {
      chips.push(
        <Badge key="ins-expiry" variant="destructive" className="flex items-center gap-1 px-2 py-1 text-sm bg-red-100 text-red-800 hover:bg-red-200">
          Insurance Expiring
          <button onClick={() => onRemove('insuranceExpiryMax')}><X className="h-3 w-3 ml-1" /></button>
        </Badge>
      );
    }

    return chips;
  };

  const chips = renderChips();

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 py-2" aria-label="Active filters">
      {chips}
    </div>
  );
}
