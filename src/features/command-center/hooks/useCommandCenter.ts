import { useState, useEffect, useMemo } from 'react';
import { CommandCenterService } from '../services/CommandCenterService';
import { CommandCenterState, ActivityEvent, CommandAlert } from '../types/command-center.types';
import { Vehicle } from '../../vehicles/types/vehicle.types';
import { Trip } from '../../trips/types/trip.types';

export function useCommandCenter() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeTrips, setActiveTrips] = useState<Trip[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const service = useMemo(() => new CommandCenterService(), []);

  useEffect(() => {
    let unsubs: Array<() => void> = [];
    let loadedCount = 0;

    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount >= 3) {
        setIsLoading(false);
      }
    };

    try {
      const unsubVehicles = service.subscribeToFleet((v) => {
        setVehicles(v);
        checkLoaded();
      });

      const unsubTrips = service.subscribeToActiveTrips((t) => {
        setActiveTrips(t);
        checkLoaded();
      });

      const unsubActivity = service.subscribeToActivityFeed((a) => {
        setRecentActivity(a);
        checkLoaded();
      });

      unsubs = [unsubVehicles, unsubTrips, unsubActivity];
    } catch (err: any) {
      setError(err);
      setIsLoading(false);
    }

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [service]);

  const alerts = useMemo(() => service.computeAlerts(vehicles, activeTrips), [vehicles, activeTrips, service]);

  const state: CommandCenterState = {
    vehicles,
    activeTrips,
    alerts,
    recentActivity,
    isLoading,
    error
  };

  return state;
}
