import { Vehicle } from '../../vehicles/types/vehicle.types';
import { Trip } from '../../trips/types/trip.types';

export interface CommandAlert {
  id: string;
  severity: 'Critical' | 'Warning' | 'Info';
  message: string;
  source: 'Vehicle' | 'Trip' | 'System';
  timestamp: string;
  entityId?: string;
}

export interface ActivityEvent {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface CommandCenterState {
  vehicles: Vehicle[];
  activeTrips: Trip[];
  alerts: CommandAlert[];
  recentActivity: ActivityEvent[];
  isLoading: boolean;
  error: Error | null;
}
