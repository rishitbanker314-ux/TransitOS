import React from 'react';
import { Card } from '@/components/ui/card';
import { FleetSnapshot } from '../../types/analytics.types';

interface VehicleHealthCardProps {
  health: FleetSnapshot['health'];
}

export function VehicleHealthCard({ health }: VehicleHealthCardProps) {
  const total = health.excellentCount + health.goodCount + health.warningCount + health.criticalCount;
  
  const getWidth = (count: number) => `${Math.max((count / total) * 100, 2)}%`;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Fleet Health Distribution</h3>
      
      <div className="flex h-6 rounded-full overflow-hidden mb-6">
        <div style={{ width: getWidth(health.excellentCount) }} className="bg-green-500 hover:opacity-80 transition-opacity" title={`Excellent: ${health.excellentCount}`} />
        <div style={{ width: getWidth(health.goodCount) }} className="bg-blue-500 hover:opacity-80 transition-opacity" title={`Good: ${health.goodCount}`} />
        <div style={{ width: getWidth(health.warningCount) }} className="bg-orange-400 hover:opacity-80 transition-opacity" title={`Warning: ${health.warningCount}`} />
        <div style={{ width: getWidth(health.criticalCount) }} className="bg-red-500 hover:opacity-80 transition-opacity" title={`Critical: ${health.criticalCount}`} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"/> Excellent</span>
          <span className="font-semibold">{health.excellentCount}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"/> Good</span>
          <span className="font-semibold">{health.goodCount}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-400"/> Warning</span>
          <span className="font-semibold">{health.warningCount}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"/> Critical</span>
          <span className="font-semibold">{health.criticalCount}</span>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t flex justify-between items-center">
        <span className="text-sm font-medium">Average Fleet Score</span>
        <span className="text-xl font-bold text-teal-600">{health.averageScore}/100</span>
      </div>
    </Card>
  );
}
