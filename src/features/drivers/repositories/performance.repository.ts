import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Incident } from '../types/compliance.types';

export class PerformanceRepository {
  private incidentCollection = 'driver_incidents';

  async getIncidentsByDriver(driverId: string): Promise<Incident[]> {
    const q = query(
      collection(db, this.incidentCollection),
      where('driverId', '==', driverId),
      where('isArchived', '==', false)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as Incident);
  }
}
