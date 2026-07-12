import { runTransaction, doc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ComplianceRepository } from '../repositories/compliance.repository';
import { DriverRepository } from '../repositories/driver.repository';
import { AuditService } from '@/lib/services/audit.service';
import { PermissionService } from '@/lib/services/permission.service';
import { Licence } from '../types/compliance.types';

export class ComplianceService {
  constructor(
    private complianceRepo: ComplianceRepository = new ComplianceRepository(),
    private driverRepo: DriverRepository = new DriverRepository(),
    private audit: AuditService = new AuditService(),
    private permissions: PermissionService = new PermissionService()
  ) {}

  async checkExpirationsAndAlert(): Promise<void> {
    // This would typically be triggered by a scheduled Cloud Function
    // We check for licences expiring in the next 30 days
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const expiringLicences = await this.complianceRepo.getExpiringLicences(thirtyDaysFromNow.toISOString());
    
    for (const licence of expiringLicences) {
      if (new Date(licence.expiresAt) < new Date()) {
        await this.handleExpiredLicence(licence);
      } else if (licence.status === 'Valid') {
        await this.markLicenceExpiringSoon(licence);
      }
    }
  }

  private async handleExpiredLicence(licence: Licence): Promise<void> {
    await runTransaction(db, async (transaction) => {
      const licenceRef = doc(db, 'driver_licences', licence.id);
      const driverRef = doc(db, 'drivers', licence.driverId);
      
      const [licenceSnap, driverSnap] = await Promise.all([
        transaction.get(licenceRef),
        transaction.get(driverRef)
      ]);
      
      if (!licenceSnap.exists() || !driverSnap.exists()) return;
      
      const driverData = driverSnap.data();
      
      transaction.update(licenceRef, { 
        status: 'Expired',
        version: licenceSnap.data().version + 1,
        updatedAt: new Date().toISOString(),
        updatedBy: 'SYSTEM'
      });
      
      transaction.update(driverRef, {
        status: 'Suspended',
        version: driverData.version + 1,
        updatedAt: new Date().toISOString(),
        updatedBy: 'SYSTEM'
      });
      
      this.audit.logTransaction(transaction, {
        entityId: licence.driverId,
        entityType: 'DRIVER',
        action: 'AUTO_SUSPEND',
        oldData: { status: driverData.status },
        newData: { status: 'Suspended', reason: 'Licence Expired' },
        userId: 'SYSTEM'
      });
    });
  }

  private async markLicenceExpiringSoon(licence: Licence): Promise<void> {
    await runTransaction(db, async (transaction) => {
      const licenceRef = doc(db, 'driver_licences', licence.id);
      const snap = await transaction.get(licenceRef);
      if (!snap.exists()) return;
      
      transaction.update(licenceRef, {
        status: 'Expiring Soon',
        version: snap.data().version + 1,
        updatedAt: new Date().toISOString(),
        updatedBy: 'SYSTEM'
      });
      
      this.audit.logTransaction(transaction, {
        entityId: licence.id,
        entityType: 'LICENCE',
        action: 'UPDATE_STATUS',
        oldData: { status: 'Valid' },
        newData: { status: 'Expiring Soon' },
        userId: 'SYSTEM'
      });
    });
  }
}
