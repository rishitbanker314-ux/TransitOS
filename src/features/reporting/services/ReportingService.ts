import { MetricAggregation } from '../types/reporting.types';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export class ReportingService {
  /**
   * We read from the pre-aggregated fleet_snapshot to avoid massive
   * COUNT() operations on 100,000+ vehicles.
   */
  async getFleetMetrics(): Promise<MetricAggregation[]> {
    try {
      const snap = await getDoc(doc(db, 'analytics', 'fleet_snapshot'));
      const data = snap.exists() ? snap.data() : null;
      
      // Fallback to mock data for demo purposes if the snapshot doesn't exist
      return [
        { label: 'Total Fleet', value: data?.totalVehicles || 150, trend: 'up', percentageChange: 2.4 },
        { label: 'Active on Trips', value: data?.activeTrips || 42, trend: 'up', percentageChange: 5.1 },
        { label: 'In Maintenance', value: data?.inMaintenance || 12, trend: 'down', percentageChange: -1.2 },
        { label: 'Idle / Available', value: data?.idle || 96, trend: 'neutral', percentageChange: 0 },
      ];
    } catch (e) {
      console.error('Failed to fetch fleet metrics', e);
      return [];
    }
  }

  async getMaintenanceCosts(): Promise<{ month: string; cost: number }[]> {
    // Mocked time-series data for the Recharts implementation
    return [
      { month: 'Jan', cost: 12400 },
      { month: 'Feb', cost: 9800 },
      { month: 'Mar', cost: 15200 },
      { month: 'Apr', cost: 11000 },
      { month: 'May', cost: 13500 },
      { month: 'Jun', cost: 14200 },
    ];
  }
}

export const reportingService = new ReportingService();
