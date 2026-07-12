import { db } from '@/lib/firebase/config';
import { StatusTransitionPayload, TransitionResult, VehicleState } from './statusTypes';
import { VehicleStatusValidator } from './VehicleStatusValidator';
import { VehicleHistoryService } from './VehicleHistoryService';
import { VehicleNotificationService } from './VehicleNotificationService';

export class VehicleTransitionEngine {
  private historyService = new VehicleHistoryService();
  private notificationService = new VehicleNotificationService();

  /**
   * The core orchestrator. Executes a transition inside an atomic Firestore transaction.
   */
  public async executeTransition(payload: StatusTransitionPayload): Promise<TransitionResult> {
    const vehicleRef = db.collection('vehicles').doc(payload.vehicleId);

    try {
      const result = await db.runTransaction(async (transaction: any) => {
        const vehicleDoc = await transaction.get(vehicleRef);
        if (!vehicleDoc.exists) {
          throw new Error('Vehicle not found.');
        }

        const currentData = vehicleDoc.data();
        const currentStatus = currentData?.status as VehicleState || 'Draft';

        // 1. Centralized Validation
        const validation = VehicleStatusValidator.validate(currentStatus, payload);
        if (!validation.success) {
          throw new Error(validation.error || 'Validation failed.');
        }

        // 2. State Mutation
        transaction.update(vehicleRef, {
          status: payload.requestedState,
          updatedAt: new Date().toISOString(),
          updatedBy: payload.userId,
        });

        // 3. Immutable History Appended
        this.historyService.logTransition(
          transaction,
          payload.vehicleId,
          currentStatus,
          payload.requestedState,
          payload.userId,
          payload.reason,
          payload.triggerSource,
          payload.notes
        );

        return payload.requestedState;
      });

      // 4. Post-Transaction Hooks (Notifications)
      // We don't block the transaction for notifications, run them async
      this.notificationService.broadcast(payload.vehicleId, result, payload.triggerSource).catch(console.error);

      return { success: true, newState: result };
      
    } catch (error: any) {
      console.error(`VehicleTransitionEngine: Failed to transition vehicle ${payload.vehicleId}:`, error);
      return { 
        success: false, 
        error: error.message || 'Transaction failed.' 
      };
    }
  }
}
