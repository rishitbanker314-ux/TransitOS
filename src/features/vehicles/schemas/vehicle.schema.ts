import { z } from 'zod';

export const vehicleSchema = z.object({
  registrationNumber: z.string().min(3).max(15).toUpperCase(),
  vin: z.string().length(17).toUpperCase(),
  make: z.string().min(2),
  model: z.string().min(2),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  payloadCapacity: z.number().positive('Capacity must be positive'),
  currentOdometer: z.number().nonnegative(),
  insuranceExpiry: z.string().datetime(),
  pucExpiry: z.string().datetime(),
});

export type VehicleSchemaType = z.infer<typeof vehicleSchema>;
