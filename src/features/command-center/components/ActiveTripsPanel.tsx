import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CommandCenterState } from '../types/command-center.types';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Route, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ActiveTripsPanel({ state }: { state: CommandCenterState }) {
  // Simple heuristic for progress simulation for UI layout purposes
  const calculateProgress = (status: string) => {
    if (status === 'Assigned') return 10;
    if (status === 'InProgress') return 50;
    if (status === 'Paused') return 50;
    return 0;
  };

  return (
    <Card className="col-span-full h-[350px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Route className="h-5 w-5" /> Active Trips
          </span>
          <Badge variant="secondary">{state.activeTrips.length} Ongoing</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full px-6 pb-6">
          <div className="space-y-4">
            {state.activeTrips.map(trip => (
              <div key={trip.id} className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{trip.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {trip.route.origin.address} → {trip.route.destination.address}
                    </p>
                  </div>
                  <Badge variant={trip.status === 'Paused' ? 'destructive' : 'default'}>
                    {trip.status}
                  </Badge>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{calculateProgress(trip.status)}%</span>
                  </div>
                  <Progress value={calculateProgress(trip.status)} className="h-2" />
                </div>

                <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Est: {new Date(trip.schedule.plannedEndTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div>
                    Driver: {trip.driverId || 'Pending'}
                  </div>
                </div>
              </div>
            ))}
            {state.activeTrips.length === 0 && (
              <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                <Route className="h-8 w-8 text-muted mb-2" />
                <p>No active trips currently in progress.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
