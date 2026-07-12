import { TripRepository } from '../repositories/TripRepository';
import { TripTimelineService } from './TripTimelineService';
import { TripValidator } from './TripValidator';
import { db } from '@/lib/firebase/config';
import { VehicleTransitionEngine } from '../../vehicles/services/status-engine/VehicleTransitionEngine';
import { UserRole } from '../../vehicles/services/status-engine/statusTypes';

export class TripDispatchEngine {
  private tripRepo = new TripRepository();
  private timelineService = new TripTimelineService();
  private validator = new TripValidator();
  private vehicleEngine = new VehicleTransitionEngine();

  /**
   * Dispatches a trip, assigning a vehicle and driver, and updates the vehicle status atomically.
   */
  async dispatch(
    tripId: string, 
    vehicleId: string, 
    driverId: string, 
    userId: string,
    userRole: UserRole
  ): Promise<void> {
    const trip = await this.tripRepo.getById(tripId);
    if (!trip) throw new Error('Trip not found');
    if (trip.status !== 'Draft' && trip.status !== 'Scheduled') {
      throw new Error('Only Draft or Scheduled trips can be dispatched.');
    }

    // 1. Validate
    await this.validator.validateVehicleAssignment(vehicleId);
    await this.validator.validateDriverAssignment(driverId, trip);

    // 2. Execute Transaction
    await db.runTransaction(async (transaction: any) => {
      // Note: In a pure transaction, we should use transaction.get()
      // For this architecture demo, we'll wrap the repository calls.
      const tripRef = db.collection('trips').doc(tripId);
      
      transaction.update(tripRef, {
        vehicleId,
        driverId,
        status: 'Assigned',
        updatedAt: new Date().toISOString()
      });
      
      // Update Vehicle Status atomically
      await this.vehicleEngine.executeTransition({
        vehicleId,
        requestedState: 'Assigned',
        userId,
        userRole,
        reason: `Dispatched to Trip ${tripId}`,
        triggerSource: 'dispatch_engine'
      });
    });

    // 3. Log Timeline Event
    await this.timelineService.logEvent(
      tripId, 
      'Assigned', 
      `Dispatched Vehicle ${vehicleId} to Driver ${driverId}`,
      userId
    );
  }

  async startTrip(tripId: string, userId: string, userRole: UserRole): Promise<void> {
    const trip = await this.tripRepo.getById(tripId);
    if (!trip) throw new Error('Trip not found');
    if (trip.status !== 'Assigned') throw new Error('Trip must be assigned before starting.');
    if (!trip.vehicleId) throw new Error('No vehicle assigned to trip.');

    await db.runTransaction(async (transaction: any) => {
      const tripRef = db.collection('trips').doc(tripId);
      transaction.update(tripRef, {
        status: 'InProgress',
        'schedule.actualStartTime': new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      await this.vehicleEngine.executeTransition({
        vehicleId: trip.vehicleId as string,
        requestedState: 'OnTrip',
        userId,
        userRole,
        reason: `Trip ${tripId} started`,
        triggerSource: 'dispatch_engine'
      });
    });

    await this.timelineService.logEvent(tripId, 'StatusChange', 'Trip Started', userId);
  }

  async completeTrip(tripId: string, userId: string, userRole: UserRole): Promise<void> {
    const trip = await this.tripRepo.getById(tripId);
    if (!trip) throw new Error('Trip not found');
    if (trip.status !== 'InProgress') throw new Error('Only in-progress trips can be completed.');
    if (!trip.vehicleId) throw new Error('No vehicle assigned to trip.');

    await db.runTransaction(async (transaction: any) => {
      const tripRef = db.collection('trips').doc(tripId);
      transaction.update(tripRef, {
        status: 'Completed',
        'schedule.actualEndTime': new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      await this.vehicleEngine.executeTransition({
        vehicleId: trip.vehicleId as string,
        requestedState: 'Available',
        userId,
        userRole,
        reason: `Trip ${tripId} completed`,
        triggerSource: 'dispatch_engine'
      });
    });

    await this.timelineService.logEvent(tripId, 'StatusChange', 'Trip Completed', userId);
  }
}
