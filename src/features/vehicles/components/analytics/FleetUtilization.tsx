import React from 'react';
import { Card } from '@/components/ui/card';
import { FleetSnapshot } from '../../types/analytics.types';
import { Activity, Clock } from 'lucide-react';

interface FleetUtilizationProps {
  utilization: FleetSnapshot['utilization'];
}

export function FleetUtilization({ utilization }: FleetUtilizationProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Utilization Metrics</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span className="text-sm font-medium">Avg Fleet Util.</span>
          </div>
          <div className="text-2xl font-bold">{utilization.averageFleetUtilization}%</div>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Avg Trip Time</span>
          </div>
          <div className="text-2xl font-bold">{utilization.averageTripDurationHours}h</div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Idle Percentage</span>
          <span className="font-bold">{utilization.idlePercentage}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500" 
            style={{ width: `${utilization.idlePercentage}%` }} 
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Target idle percentage is under 15% for optimal ROI.
        </p>
      </div>
    </Card>
  );
}
