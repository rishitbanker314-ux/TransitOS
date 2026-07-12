import { db } from '@/lib/firebase/config';
import { FleetSnapshot, FleetAlert } from '../../types/analytics.types';

/**
 * Service to fetch pre-computed analytics snapshots.
 * In production, Cloud Functions periodically aggregate data into 'analytics/fleet_snapshot'.
 */
export class FleetAnalyticsService {
  private docPath = 'analytics/fleet_snapshot';

  public async getLatestSnapshot(): Promise<FleetSnapshot> {
    const doc = await db.doc(this.docPath).get();
    
    if (!doc.exists) {
      // Return a robust mock snapshot for architectural demonstration if not found
      return this.generateMockSnapshot();
    }

    return doc.data() as FleetSnapshot;
  }

  public async getAlerts(): Promise<FleetAlert[]> {
    // In production, this would query a dedicated alerts collection or subcollection
    return [
      {
        id: '1',
        severity: 'Critical',
        message: '3 vehicles have insurance expiring in less than 48 hours.',
        actionRequired: 'Renew Insurance',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        severity: 'Warning',
        message: 'Fleet average idle time has increased by 15% this week.',
        actionRequired: 'Review Dispatch Routes',
        timestamp: new Date().toISOString()
      },
      {
        id: '3',
        severity: 'Info',
        message: 'Maintenance completion rate is at an all-time high (94%).',
        actionRequired: 'Acknowledge',
        timestamp: new Date().toISOString()
      }
    ];
  }

  private generateMockSnapshot(): FleetSnapshot {
    return {
      timestamp: new Date().toISOString(),
      totalVehicles: 1250,
      availableVehicles: 150,
      assignedVehicles: 900,
      onTripVehicles: 850,
      underMaintenanceVehicles: 100,
      retiredVehicles: 100,
      
      utilization: {
        averageFleetUtilization: 82,
        idlePercentage: 18,
        averageTripDurationHours: 4.5,
      },
      
      health: {
        averageScore: 78,
        excellentCount: 400,
        goodCount: 600,
        warningCount: 200,
        criticalCount: 50,
      },
    
      compliance: {
        score: 91,
        insuranceExpiring30Days: 45,
        pucExpiring30Days: 120,
        missingDocuments: 12,
      },
    
      maintenance: {
        completionRate: 88,
        overdueCount: 35,
        averageDowntimeHours: 14,
        averageRepairCost: 450.50,
      },
    
      costs: {
        totalOperatingCost: 1250000,
        averageCostPerKm: 1.25,
      }
    };
  }
}
