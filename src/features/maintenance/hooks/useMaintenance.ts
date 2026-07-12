import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, onSnapshot, orderBy, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { MaintenanceJob } from '../types/maintenance.types';

export function useMaintenance() {
  const [jobs, setJobs] = useState<MaintenanceJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'maintenance_jobs'),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snap: QuerySnapshot<DocumentData>) => {
      const parsedJobs = snap.docs.map(doc => doc.data() as MaintenanceJob);
      setJobs(parsedJobs);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { jobs, loading };
}
