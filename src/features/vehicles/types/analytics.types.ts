export interface FleetSnapshot {
  timestamp: string;
  totalVehicles: number;
  availableVehicles: number;
  assignedVehicles: number;
  onTripVehicles: number;
  underMaintenanceVehicles: number;
  retiredVehicles: number;
  
  utilization: {
    averageFleetUtilization: number; // 0-100
    idlePercentage: number;
    averageTripDurationHours: number;
  };
  
  health: {
    averageScore: number;
    excellentCount: number;
    goodCount: number;
    warningCount: number;
    criticalCount: number;
  };

  compliance: {
    score: number;
    insuranceExpiring30Days: number;
    pucExpiring30Days: number;
    missingDocuments: number;
  };

  maintenance: {
    completionRate: number;
    overdueCount: number;
    averageDowntimeHours: number;
    averageRepairCost: number;
  };

  costs: {
    totalOperatingCost: number;
    averageCostPerKm: number;
  };
}

export type AlertSeverity = 'Critical' | 'Warning' | 'Info';

export interface FleetAlert {
  id: string;
  severity: AlertSeverity;
  message: string;
  actionRequired: string;
  vehicleId?: string;
  timestamp: string;
}

export interface AIInsight {
  id: string;
  category: 'OperationalRisk' | 'MaintenancePriority' | 'ReplacementSuggestion' | 'Optimization';
  title: string;
  description: string;
  recommendedAction: string;
}

export interface AIFleetSummary {
  summary: string;
  insights: AIInsight[];
}
