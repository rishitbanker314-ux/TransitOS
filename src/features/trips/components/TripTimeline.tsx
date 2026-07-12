import React from 'react';
import { TripEvent } from '../types/trip.types';

interface TripTimelineProps {
  events: TripEvent[];
}

export function TripTimeline({ events }: TripTimelineProps) {
  if (events.length === 0) {
    return <div className="text-sm text-muted-foreground text-center p-4">No events recorded.</div>;
  }

  return (
    <div className="space-y-4">
      {events.map((event, idx) => (
        <div key={event.id} className="relative pl-6 pb-4 border-l border-muted last:border-0 last:pb-0">
          <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-background" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold">{event.type}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(event.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-foreground">{event.message}</p>
            {event.metadata && (
              <pre className="mt-2 p-2 bg-muted/50 rounded text-xs overflow-x-auto text-muted-foreground">
                {JSON.stringify(event.metadata, null, 2)}
              </pre>
            )}
            <span className="text-xs text-muted-foreground mt-2">by {event.userId}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
