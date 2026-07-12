import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Licence, Certification } from '../types/compliance.types';

export class ComplianceRepository {
  private licenceCollection = 'driver_licences';
  private certCollection = 'driver_certifications';

  async getLicencesByDriver(driverId: string): Promise<Licence[]> {
    const q = query(
      collection(db, this.licenceCollection),
      where('driverId', '==', driverId),
      where('isArchived', '==', false)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as Licence);
  }

  async getCertificationsByDriver(driverId: string): Promise<Certification[]> {
    const q = query(
      collection(db, this.certCollection),
      where('driverId', '==', driverId),
      where('isArchived', '==', false)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as Certification);
  }

  async getExpiringLicences(beforeDateIso: string): Promise<Licence[]> {
    const q = query(
      collection(db, this.licenceCollection),
      where('expiresAt', '<=', beforeDateIso),
      where('isArchived', '==', false),
      where('status', 'in', ['Valid', 'Expiring Soon'])
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as Licence);
  }
}
