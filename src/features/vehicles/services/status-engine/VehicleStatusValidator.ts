import { VehicleState, StatusTransitionPayload, TransitionResult } from './statusTypes';
import { isValidTransition } from './statusMachine';
import { statusRules } from './statusRules';

export class VehicleStatusValidator {
  /**
   * Validates a requested transition against the FSM and all business rules.
   */
  public static validate(
    currentStatus: VehicleState,
    payload: StatusTransitionPayload
  ): TransitionResult {
    
    // 1. Check FSM Adjacency
    if (!isValidTransition(currentStatus, payload.requestedState)) {
      return {
        success: false,
        error: `Invalid transition from ${currentStatus} to ${payload.requestedState}.`,
        ruleViolated: 'FSM_CONSTRAINT'
      };
    }

    // 2. Evaluate all Business Rules
    for (const rule of statusRules) {
      if (!rule.validate(currentStatus, payload)) {
        return {
          success: false,
          error: rule.errorMessage,
          ruleViolated: rule.id
        };
      }
    }

    // 3. Permission checks (delegated to RBAC in real implementation, but verified here structurally)
    if (!this.checkPermissions(payload.userRole, currentStatus, payload.requestedState)) {
      return {
        success: false,
        error: 'You do not have permission to perform this transition.',
        ruleViolated: 'RBAC_CONSTRAINT'
      };
    }

    return { success: true, newState: payload.requestedState };
  }

  private static checkPermissions(role: string, from: VehicleState, to: VehicleState): boolean {
    // Simplified Matrix Check. In a real app, this integrates with PermissionService.
    if (role === 'Administrator' || role === 'System') return true;
    
    if (role === 'Dispatcher') {
      const allowedTo = ['Available', 'Reserved', 'Assigned', 'OnTrip'];
      return allowedTo.includes(to);
    }
    
    if (role === 'Maintenance') {
      const allowedTo = ['MaintenanceScheduled', 'UnderMaintenance', 'Inspection', 'Available'];
      return allowedTo.includes(to);
    }

    if (role === 'Driver') {
      const allowedTo = ['OnTrip', 'Idle', 'Fueling'];
      return allowedTo.includes(to);
    }

    if (role === 'FleetManager') {
      return to !== 'Disposed'; // Fleet managers can do almost everything except dispose
    }

    return false;
  }
}
