import { db } from '@/lib/firebase/config';
import { MaintenanceJob, MaintenanceStatus } from '../types/maintenance.types';
import { VehicleTransitionEngine } from '../../vehicles/services/status-engine/VehicleTransitionEngine';

export class MaintenanceWorkflowEngine {
  private transitionEngine = new VehicleTransitionEngine();

  async createMaintenanceJob(job: MaintenanceJob, userId: string, userRole: any): Promise<void> {
    const jobRef = db.collection('maintenance_jobs').doc(job.id);
    
    await db.runTransaction(async (transaction: any) => {
      // Create the job
      transaction.set(jobRef, job);

      // Attempt to schedule the vehicle
      await this.transitionEngine.executeTransition({
        vehicleId: job.vehicleId,
        requestedState: 'MaintenanceScheduled',
        userId,
        userRole,
        reason: `Maintenance job created: ${job.title}`,
        triggerSource: 'maintenance_creation'
      });
    });
  }

  async startMaintenance(jobId: string, userId: string, userRole: any): Promise<void> {
    await db.runTransaction(async (transaction: any) => {
      const jobRef = db.collection('maintenance_jobs').doc(jobId);
      const jobSnap = await transaction.get(jobRef);
      if (!jobSnap.exists) throw new Error('Job not found');
      
      const job = jobSnap.data() as MaintenanceJob;
      if (job.status !== 'Scheduled' && job.status !== 'Pending') {
        throw new Error('Can only start Scheduled or Pending jobs.');
      }

      transaction.update(jobRef, { status: 'InProgress' });

      await this.transitionEngine.executeTransition({
        vehicleId: job.vehicleId,
        requestedState: 'UnderMaintenance',
        userId,
        userRole,
        reason: 'Maintenance started',
        triggerSource: 'maintenance_start'
      });
    });
  }

  async completeMaintenance(
    jobId: string, 
    updates: Partial<MaintenanceJob>, 
    userId: string, 
    userRole: any
  ): Promise<void> {
    await db.runTransaction(async (transaction: any) => {
      const jobRef = db.collection('maintenance_jobs').doc(jobId);
      const jobSnap = await transaction.get(jobRef);
      if (!jobSnap.exists) throw new Error('Job not found');
      
      const job = jobSnap.data() as MaintenanceJob;
      if (job.status !== 'InProgress') throw new Error('Can only complete InProgress jobs.');

      transaction.update(jobRef, { 
        ...updates,
        status: 'Inspection',
        completedAt: new Date().toISOString(),
        completedBy: userId
      });

      await this.transitionEngine.executeTransition({
        vehicleId: job.vehicleId,
        requestedState: 'Inspection',
        userId,
        userRole,
        reason: 'Maintenance work complete, pending inspection',
        triggerSource: 'maintenance_complete'
      });
    });
  }

  async approveInspection(jobId: string, userId: string, userRole: any): Promise<void> {
    await db.runTransaction(async (transaction: any) => {
      const jobRef = db.collection('maintenance_jobs').doc(jobId);
      const jobSnap = await transaction.get(jobRef);
      if (!jobSnap.exists) throw new Error('Job not found');
      
      const job = jobSnap.data() as MaintenanceJob;
      
      transaction.update(jobRef, { status: 'Completed' });

      await this.transitionEngine.executeTransition({
        vehicleId: job.vehicleId,
        requestedState: 'Available',
        userId,
        userRole,
        reason: 'Inspection passed, vehicle returned to service',
        triggerSource: 'inspection_approve'
      });
    });
  }
}
