import { useState, useEffect } from 'react';
import { Trip } from '../types/trip.types';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // We strictly use onSnapshot ONLY for active trips to prevent memory leaks and quota exhaustion.
    // Historical trips should use a standard .get() query.
    const tripsRef = collection(db, 'trips');
    const q = query(
      tripsRef, 
      where('status', 'in', ['Draft', 'Scheduled', 'Assigned', 'InProgress', 'Paused']),
      orderBy('schedule.plannedStartTime', 'asc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => doc.data() as Trip);
        setTrips(data);
        setLoading(false);
      },
      (err) => {
        console.error("Trips real-time listener failed:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { trips, loading, error };
}
