import { db } from '@/lib/firebase/config';
import { VehicleState, VehicleStatusHistoryRecord } from './statusTypes';
import { v4 as uuidv4 } from 'uuid';

export class VehicleHistoryService {
  private collectionName = 'vehicle_status_history';

  /**
   * Appends an immutable audit log entry to the history subcollection inside a transaction.
   */
  public logTransition(
    transaction: any, // Firebase Transaction
    vehicleId: string,
    oldStatus: VehicleState,
    newStatus: VehicleState,
    userId: string,
    reason: string,
    triggerSource: string,
    notes?: string
  ): void {
    const historyRef = db.collection('vehicles').doc(vehicleId).collection(this.collectionName).doc(uuidv4());
    
    const record: VehicleStatusHistoryRecord = {
      id: historyRef.id,
      vehicleId,
      oldStatus,
      newStatus,
      timestamp: new Date().toISOString(),
      userId,
      reason,
      triggerSource,
      notes
    };

    transaction.set(historyRef, record);
  }
}
