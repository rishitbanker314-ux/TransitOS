import { useState, useEffect } from 'react';
import { DocumentData } from 'firebase/firestore';
import { DriverRepository } from '../repositories/driver.repository';
import { Driver } from '../types/driver.types';

export function useDrivers(maxResults = 50) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [cursor, setCursor] = useState<DocumentData | undefined>();
  const [hasMore, setHasMore] = useState(true);

  const repo = new DriverRepository();

  const fetchDrivers = async (isLoadMore = false) => {
    try {
      setLoading(true);
      const fetchedDrivers = await repo.listDrivers(isLoadMore ? cursor : undefined, maxResults);
      
      if (fetchedDrivers.length < maxResults) {
        setHasMore(false);
      } else {
        // Mocking cursor for now, typically we'd capture the last document snapshot
        setCursor({} as DocumentData);
      }
      
      setDrivers(prev => isLoadMore ? [...prev, ...fetchedDrivers] : fetchedDrivers);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error fetching drivers'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return { drivers, loading, error, hasMore, loadMore: () => fetchDrivers(true) };
}
