import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CommandCenterState } from '../types/command-center.types';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function AlertCenter({ state }: { state: CommandCenterState }) {
  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'Critical': return <ShieldAlert className="h-4 w-4 text-red-500" />;
      case 'Warning': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAlertBg = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-50 border-red-100 dark:bg-red-950/20 dark:border-red-900/30';
      case 'Warning': return 'bg-orange-50 border-orange-100 dark:bg-orange-950/20 dark:border-orange-900/30';
      default: return 'bg-blue-50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30';
    }
  };

  return (
    <Card className="flex flex-col h-[400px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" /> Alert Center
          </span>
          {state.alerts.length > 0 && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
              {state.alerts.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full px-6 pb-6">
          <div className="space-y-3">
            {state.alerts.map(alert => (
              <div 
                key={alert.id} 
                className={`p-3 rounded-md border flex gap-3 items-start ${getAlertBg(alert.severity)}`}
              >
                <div className="mt-0.5">{getAlertIcon(alert.severity)}</div>
                <div>
                  <h4 className="text-sm font-semibold">{alert.message}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span className="uppercase tracking-wider font-medium">{alert.source}</span>
                    <span>•</span>
                    <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
            {state.alerts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <ShieldAlert className="h-5 w-5 text-green-600" />
                </div>
                <p>All systems operational.</p>
                <p className="text-xs mt-1">No active alerts detected.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
