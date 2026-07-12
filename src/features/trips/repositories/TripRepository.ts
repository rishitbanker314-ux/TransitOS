import { db } from '@/lib/firebase/config';
import { Trip, TripEvent } from '../types/trip.types';

export class TripRepository {
  private collection = db.collection('trips');

  async create(data: Omit<Trip, 'id' | 'createdAt' | 'updatedAt' | 'status'>, userId: string): Promise<Trip> {
    const docRef = this.collection.doc();
    const now = new Date().toISOString();
    const trip: Trip = {
      ...data,
      id: docRef.id,
      status: 'Draft',
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
    };
    await docRef.set(trip);
    return trip;
  }

  async getById(id: string): Promise<Trip | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return doc.data() as Trip;
  }

  async updateStatus(id: string, status: Trip['status']): Promise<void> {
    await this.collection.doc(id).update({ 
      status, 
      updatedAt: new Date().toISOString() 
    });
  }

  async assign(id: string, vehicleId: string, driverId: string): Promise<void> {
    await this.collection.doc(id).update({
      vehicleId,
      driverId,
      status: 'Assigned',
      updatedAt: new Date().toISOString(),
    });
  }

  async getActiveTrips(): Promise<Trip[]> {
    const snapshot = await this.collection
      .where('status', 'in', ['Scheduled', 'Assigned', 'InProgress', 'Paused'])
      .orderBy('schedule.plannedStartTime', 'asc')
      .get();
    
    return snapshot.docs.map((doc: any) => doc.data() as Trip);
  }
}
