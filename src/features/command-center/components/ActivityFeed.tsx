import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CommandCenterState } from '../types/command-center.types';
import { Activity } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ActivityFeed({ state }: { state: CommandCenterState }) {
  return (
    <Card className="flex flex-col h-[400px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-500" /> Live Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full px-6 pb-6">
          <div className="space-y-4">
            {state.recentActivity.map(event => (
              <div key={event.id} className="relative pl-6 pb-2 border-l border-muted last:border-0 last:pb-0">
                <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold">{event.action}</span>
                    <span className="text-xs font-medium text-muted-foreground">{event.entity}</span>
                  </div>
                  {event.details?.message && (
                    <p className="text-sm text-foreground">{event.details.message}</p>
                  )}
                  <div className="text-xs text-muted-foreground flex justify-between mt-1">
                    <span>{event.entityId.substring(0, 8)}...</span>
                    <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
            {state.recentActivity.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 text-muted mx-auto mb-2 opacity-50" />
                <p>Waiting for events...</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
