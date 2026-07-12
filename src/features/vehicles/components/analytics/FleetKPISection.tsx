import React from 'react';
import { Card } from '@/components/ui/card';
import { FleetSnapshot } from '../../types/analytics.types';
import { Car, CheckCircle2, Navigation, Wrench, AlertTriangle, Battery } from 'lucide-react';

interface FleetKPISectionProps {
  snapshot: FleetSnapshot;
}

export function FleetKPISection({ snapshot }: FleetKPISectionProps) {
  const kpis = [
    { label: 'Total Fleet', value: snapshot.totalVehicles, icon: Car, color: 'text-blue-500' },
    { label: 'Available', value: snapshot.availableVehicles, icon: CheckCircle2, color: 'text-green-500' },
    { label: 'On Trip', value: snapshot.onTripVehicles, icon: Navigation, color: 'text-purple-500' },
    { label: 'In Shop', value: snapshot.underMaintenanceVehicles, icon: Wrench, color: 'text-orange-500' },
    { label: 'Avg Health', value: `${snapshot.health.averageScore}/100`, icon: Battery, color: 'text-teal-500' },
    { label: 'Compliance', value: `${snapshot.compliance.score}%`, icon: AlertTriangle, color: 'text-indigo-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <Card key={idx} className="p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-muted-foreground">{kpi.label}</span>
              <Icon className={`h-5 w-5 ${kpi.color}`} />
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold">{kpi.value.toLocaleString()}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
