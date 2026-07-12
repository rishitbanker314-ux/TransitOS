import { db } from '@/lib/firebase/config';
import { VehicleState } from './statusTypes';
import { v4 as uuidv4 } from 'uuid';

export class VehicleNotificationService {
  private collectionName = 'notifications';

  /**
   * Evaluates if a state transition requires broadcasting a notification to users.
   */
  public async broadcast(
    vehicleId: string, 
    newState: VehicleState, 
    triggerSource: string
  ): Promise<void> {
    
    let type = '';
    let message = '';
    let roleTarget = '';

    if (newState === 'MaintenanceScheduled') {
      type = 'MAINTENANCE_ALERT';
      message = `Vehicle ${vehicleId} has been scheduled for maintenance.`;
      roleTarget = 'Maintenance';
    } else if (newState === 'Inactive') {
      type = 'COMPLIANCE_ALERT';
      message = `Vehicle ${vehicleId} has become inactive (Possible document expiry).`;
      roleTarget = 'SafetyOfficer';
    } else if (newState === 'Inspection') {
      type = 'INSPECTION_REQUIRED';
      message = `Vehicle ${vehicleId} requires a safety inspection.`;
      roleTarget = 'SafetyOfficer';
    } else if (newState === 'Retired') {
      type = 'LIFECYCLE_ALERT';
      message = `Vehicle ${vehicleId} has been retired.`;
      roleTarget = 'Administrator';
    }

    // Only dispatch if it matches an alerting state
    if (type) {
      const docRef = db.collection(this.collectionName).doc(uuidv4());
      await docRef.set({
        id: docRef.id,
        entityId: vehicleId,
        entityType: 'vehicle',
        type,
        message,
        roleTarget,
        triggerSource,
        timestamp: new Date().toISOString(),
        read: false
      });
    }
  }
}
