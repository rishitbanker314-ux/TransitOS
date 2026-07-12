import { runTransaction, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { AuditService } from '@/lib/services/audit.service';
import { PermissionService } from '@/lib/services/permission.service';
import { UpdateVehicleDTO, Vehicle } from '../types/vehicle.types';
import { vehicleSchema } from '../schemas/vehicle.schema';
import { VehicleDiffEngine } from './VehicleDiffEngine';

export class VehicleEditService {
  constructor(
    private audit: AuditService = new AuditService(),
    private permissions: PermissionService = new PermissionService()
  ) {}

  /**
   * Updates a vehicle document securely, with version checking and audit logging.
   */
  async updateVehicle(
    vehicleId: string, 
    payload: UpdateVehicleDTO, 
    userId: string,
    currentVersion: number
  ): Promise<void> {
    
    // Partial schema validation for updates (ignoring required fields not present in payload)
    const partialSchema = vehicleSchema.partial();
    const validatedData = partialSchema.parse(payload);

    return await runTransaction(db, async (transaction) => {
      const vehicleRef = doc(db, 'vehicles', vehicleId);
      const vehicleSnap = await transaction.get(vehicleRef);
      
      if (!vehicleSnap.exists()) {
        throw new Error('NOT_FOUND: Vehicle does not exist.');
      }
      
      const currentData = vehicleSnap.data() as Vehicle;
      
      // Concurrency control: prevent overwriting newer changes
      if (currentData.version !== currentVersion) {
        throw new Error(`CONFLICT: Document has been modified by another user. (Current version: ${currentData.version}, Submitted version: ${currentVersion})`);
      }

      // Check permissions based on fields being modified
      this.checkFieldLevelPermissions(currentData, validatedData);
      
      // Compute differences
      const changes = VehicleDiffEngine.computeDifferences(currentData, validatedData);
      
      if (changes.length === 0) {
        return; // Nothing to update
      }

      const { oldData, newData } = VehicleDiffEngine.getAuditData(changes);

      // Perform update with incremented version
      const updatePayload = {
        ...newData,
        version: currentData.version + 1,
        updatedAt: new Date().toISOString(),
        updatedBy: userId
      };

      transaction.update(vehicleRef, updatePayload);
      
      this.audit.logTransaction(transaction, {
        entityId: vehicleId,
        entityType: 'VEHICLE',
        action: 'UPDATE',
        oldData,
        newData,
        userId
      });
    });
  }

  private checkFieldLevelPermissions(currentData: Vehicle, updatedData: Partial<Vehicle>) {
    // Identity fields usually require higher permissions
    const identityFields: Array<keyof Vehicle> = ['registrationNumber', 'vin'];
    
    const isEditingIdentity = identityFields.some(field => updatedData[field] !== undefined && updatedData[field] !== currentData[field]);
    
    if (isEditingIdentity) {
      this.permissions.requireRole(['admin', 'fleet_manager']);
    } else {
      // General edits might be allowed for dispatchers or others depending on business rules
      this.permissions.requireRole(['admin', 'fleet_manager', 'dispatcher']);
    }
    
    // Additional business rules (e.g. Odometer cannot decrease)
    if (updatedData.currentOdometer !== undefined && updatedData.currentOdometer < currentData.currentOdometer) {
      throw new Error('VALIDATION_ERROR: Odometer reading cannot be decreased.');
    }
  }
}
