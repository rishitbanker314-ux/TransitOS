import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CommandCenterState } from '../types/command-center.types';
import { MapPin } from 'lucide-react';

export function FleetMap({ state }: { state: CommandCenterState }) {
  // In a real implementation, this would be a Google Map component.
  // We use a placeholder here for the architecture demo.

  return (
    <Card className="col-span-full lg:col-span-2 h-[400px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5" /> Live Fleet Map
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-md border flex items-center justify-center relative overflow-hidden">
          <div className="text-center p-6">
            <MapPin className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <h3 className="font-medium text-slate-500 dark:text-slate-400">Map Integration Placeholder</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
              Ready for @react-google-maps/api integration. Will plot {state.vehicles.length} vehicles and {state.activeTrips.length} active routes.
            </p>
          </div>
          
          {/* Simulated Markers */}
          {state.activeTrips.slice(0, 3).map((trip, idx) => (
            <div 
              key={trip.id} 
              className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md animate-pulse"
              style={{
                top: `${20 + (idx * 25)}%`,
                left: `${30 + (idx * 15)}%`
              }}
              title={trip.title}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
