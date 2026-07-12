import React from 'react';
import { Button } from '@/components/ui/button';
import { SavedFilter } from '../../types/search.types';
import { Bookmark, Trash2 } from 'lucide-react';

interface VehicleSavedFiltersProps {
  savedFilters: SavedFilter[];
  onLoad: (id: string) => void;
  onRemove: (id: string) => void;
  onSaveCurrent: (name: string) => void;
}

export function VehicleSavedFilters({ savedFilters, onLoad, onRemove, onSaveCurrent }: VehicleSavedFiltersProps) {
  const handleSave = () => {
    const name = window.prompt('Enter a name for this saved filter:');
    if (name) {
      onSaveCurrent(name);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">Saved Filters</h3>
        <Button variant="outline" size="sm" onClick={handleSave}>
          <Bookmark className="h-4 w-4 mr-2" /> Save Current
        </Button>
      </div>

      {savedFilters.length === 0 ? (
        <p className="text-sm text-muted-foreground">No saved filters yet.</p>
      ) : (
        <div className="space-y-2">
          {savedFilters.map(f => (
            <div key={f.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 transition-colors">
              <button 
                onClick={() => onLoad(f.id)}
                className="flex-1 text-left text-sm font-medium hover:underline"
              >
                {f.name}
              </button>
              <button 
                onClick={() => onRemove(f.id)}
                className="text-muted-foreground hover:text-destructive p-1"
                aria-label="Delete saved filter"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
