import { db } from '@/lib/firebase/config';
import { collection, doc, getDoc, getDocs, query, where, limit, startAfter, DocumentData } from 'firebase/firestore';
import { Driver } from '../types/driver.types';

export class DriverRepository {
  private collectionPath = 'drivers';
  private contactShadowPath = 'driver_contacts';

  async findById(id: string): Promise<Driver | null> {
    const docRef = doc(db, this.collectionPath, id);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as Driver) : null;
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
      where('isArchived', '==', false),
      limit(maxResults)
    );
    if (cursor) {
      q = query(q, startAfter(cursor));
    }
    
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as Driver);
  }

  async listAvailable(cursor?: DocumentData): Promise<Driver[]> {
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
    return snap.docs.map(doc => doc.data() as Driver);
  }
}
