import React from 'react';
import { Card } from '@/components/ui/card';
import { FleetAlert } from '../../types/analytics.types';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FleetAlertsProps {
  alerts: FleetAlert[];
}

export function FleetAlerts({ alerts }: FleetAlertsProps) {
  const getIcon = (severity: string) => {
    switch (severity) {
      case 'Critical': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'Warning': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBg = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500/10 border-red-200';
      case 'Warning': return 'bg-orange-500/10 border-orange-200';
      default: return 'bg-blue-500/10 border-blue-200';
    }
  };

  return (
    <Card className="p-6 flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4">Action Center</h3>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {alerts.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center mt-10">No active alerts. All clear!</p>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-md border ${getBg(alert.severity)}`}>
              <div className="mt-0.5">{getIcon(alert.severity)}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{alert.message}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">Just now</span>
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs font-semibold">
                    {alert.actionRequired}
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
