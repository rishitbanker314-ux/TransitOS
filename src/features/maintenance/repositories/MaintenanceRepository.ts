import { db } from '../../../lib/firebase/config';
import { collection, doc, getDoc, getDocs, query, where, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { MaintenanceJob } from '../types/maintenance.types';

export class MaintenanceRepository {
  private collectionPath = 'maintenance_jobs';

  async createJob(job: MaintenanceJob): Promise<void> {
    const docRef = doc(db, this.collectionPath, job.id);
    await setDoc(docRef, job);
  }

  async getJob(jobId: string): Promise<MaintenanceJob | null> {
    const docRef = doc(db, this.collectionPath, jobId);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as MaintenanceJob) : null;
  }

  async getActiveJobsForVehicle(vehicleId: string): Promise<MaintenanceJob[]> {
    const jobsCollection = collection(db, this.collectionPath);
    const q = query(
      jobsCollection,
      where('vehicleId', '==', vehicleId),
      where('status', 'in', ['Pending', 'Scheduled', 'InProgress', 'Inspection'])
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as MaintenanceJob);
  }

  async updateStatus(jobId: string, status: string): Promise<void> {
    const docRef = doc(db, this.collectionPath, jobId);
    await updateDoc(docRef, { status });
  }

  subscribeToJobs(callback: (jobs: MaintenanceJob[]) => void): () => void {
    const jobsCollection = collection(db, this.collectionPath);
    // Give all jobs for the service log
    return onSnapshot(jobsCollection, (snapshot) => {
      const jobs = snapshot.docs.map(doc => doc.data() as MaintenanceJob);
      callback(jobs);
    });
  }
}

