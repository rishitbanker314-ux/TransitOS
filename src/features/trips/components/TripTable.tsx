import React from 'react';
import { Trip } from '../types/trip.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TripTableProps {
  trips: Trip[];
  onDispatchClick: (tripId: string) => void;
}

export function TripTable({ trips, onDispatchClick }: TripTableProps) {
  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'InProgress': return 'bg-blue-100 text-blue-800';
      case 'Assigned': return 'bg-green-100 text-green-800';
      case 'Paused': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Trip Title</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Route</th>
            <th className="px-4 py-3 font-medium">Start Time</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {trips.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                No active trips.
              </td>
            </tr>
          ) : (
            trips.map(trip => (
              <tr key={trip.id} className="bg-card hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 font-medium">{trip.title}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={getStatusColor(trip.status)}>
                    {trip.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {trip.route.origin.address} → {trip.route.destination.address}
                </td>
                <td className="px-4 py-3">
                  {new Date(trip.schedule.plannedStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-4 py-3 text-right">
                  {(trip.status === 'Draft' || trip.status === 'Scheduled') ? (
                    <Button size="sm" onClick={() => onDispatchClick(trip.id)}>
                      Dispatch
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">Manage</Button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
