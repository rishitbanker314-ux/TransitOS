export type MaintenanceType = 'Preventive' | 'Corrective' | 'Predictive' | 'Emergency';
export type MaintenanceStatus = 'Pending' | 'Scheduled' | 'InProgress' | 'Inspection' | 'Completed' | 'Cancelled';
export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface MaintenancePart {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
}

export interface MaintenanceJob {
  id: string;
  title: string;
  description: string;
  vehicleId: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  assignedTechnicianId?: string;
  scheduledDate?: string;
  estimatedDurationHours: number;
  actualDurationHours?: number;
  partsUsed: MaintenancePart[];
  totalCost?: number;
  createdAt: string;
  createdBy: string;
  completedAt?: string;
  completedBy?: string;
  inspectionNotes?: string;
}

export interface PredictiveMaintenanceRecommendation {
  vehicleId: string;
  probabilityOfFailure: number;
  predictedFailureDate: string;
  recommendedAction: string;
  reasoning: string;
  confidenceScore: number;
}
