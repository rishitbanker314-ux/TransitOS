import React from 'react';
import { Card } from '@/components/ui/card';

// Note: In production, we would use 'recharts' or 'chart.js'.
// For this architectural implementation, we render accessible CSS bars.

export function FleetCharts() {
  const data = [
    { label: 'Mon', util: 78, maint: 12 },
    { label: 'Tue', util: 82, maint: 10 },
    { label: 'Wed', util: 85, maint: 8 },
    { label: 'Thu', util: 80, maint: 15 },
    { label: 'Fri', util: 88, maint: 5 },
    { label: 'Sat', util: 45, maint: 20 },
    { label: 'Sun', util: 40, maint: 22 },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">7-Day Operations Trend</h3>
      <div className="h-48 flex items-end justify-between gap-2 border-b pb-2">
        {data.map((day) => (
          <div key={day.label} className="w-full flex flex-col justify-end items-center gap-1 group">
            <div className="w-full max-w-[40px] flex flex-col justify-end h-full gap-1">
              <div 
                className="w-full bg-blue-500 rounded-t-sm transition-all group-hover:opacity-80" 
                style={{ height: `${day.util}%` }}
                title={`Utilization: ${day.util}%`}
              />
              <div 
                className="w-full bg-orange-400 rounded-b-sm transition-all group-hover:opacity-80" 
                style={{ height: `${day.maint}%` }}
                title={`Maintenance: ${day.maint}%`}
              />
            </div>
            <span className="text-xs text-muted-foreground mt-2">{day.label}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-3 h-3 bg-blue-500 rounded-full" /> Utilization
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-3 h-3 bg-orange-400 rounded-full" /> Down for Maintenance
        </div>
      </div>
    </Card>
  );
}
