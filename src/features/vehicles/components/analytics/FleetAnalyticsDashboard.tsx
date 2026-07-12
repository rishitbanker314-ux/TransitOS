import React from 'react';
import { useFleetAnalytics } from '../../hooks/useFleetAnalytics';
import { FleetKPISection } from './FleetKPISection';
import { VehicleHealthCard } from './VehicleHealthCard';
import { FleetAlerts } from './FleetAlerts';
import { FleetCharts } from './FleetCharts';
import { ComplianceDashboard } from './ComplianceDashboard';
import { FleetUtilization } from './FleetUtilization';
import { FleetCostAnalysis } from './FleetCostAnalysis';
import { FleetAIInsights } from './FleetAIInsights';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';

export function FleetAnalyticsDashboard() {
  const { snapshot, alerts, aiInsights, isLoading, isAILoading, error } = useFleetAnalytics();

  if (isLoading && !snapshot) {
    return (
      <div className="flex justify-center items-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !snapshot) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-md">
        <p className="font-bold">Dashboard Error</p>
        <p>{error || 'Failed to load snapshot'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fleet Intelligence</h1>
          <p className="text-sm text-muted-foreground">Operational telemetry and AI insights.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Button variant="default" size="sm">
            <Download className="h-4 w-4 mr-2" /> Export Report
          </Button>
        </div>
      </div>

      {/* Top KPIs */}
      <FleetKPISection snapshot={snapshot} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Charts & AI) */}
        <div className="lg:col-span-2 space-y-6">
          <FleetCharts />
          <FleetAIInsights insights={aiInsights} isLoading={isAILoading} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FleetUtilization utilization={snapshot.utilization} />
            <FleetCostAnalysis costs={snapshot.costs} />
          </div>
        </div>

        {/* Right Column (Alerts, Health, Compliance) */}
        <div className="space-y-6">
          <div className="h-[300px]">
             <FleetAlerts alerts={alerts} />
          </div>
          <VehicleHealthCard health={snapshot.health} />
          <ComplianceDashboard compliance={snapshot.compliance} />
        </div>
        
      </div>
    </div>
  );
}
