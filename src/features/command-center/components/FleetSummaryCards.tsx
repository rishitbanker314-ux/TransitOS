import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CommandCenterState } from '../types/command-center.types';
import { Car, Route, AlertTriangle, Wrench } from 'lucide-react';

export function FleetSummaryCards({ state }: { state: CommandCenterState }) {
  const totalVehicles = state.vehicles.length;
  const available = state.vehicles.filter(v => v.status === 'Available').length;
  const onTrip = state.vehicles.filter(v => v.status === 'On Trip').length;
  const inShop = state.vehicles.filter(v => v.status === 'In Shop').length;
  
  const activeTrips = state.activeTrips.length;
  const criticalAlerts = state.alerts.filter(a => a.severity === 'Critical').length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fleet Availability</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{available} / {totalVehicles}</div>
          <p className="text-xs text-muted-foreground">Vehicles ready for dispatch</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
          <Route className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeTrips}</div>
          <p className="text-xs text-muted-foreground">{onTrip} vehicles currently on route</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Under Maintenance</CardTitle>
          <Wrench className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inShop}</div>
          <p className="text-xs text-muted-foreground">Vehicles in the shop</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
          <AlertTriangle className={criticalAlerts > 0 ? "h-4 w-4 text-red-500" : "h-4 w-4 text-muted-foreground"} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{criticalAlerts}</div>
          <p className="text-xs text-muted-foreground">Require immediate attention</p>
        </CardContent>
      </Card>
    </div>
  );
}
