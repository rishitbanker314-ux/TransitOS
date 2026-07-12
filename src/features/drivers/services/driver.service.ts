import { runTransaction, doc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { DriverRepository } from '../repositories/driver.repository';
import { AuditService } from '@/lib/services/audit.service';
import { PermissionService } from '@/lib/services/permission.service';
import { CreateDriverDTO, DriverStatus } from '../types/driver.types';
import { driverSchema } from '../schemas/driver.schema';

export class DriverService {
  constructor(
    private repo: DriverRepository = new DriverRepository(),
    private audit: AuditService = new AuditService(),
    private permissions: PermissionService = new PermissionService()
  ) {}

  async createDriver(payload: CreateDriverDTO, userId: string): Promise<string> {
    this.permissions.requireRole(['admin', 'hr_manager', 'fleet_manager']);
    
    const validatedData = driverSchema.parse(payload);
    
    return await runTransaction(db, async (transaction) => {
      // We read the contact shadow collection to prevent duplicate email/phones
      const emailRef = doc(db, 'driver_contacts', `email_${validatedData.email}`);
      const phoneRef = doc(db, 'driver_contacts', `phone_${validatedData.phone}`);
      
      const [emailSnap, phoneSnap] = await Promise.all([
        transaction.get(emailRef),
        transaction.get(phoneRef)
      ]);
      
      if (emailSnap.exists()) {
        throw new Error('DUPLICATE_RESOURCE: A driver with this email already exists.');
      }
      if (phoneSnap.exists()) {
        throw new Error('DUPLICATE_RESOURCE: A driver with this phone number already exists.');
      }

      const driverRef = doc(collection(db, 'drivers'));
      const newDriver = {
        ...validatedData,
        id: driverRef.id,
        status: 'Available' as DriverStatus,
        isArchived: false,
        version: 1,
        createdAt: new Date().toISOString(),
        createdBy: userId,
      };

      transaction.set(emailRef, { driverId: driverRef.id });
      transaction.set(phoneRef, { driverId: driverRef.id });
      transaction.set(driverRef, newDriver);
      
      this.audit.logTransaction(transaction, {
        entityId: driverRef.id,
        entityType: 'DRIVER',
        action: 'CREATE',
        newData: newDriver,
        userId
      });

      return driverRef.id;
    });
  }

  async updateDriverStatus(driverId: string, newStatus: DriverStatus, userId: string): Promise<void> {
    this.permissions.requireRole(['admin', 'hr_manager', 'fleet_manager', 'dispatcher']);

    await runTransaction(db, async (transaction) => {
      const driverRef = doc(db, 'drivers', driverId);
      const snap = await transaction.get(driverRef);
      
      if (!snap.exists()) {
        throw new Error('NOT_FOUND: Driver does not exist.');
      }
      
      const data = snap.data();
      
      if (data.isArchived) {
        throw new Error('INVALID_STATE: Cannot update an archived driver.');
      }

      transaction.update(driverRef, { 
        status: newStatus, 
        version: data.version + 1, 
        updatedAt: new Date().toISOString(), 
        updatedBy: userId 
      });
      
      this.audit.logTransaction(transaction, {
        entityId: driverId,
        entityType: 'DRIVER',
        action: 'UPDATE_STATUS',
        oldData: { status: data.status },
        newData: { status: newStatus },
        userId
      });
    });
  }

  async assignToTrip(driverId: string, tripId: string, userId: string): Promise<void> {
    this.permissions.requireRole(['admin', 'dispatcher']);

    await runTransaction(db, async (transaction) => {
      const driverRef = doc(db, 'drivers', driverId);
      const snap = await transaction.get(driverRef);
      
      if (!snap.exists()) {
        throw new Error('NOT_FOUND: Driver does not exist.');
      }
      
      const data = snap.data();
      
      if (data.status !== 'Available') {
        throw new Error(`INVALID_STATE: Driver cannot be assigned. Current status is ${data.status}.`);
      }

      transaction.update(driverRef, { 
        status: 'Assigned', 
        version: data.version + 1, 
        updatedAt: new Date().toISOString(), 
        updatedBy: userId 
      });
      
      this.audit.logTransaction(transaction, {
        entityId: driverId,
        entityType: 'DRIVER',
        action: 'TRIP_ASSIGNMENT',
        oldData: { status: data.status },
        newData: { status: 'Assigned', tripId },
        userId
      });
    });
  }
}
