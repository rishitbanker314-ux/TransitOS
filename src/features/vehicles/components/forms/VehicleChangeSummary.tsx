import React from 'react';
import { FieldChange } from '../../services/VehicleDiffEngine';
import { VehicleFieldDiff } from './VehicleFieldDiff';

interface VehicleChangeSummaryProps {
  changes: FieldChange[];
}

export function VehicleChangeSummary({ changes }: VehicleChangeSummaryProps) {
  if (changes.length === 0) {
    return (
      <div className="p-4 border rounded-md text-sm text-muted-foreground bg-muted/10">
        No changes detected.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Summary of Changes ({changes.length})
      </h4>
      <div className="grid gap-2">
        {changes.map((change) => (
          <VehicleFieldDiff key={change.field} change={change} />
        ))}
      </div>
    </div>
  );
}
