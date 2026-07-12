export type TripStatus = 
  | 'Draft'
  | 'Scheduled'
  | 'Assigned'
  | 'InProgress'
  | 'Paused'
  | 'Completed'
  | 'Cancelled';

export type TripEventType =
  | 'Created'
  | 'StatusChange'
  | 'Assigned'
  | 'Delay'
  | 'Emergency'
  | 'Note';

export interface TripLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface TripStop {
  id: string;
  location: TripLocation;
  plannedArrivalTime: string; // ISO String
  actualArrivalTime?: string; // ISO String
  status: 'Pending' | 'Reached' | 'Skipped';
}

export interface TripRoute {
  origin: TripLocation;
  destination: TripLocation;
  stops: TripStop[];
  estimatedDistanceKm: number;
  actualDistanceKm?: number;
}

export interface TripSchedule {
  plannedStartTime: string; // ISO String
  plannedEndTime: string;   // ISO String
  actualStartTime?: string; // ISO String
  actualEndTime?: string;   // ISO String
}

export interface Trip {
  id: string;
  title: string;
  status: TripStatus;
  vehicleId?: string;
  driverId?: string;
  route: TripRoute;
  schedule: TripSchedule;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  createdBy: string; // User ID
  metadata?: Record<string, any>;
}

export interface TripEvent {
  id: string;
  tripId: string;
  type: TripEventType;
  timestamp: string; // ISO
  userId: string;
  message: string;
  metadata?: Record<string, any>;
}
