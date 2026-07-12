import React from 'react';
import { useCommandCenter } from '../hooks/useCommandCenter';
import { FleetSummaryCards } from './FleetSummaryCards';
import { FleetMap } from './FleetMap';
import { FleetOverview } from './FleetOverview';
import { ActiveTripsPanel } from './ActiveTripsPanel';
import { AlertCenter } from './AlertCenter';
import { ActivityFeed } from './ActivityFeed';
import { AIOperationsPanel } from './AIOperationsPanel';
import { QuickActions } from './QuickActions';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function CommandCenterPage() {
  const state = useCommandCenter();

  if (state.error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertTitle>Error loading Command Center</AlertTitle>
          <AlertDescription>
            {state.error.message || 'Failed to sync with Firestore realtime streams.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (state.isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col text-muted-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-lg">Initializing Mission Control...</p>
        <p className="text-sm">Syncing live fleet telemetry</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto bg-slate-50/50 dark:bg-slate-950/20 min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
          <p className="text-muted-foreground mt-1">
            Real-time fleet operations and dispatch oversight.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Live Sync Active
        </div>
      </div>

      {/* Top KPI Bar */}
      <FleetSummaryCards state={state} />

      {/* Main Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Map & Trips) */}
        <div className="lg:col-span-2 space-y-6">
          <FleetMap state={state} />
          <ActiveTripsPanel state={state} />
        </div>

        {/* Right Column (Alerts & Activity) */}
        <div className="space-y-6">
          <AlertCenter state={state} />
          <ActivityFeed state={state} />
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <FleetOverview state={state} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <AIOperationsPanel state={state} />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
