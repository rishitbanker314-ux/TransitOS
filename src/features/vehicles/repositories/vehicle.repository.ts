import { db } from '../../../lib/firebase/config';
import { collection, doc, getDoc, getDocs, query, where, limit, startAfter, DocumentData, addDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { Vehicle } from '../types/vehicle.types';

export class VehicleRepository {
  private collectionPath = 'vehicles';
  private regCollectionPath = 'vehicle_registrations';

  async findById(id: string): Promise<Vehicle | null> {
    const docRef = doc(db, this.collectionPath, id);
    const snap = await getDoc(docRef);
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Vehicle) : null;
  }

  async findByRegistration(registrationNumber: string): Promise<boolean> {
    const docRef = doc(db, this.regCollectionPath, registrationNumber);
    const snap = await getDoc(docRef);
    return snap.exists();
  }

  async listAvailable(cursor?: DocumentData): Promise<Vehicle[]> {
    let q = query(
      collection(db, this.collectionPath),
      where('status', '==', 'Available'),
      where('isArchived', '==', false),
      limit(50)
    );
    if (cursor) {
      q = query(q, startAfter(cursor));
    }
    
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
  }

  async getAll(): Promise<Vehicle[]> {
    const q = query(collection(db, this.collectionPath));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
  }

  subscribeToAll(callback: (vehicles: Vehicle[]) => void) {
    const q = query(collection(db, this.collectionPath));
    return onSnapshot(q, (snapshot) => {
      const vehicles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
      callback(vehicles);
    });
  }

  async add(vehicleData: Omit<Vehicle, 'id'>): Promise<string> {
    // Basic unique registration check structure
    const exists = await this.findByRegistration(vehicleData.registrationNumber);
    if (exists) {
      throw new Error('Registration number must be unique.');
    }
    
    const vehiclesColl = collection(db, this.collectionPath);
    const newDoc = await addDoc(vehiclesColl, vehicleData);
    
    // Reserve the registration number
    await setDoc(doc(db, this.regCollectionPath, vehicleData.registrationNumber), { vehicleId: newDoc.id });
    
    return newDoc.id;
  }

  async updateStatus(id: string, status: string): Promise<void> {
    const docRef = doc(db, this.collectionPath, id);
    await updateDoc(docRef, { status, updatedAt: new Date().toISOString() });
  }
}
