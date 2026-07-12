import { PerformanceRepository } from '../repositories/performance.repository';
import { DriverRepository } from '../repositories/driver.repository';
import { Incident } from '../types/compliance.types';

export interface DriverMetrics {
  totalIncidents: number;
  criticalIncidents: number;
  safetyScore: number; // 0-100
}

export class PerformanceService {
  constructor(
    private performanceRepo: PerformanceRepository = new PerformanceRepository(),
    private driverRepo: DriverRepository = new DriverRepository()
  ) {}

  async calculateDriverMetrics(driverId: string): Promise<DriverMetrics> {
    const incidents = await this.performanceRepo.getIncidentsByDriver(driverId);
    
    let criticalIncidents = 0;
    let penaltyPoints = 0;
    
    for (const incident of incidents) {
      if (incident.severity === 'Critical') {
        criticalIncidents++;
        penaltyPoints += 25;
      } else if (incident.severity === 'High') {
        penaltyPoints += 15;
      } else if (incident.severity === 'Medium') {
        penaltyPoints += 5;
      } else {
        penaltyPoints += 1;
      }
    }
    
    // Simple safety score calculation (starts at 100)
    let safetyScore = 100 - penaltyPoints;
    if (safetyScore < 0) safetyScore = 0;
    
    return {
      totalIncidents: incidents.length,
      criticalIncidents,
      safetyScore
    };
  }
}
