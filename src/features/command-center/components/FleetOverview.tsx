import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CommandCenterState } from '../types/command-center.types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export function FleetOverview({ state }: { state: CommandCenterState }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'On Trip': return 'bg-blue-100 text-blue-800';
      case 'In Shop': return 'bg-orange-100 text-orange-800';
      case 'Retired': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <Card className="flex flex-col h-[400px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Fleet Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full px-6 pb-6">
          <div className="space-y-3">
            {state.vehicles.map(v => (
              <div key={v.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <div className="font-medium text-sm">{v.registrationNumber}</div>
                  <div className="text-xs text-muted-foreground">{v.make} {v.model}</div>
                </div>
                <Badge variant="outline" className={getStatusColor(v.status)}>
                  {v.status}
                </Badge>
              </div>
            ))}
            {state.vehicles.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No vehicles found.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
