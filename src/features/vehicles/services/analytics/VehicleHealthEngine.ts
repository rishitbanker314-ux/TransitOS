export type HealthStatus = 'Excellent' | 'Good' | 'Warning' | 'Critical';

export interface HealthReport {
  score: number;
  status: HealthStatus;
  deductions: { reason: string; penalty: number }[];
}

export class VehicleHealthEngine {
  /**
   * Computes a health score 0-100 for a vehicle based on its operational parameters.
   * This logic can run client-side for individual vehicles or server-side for fleet aggregates.
   */
  public static calculateScore(data: {
    status: string;
    insuranceDaysRemaining: number;
    pucDaysRemaining: number;
    mileage: number;
    ageYears: number;
    daysSinceLastInspection: number;
    activeBreakdown: boolean;
  }): HealthReport {
    let score = 100;
    const deductions: { reason: string; penalty: number }[] = [];

    const applyDeduction = (reason: string, penalty: number) => {
      score -= penalty;
      deductions.push({ reason, penalty });
    };

    // 1. Critical Operational States
    if (data.activeBreakdown || data.status === 'UnderMaintenance') {
      applyDeduction('Currently out of service', 50);
    }

    // 2. Compliance (30%)
    if (data.insuranceDaysRemaining < 0) {
      applyDeduction('Insurance Expired', 50);
    } else if (data.insuranceDaysRemaining <= 30) {
      applyDeduction('Insurance Expiring Soon', 15);
    }

    if (data.pucDaysRemaining < 0) {
      applyDeduction('PUC Expired', 30);
    } else if (data.pucDaysRemaining <= 15) {
      applyDeduction('PUC Expiring Soon', 10);
    }

    // 3. Utilization / Age (20%)
    if (data.ageYears > 10) applyDeduction('Vehicle age > 10 years', 15);
    else if (data.ageYears > 5) applyDeduction('Vehicle age > 5 years', 5);

    if (data.mileage > 200000) applyDeduction('Extremely high mileage', 20);
    else if (data.mileage > 100000) applyDeduction('High mileage', 10);

    // 4. Maintenance / Inspection (20%)
    if (data.daysSinceLastInspection > 90) applyDeduction('Overdue for quarterly inspection', 15);
    else if (data.daysSinceLastInspection > 30) applyDeduction('Pending monthly inspection', 5);

    // Ensure score doesn't drop below 0
    score = Math.max(0, score);

    // Determine bucket
    let status: HealthStatus = 'Excellent';
    if (score < 50) status = 'Critical';
    else if (score < 70) status = 'Warning';
    else if (score < 85) status = 'Good';

    return { score, status, deductions };
  }
}
