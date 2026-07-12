import { db } from '../../../lib/firebase/config';
import { collection, doc, getDoc, getDocs, query, where, orderBy, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Trip, TripEvent } from '../types/trip.types';

export class TripRepository {
  private collectionName = 'trips';

  async create(data: Omit<Trip, 'id' | 'createdAt' | 'updatedAt' | 'status'>, userId: string): Promise<Trip> {
    const tripCollection = collection(db, this.collectionName);
    const docRef = doc(tripCollection);
    const now = new Date().toISOString();
    const trip: Trip = {
      ...data,
      id: docRef.id,
      status: 'Draft',
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
    };
    await setDoc(docRef, trip);
    return trip;
  }

  async getById(id: string): Promise<Trip | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return docSnap.data() as Trip;
  }

  async updateStatus(id: string, status: Trip['status']): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, { 
      status, 
      updatedAt: new Date().toISOString() 
    });
  }

  async assign(id: string, vehicleId: string, driverId: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, {
      vehicleId,
      driverId,
      status: 'Assigned',
      updatedAt: new Date().toISOString(),
    });
  }

  async getActiveTrips(): Promise<Trip[]> {
    const tripCollection = collection(db, this.collectionName);
    const q = query(
      tripCollection,
      where('status', 'in', ['Draft', 'Scheduled', 'Assigned', 'InProgress', 'Paused']),
      orderBy('schedule.plannedStartTime', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Trip);
  }

  subscribeToActiveTrips(callback: (trips: Trip[]) => void): () => void {
    const tripCollection = collection(db, this.collectionName);
    const q = query(
      tripCollection,
      where('status', 'in', ['Draft', 'Scheduled', 'Assigned', 'InProgress', 'Paused', 'Completed', 'Cancelled'])
    );
    return onSnapshot(q, (snapshot) => {
      const trips = snapshot.docs.map(doc => doc.data() as Trip);
      callback(trips);
    });
  }
}
