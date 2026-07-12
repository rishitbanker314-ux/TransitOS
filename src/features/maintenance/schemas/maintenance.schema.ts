import { z } from 'zod';

export const maintenancePartSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  quantity: z.number().min(1),
  unitCost: z.number().min(0),
});

export const createMaintenanceJobSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  vehicleId: z.string(),
  type: z.enum(['Preventive', 'Corrective', 'Predictive', 'Emergency']),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  assignedTechnicianId: z.string().optional(),
  scheduledDate: z.string().datetime().optional(),
  estimatedDurationHours: z.number().min(0.5),
});

export const completeMaintenanceJobSchema = z.object({
  actualDurationHours: z.number().min(0.1),
  partsUsed: z.array(maintenancePartSchema).default([]),
  totalCost: z.number().min(0),
  inspectionNotes: z.string().optional(),
});
