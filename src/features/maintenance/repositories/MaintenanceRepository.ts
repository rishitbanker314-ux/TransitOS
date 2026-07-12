import { db } from '@/lib/firebase/config';
import { MaintenanceJob } from '../types/maintenance.types';

export class MaintenanceRepository {
  private collectionPath = 'maintenance_jobs';

  async createJob(job: MaintenanceJob): Promise<void> {
    const docRef = db.collection(this.collectionPath).doc(job.id);
    await docRef.set(job);
  }

  async getJob(jobId: string): Promise<MaintenanceJob | null> {
    const docRef = db.collection(this.collectionPath).doc(jobId);
    const snap = await docRef.get();
    return snap.exists ? (snap.data() as MaintenanceJob) : null;
  }

  async getActiveJobsForVehicle(vehicleId: string): Promise<MaintenanceJob[]> {
    const snap = await db.collection(this.collectionPath)
      .where('vehicleId', '==', vehicleId)
      .where('status', 'in', ['Pending', 'Scheduled', 'InProgress', 'Inspection'])
      .get();
    
    return snap.docs.map((doc: any) => doc.data() as MaintenanceJob);
  }
}
