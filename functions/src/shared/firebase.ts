import * as admin from 'firebase-admin';

// Initialize the Firebase Admin SDK centrally
admin.initializeApp();

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
