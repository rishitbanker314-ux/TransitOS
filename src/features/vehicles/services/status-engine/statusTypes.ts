export type VehicleState =
  | 'Draft'
  | 'Available'
  | 'Reserved'
  | 'Assigned'
  | 'OnTrip'
  | 'Idle'
  | 'MaintenanceScheduled'
  | 'UnderMaintenance'
  | 'Inspection'
  | 'Fueling'
  | 'Cleaning'
  | 'Inactive'
  | 'Archived'
  | 'Retired'
  | 'Disposed';

export type UserRole =
  | 'Administrator'
  | 'FleetManager'
  | 'Dispatcher'
  | 'SafetyOfficer'
  | 'Maintenance'
  | 'Driver'
  | 'CleaningCrew'
  | 'System';

export interface StatusTransitionPayload {
  vehicleId: string;
  requestedState: VehicleState;
  userId: string;
  userRole: UserRole;
  reason: string;
  triggerSource: string; // e.g. 'trip_start', 'manual_override', 'maintenance_complete'
  notes?: string;
  // Context-specific validation data
  context?: {
    currentOdometer?: number;
    newOdometer?: number;
    checklistComplete?: boolean;
    insuranceExpiry?: Date;
  };
}

export interface TransitionResult {
  success: boolean;
  newState?: VehicleState;
  error?: string;
  ruleViolated?: string;
}

export interface VehicleStatusHistoryRecord {
  id: string;
  vehicleId: string;
  oldStatus: VehicleState;
  newStatus: VehicleState;
  timestamp: string; // ISO 8601 string
  userId: string;
  reason: string;
  triggerSource: string;
  notes?: string;
}
