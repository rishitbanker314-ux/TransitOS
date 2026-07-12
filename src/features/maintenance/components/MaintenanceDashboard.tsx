import React from 'react';
import { useMaintenance } from '../hooks/useMaintenance';
import { WorkOrderTable } from './WorkOrderTable';
import { WorkshopKanban } from './WorkshopKanban';
import { PredictiveMaintenancePanel } from './PredictiveMaintenancePanel';
import { Loader2, Plus, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MaintenanceDashboard() {
  const { jobs, loading } = useMaintenance();

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col text-muted-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-lg">Loading Workshop Data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto bg-slate-50/50 dark:bg-slate-950/20 min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Wrench className="h-8 w-8 text-orange-500" /> Maintenance Engine
          </h1>
          <p className="text-muted-foreground mt-1">
            Enterprise fleet repair, inspection, and predictive maintenance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Workshop Roster</Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Create Work Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <WorkOrderTable jobs={jobs} />
        </div>
        <div className="lg:col-span-1">
          <PredictiveMaintenancePanel />
        </div>
      </div>

      <WorkshopKanban jobs={jobs} />
    </div>
  );
}
