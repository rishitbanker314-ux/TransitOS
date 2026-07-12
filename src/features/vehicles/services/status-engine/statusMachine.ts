import { VehicleState } from './statusTypes';

/**
 * Finite State Machine representing all valid state transitions.
 * Key: Current State
 * Value: Array of valid states the vehicle can transition to.
 */
export const statusMachine: Record<VehicleState, VehicleState[]> = {
  Draft: ['Available', 'Archived'],
  Available: [
    'Reserved',
    'Assigned',
    'MaintenanceScheduled',
    'Inactive',
    'Retired',
    'Archived',
  ],
  Reserved: ['Available', 'Assigned'],
  Assigned: ['Available', 'OnTrip'],
  OnTrip: ['Idle', 'Fueling', 'Available', 'Cleaning'],
  Idle: ['OnTrip'],
  Fueling: ['OnTrip', 'Available'],
  Cleaning: ['Available'],
  MaintenanceScheduled: ['UnderMaintenance', 'Available'],
  UnderMaintenance: ['Inspection', 'Available'],
  Inspection: ['Available', 'UnderMaintenance', 'Inactive'],
  Inactive: ['Available', 'Retired', 'Archived'],
  Archived: ['Draft', 'Inactive'], // Restore paths
  Retired: ['Disposed'],
  Disposed: [], // Terminal state
};

/**
 * Validates if a transition from state A to state B is structurally allowed by the FSM.
 */
export function isValidTransition(from: VehicleState, to: VehicleState): boolean {
  if (from === to) return false; // Redundant transitions are not allowed
  const allowedNextStates = statusMachine[from] || [];
  return allowedNextStates.includes(to);
}
