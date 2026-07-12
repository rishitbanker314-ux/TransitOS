import React from 'react';
import { Button } from '@/components/ui/button';
import { Archive, Trash2, ShieldCheck, MapPin } from 'lucide-react';

interface VehicleBulkActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

export function VehicleBulkActions({ selectedIds, onClearSelection }: VehicleBulkActionsProps) {
  const count = selectedIds.length;

  if (count === 0) return null;

  const handleAction = (action: string) => {
    // In real implementation, this would trigger a confirmation dialog,
    // then call the VehicleStatusService to batch execute the transition.
    console.log(`Executing ${action} on ${count} vehicles`);
    window.alert(`${action} executed on ${count} vehicles.`);
    onClearSelection();
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-background border shadow-xl rounded-full px-6 py-3 flex items-center gap-4 z-50 animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-2 pr-4 border-r">
        <span className="flex items-center justify-center bg-primary text-primary-foreground text-sm font-bold w-6 h-6 rounded-full">
          {count}
        </span>
        <span className="text-sm font-medium hidden sm:inline">Vehicles Selected</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => handleAction('Archive')}>
          <Archive className="h-4 w-4 mr-2" /> Archive
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleAction('Assign Driver')}>
          <MapPin className="h-4 w-4 mr-2" /> Assign Driver
        </Button>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleAction('Retire')}>
          <Trash2 className="h-4 w-4 mr-2" /> Retire
        </Button>
      </div>

      <Button variant="outline" size="sm" className="ml-2 rounded-full" onClick={onClearSelection}>
        Cancel
      </Button>
    </div>
  );
}
