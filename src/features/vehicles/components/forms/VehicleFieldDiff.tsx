import React from 'react';
import { FieldChange } from '../../services/VehicleDiffEngine';
import { ArrowRight } from 'lucide-react';

interface VehicleFieldDiffProps {
  change: FieldChange;
}

export function VehicleFieldDiff({ change }: VehicleFieldDiffProps) {
  // Format values for display
  const formatValue = (val: any) => {
    if (val === undefined || val === null || val === '') return <span className="italic text-muted-foreground">Empty</span>;
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    return String(val);
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-md bg-muted/20">
      <div className="font-medium capitalize text-sm">
        {change.field.replace(/([A-Z])/g, ' $1').trim()}
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-destructive line-through opacity-80 max-w-[150px] truncate" title={String(change.oldValue)}>
          {formatValue(change.oldValue)}
        </span>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold max-w-[150px] truncate" title={String(change.newValue)}>
          {formatValue(change.newValue)}
        </span>
      </div>
    </div>
  );
}
