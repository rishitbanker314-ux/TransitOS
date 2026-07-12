import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Trip } from '../types/trip.types';
import { Button } from '@/components/ui/button';
import { Sparkles, Car, User, Loader2 } from 'lucide-react';
import { suggestDispatchPairing, DispatchRecommendation } from '../actions/TripDispatchAI.actions';
import { FleetAnalyticsService } from '../../vehicles/services/analytics/FleetAnalyticsService';

interface DispatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: Trip | null;
}

export function DispatchDialog({ open, onOpenChange, trip }: DispatchDialogProps) {
  const [recommendation, setRecommendation] = useState<DispatchRecommendation | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);

  useEffect(() => {
    if (open && trip) {
      setIsAnalyzing(true);
      const service = new FleetAnalyticsService();
      service.getLatestSnapshot().then(snap => {
        suggestDispatchPairing(trip, snap).then(rec => {
          setRecommendation(rec);
          setIsAnalyzing(false);
        });
      });
    } else {
      setRecommendation(null);
    }
  }, [open, trip]);

  const handleDispatch = async () => {
    setIsDispatching(true);
    // In production, this would call TripDispatchEngine.dispatch()
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsDispatching(false);
    onOpenChange(false);
  };

  if (!trip) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Dispatch Trip: {trip.title}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-1">Route</h4>
            <p className="text-sm text-muted-foreground">
              {trip.route.origin.address} → {trip.route.destination.address}
            </p>
          </div>

          <div className="border rounded-md p-4 bg-muted/30">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <h4 className="font-semibold">AI Dispatch Recommendation</h4>
            </div>

            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mb-2 text-blue-500" />
                <span className="text-sm">Analyzing fleet capacity...</span>
              </div>
            ) : recommendation ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-background p-3 rounded border">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><Car className="h-4 w-4" /></div>
                    <div>
                      <p className="text-xs text-muted-foreground">Vehicle</p>
                      <p className="text-sm font-semibold">{recommendation.recommendedVehicleId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-background p-3 rounded border">
                    <div className="p-2 bg-green-100 text-green-600 rounded-full"><User className="h-4 w-4" /></div>
                    <div>
                      <p className="text-xs text-muted-foreground">Driver</p>
                      <p className="text-sm font-semibold">{recommendation.recommendedDriverId}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                  <span className="font-semibold mr-1">Reasoning:</span>
                  {recommendation.reasoning}
                </div>

                {recommendation.identifiedRisks.length > 0 && (
                  <div className="bg-orange-50 p-3 rounded text-sm text-orange-800">
                    <span className="font-semibold block mb-1">Identified Risks:</span>
                    <ul className="list-disc list-inside">
                      {recommendation.identifiedRisks.map((risk, i) => (
                        <li key={i}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDispatching}>
            Cancel
          </Button>
          <Button onClick={handleDispatch} disabled={isAnalyzing || isDispatching}>
            {isDispatching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Confirm Dispatch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
