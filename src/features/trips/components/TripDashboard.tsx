import React from 'react';
import { Card } from '@/components/ui/card';
import { useTrips } from '../hooks/useTrips';
import { TripTable } from './TripTable';
import { Activity, Clock, Navigation, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DispatchDialog } from './DispatchDialog';

export function TripDashboard() {
  const { trips, loading, error } = useTrips();
  const [isDispatchOpen, setIsDispatchOpen] = React.useState(false);
  const [selectedTripId, setSelectedTripId] = React.useState<string | null>(null);

  if (loading) return <div className="p-8 text-center animate-pulse">Loading Live Operations...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  const inProgress = trips.filter(t => t.status === 'InProgress').length;
  const assigned = trips.filter(t => t.status === 'Assigned').length;
  const draft = trips.filter(t => t.status === 'Draft' || t.status === 'Scheduled').length;

  const handleDispatch = (tripId: string) => {
    setSelectedTripId(tripId);
    setIsDispatchOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Live Operations Dashboard</h1>
          <p className="text-muted-foreground">Real-time trip tracking and dispatch.</p>
        </div>
        <Button onClick={() => console.log('Open Create Trip')}>Create Trip</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Navigation /></div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold">{inProgress}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full"><Activity /></div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Assigned (Ready)</p>
            <p className="text-2xl font-bold">{assigned}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><Clock /></div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pending Dispatch</p>
            <p className="text-2xl font-bold">{draft}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4 border-red-200 bg-red-50/50">
          <div className="p-3 bg-red-100 text-red-600 rounded-full"><AlertTriangle /></div>
          <div>
            <p className="text-sm font-medium text-red-800">Delays / Exceptions</p>
            <p className="text-2xl font-bold text-red-900">0</p>
          </div>
        </Card>
      </div>

      {/* Main Board */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Active Board</h2>
        <TripTable trips={trips} onDispatchClick={handleDispatch} />
      </Card>

      {/* Dispatch Modal */}
      <DispatchDialog 
        open={isDispatchOpen} 
        onOpenChange={setIsDispatchOpen} 
        trip={trips.find(t => t.id === selectedTripId) || null} 
      />
    </div>
  );
}
