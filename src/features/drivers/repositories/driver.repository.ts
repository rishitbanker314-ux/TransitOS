import { db } from '../../../lib/firebase/config';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, limit, startAfter, onSnapshot, DocumentData } from 'firebase/firestore';
import { Driver } from '../types/driver.types';

export class DriverRepository {
  private collectionPath = 'drivers';
  private contactShadowPath = 'driver_contacts';

  async findById(id: string): Promise<Driver | null> {
    const docRef = doc(db, this.collectionPath, id);
    const snap = await getDoc(docRef);
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Driver) : null;
  }

  async checkContactExists(email: string, phone: string): Promise<{ emailExists: boolean; phoneExists: boolean }> {
    const emailRef = doc(db, this.contactShadowPath, `email_${email}`);
    const phoneRef = doc(db, this.contactShadowPath, `phone_${phone}`);
    
    const [emailSnap, phoneSnap] = await Promise.all([
      getDoc(emailRef),
      getDoc(phoneRef)
    ]);
    
    return {
      emailExists: emailSnap.exists(),
      phoneExists: phoneSnap.exists()
    };
  }

  async listDrivers(cursor?: DocumentData, maxResults = 50): Promise<Driver[]> {
    let q = query(
      collection(db, this.collectionPath),
      limit(maxResults)
    );
    if (cursor) {
      q = query(q, startAfter(cursor));
    }
    
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Driver));
  }

  async listAvailable(cursor?: DocumentData): Promise<Driver[]> {
    let q = query(
      collection(db, this.collectionPath),
      where('status', '==', 'Available'),
      limit(50)
    );
    if (cursor) {
      q = query(q, startAfter(cursor));
    }
    
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Driver));
  }

  async add(driverData: Omit<Driver, 'id'>): Promise<string> {
    const id = crypto.randomUUID();
    const docRef = doc(db, this.collectionPath, id);
    await setDoc(docRef, { ...driverData, id });
    return id;
  }

  async updateStatus(id: string, status: string): Promise<void> {
    const docRef = doc(db, this.collectionPath, id);
    await updateDoc(docRef, { status, updatedAt: new Date().toISOString() });
  }

  subscribeToAll(callback: (drivers: Driver[]) => void): () => void {
    const q = query(collection(db, this.collectionPath));
    return onSnapshot(q, (snapshot) => {
      const drivers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Driver));
      callback(drivers);
    });
  }
}

