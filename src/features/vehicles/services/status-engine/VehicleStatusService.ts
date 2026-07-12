import { StatusTransitionPayload, TransitionResult } from './statusTypes';
import { VehicleTransitionEngine } from './VehicleTransitionEngine';

/**
 * Public Facade for the Vehicle Status Engine.
 * Other modules (Trips, Maintenance, Admin UI) interact exclusively with this service.
 */
export class VehicleStatusService {
  private engine = new VehicleTransitionEngine();

  /**
   * Request a status transition for a vehicle.
   */
  public async requestTransition(payload: StatusTransitionPayload): Promise<TransitionResult> {
    return this.engine.executeTransition(payload);
  }

  /**
   * Helper method specifically for the Trip Module to dispatch a vehicle.
   */
  public async dispatchForTrip(vehicleId: string, userId: string, checklistComplete: boolean): Promise<TransitionResult> {
    return this.requestTransition({
      vehicleId,
      requestedState: 'OnTrip',
      userId,
      userRole: 'System', // Internal system execution
      reason: 'Automated transition: Trip Started',
      triggerSource: 'trip_module',
      context: {
        checklistComplete
      }
    });
  }

  /**
   * Helper method specifically for the Maintenance Module to start repairs.
   */
  public async startMaintenance(vehicleId: string, userId: string, mechanicNotes: string): Promise<TransitionResult> {
    return this.requestTransition({
      vehicleId,
      requestedState: 'UnderMaintenance',
      userId,
      userRole: 'Maintenance',
      reason: 'Vehicle checked into shop',
      triggerSource: 'maintenance_module',
      notes: mechanicNotes
    });
  }
}
