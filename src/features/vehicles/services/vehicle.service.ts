import { runTransaction, doc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { VehicleRepository } from '../repositories/vehicle.repository';
import { AuditService } from '@/lib/services/audit.service';
import { PermissionService } from '@/lib/services/permission.service';
import { CreateVehicleDTO, VehicleStatus } from '../types/vehicle.types';
import { vehicleSchema } from '../schemas/vehicle.schema';

export class VehicleService {
  constructor(
    private repo: VehicleRepository = new VehicleRepository(),
    private audit: AuditService = new AuditService(),
    private permissions: PermissionService = new PermissionService()
  ) {}

  async createVehicle(payload: CreateVehicleDTO, userId: string): Promise<string> {
    this.permissions.requireRole(['admin', 'fleet_manager']);
    
    const validatedData = vehicleSchema.parse(payload);
    
    return await runTransaction(db, async (transaction) => {
      const regRef = doc(db, 'vehicle_registrations', validatedData.registrationNumber);
      const regSnap = await transaction.get(regRef);
      
      if (regSnap.exists()) {
        throw new Error('DUPLICATE_REGISTRATION: A vehicle with this registration already exists.');
      }

      const vehicleRef = doc(collection(db, 'vehicles'));
      const newVehicle = {
        ...validatedData,
        id: vehicleRef.id,
        status: 'Available' as VehicleStatus,
        isArchived: false,
        version: 1,
        createdAt: new Date().toISOString(),
        createdBy: userId,
      };

      transaction.set(regRef, { vehicleId: vehicleRef.id });
      transaction.set(vehicleRef, newVehicle);
      
      this.audit.logTransaction(transaction, {
        entityId: vehicleRef.id,
        entityType: 'VEHICLE',
        action: 'CREATE',
        newData: newVehicle,
        userId
      });

      return vehicleRef.id;
    });
  }

  async retireVehicle(vehicleId: string, userId: string): Promise<void> {
    this.permissions.requireRole(['admin', 'fleet_manager']);

    await runTransaction(db, async (transaction) => {
      const vehicleRef = doc(db, 'vehicles', vehicleId);
      const snap = await transaction.get(vehicleRef);
      
      if (!snap.exists()) {
        throw new Error('NOT_FOUND: Vehicle does not exist.');
      }
      
      const data = snap.data();
      
      if (data.status !== 'Available') {
        throw new Error('INVALID_STATE: Only Available vehicles can be retired.');
      }

      transaction.update(vehicleRef, { 
        status: 'Retired', 
        version: data.version + 1, 
        updatedAt: new Date().toISOString(), 
        updatedBy: userId 
      });
      
      this.audit.logTransaction(transaction, {
        entityId: vehicleId,
        entityType: 'VEHICLE',
        action: 'RETIRE',
        oldData: { status: data.status },
        newData: { status: 'Retired' },
        userId
      });
    });
  }
}
