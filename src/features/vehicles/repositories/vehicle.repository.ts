import { db } from '@/lib/firebase/config';
import { collection, doc, getDoc, getDocs, query, where, limit, startAfter, DocumentData } from 'firebase/firestore';
import { Vehicle } from '../types/vehicle.types';

export class VehicleRepository {
  private collectionPath = 'vehicles';
  private regCollectionPath = 'vehicle_registrations';

  async findById(id: string): Promise<Vehicle | null> {
    const docRef = doc(db, this.collectionPath, id);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as Vehicle) : null;
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
    return snap.docs.map(doc => doc.data() as Vehicle);
  }
}
