import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function runSmokeTest() {
  console.log('--- Firebase Smoke Test ---');
  try {
    // 1. Skip Auth as it requires Email/Password enabled in console
    console.log('Skipping Authentication test (requires manual setup)...');

    // 2. Test Firestore Read
    console.log('Testing Firestore Read (vehicles collection)...');
    const q = collection(db, 'vehicles');
    const snap = await getDocs(q);
    console.log(`✅ Read successful. Found ${snap.docs.length} vehicles.`);

    // 3. Test Firestore Write
    console.log('Testing Firestore Write (vehicles collection)...');
    const newDoc = await addDoc(collection(db, 'vehicles'), {
      registrationNumber: `TEST-${Date.now()}`,
      name: 'Smoke Test Vehicle',
      type: 'Van',
      status: 'Available',
      isArchived: false,
      timestamp: new Date()
    });
    console.log(`✅ Write successful. New document ID: ${newDoc.id}`);
    
    console.log('--- All Smoke Tests Passed ---');
    process.exit(0);
  } catch (error) {
    console.error('❌ Smoke Test Failed:', error);
    process.exit(1);
  }
}

runSmokeTest();
