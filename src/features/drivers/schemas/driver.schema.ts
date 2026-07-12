import { z } from 'zod';

export const driverStatusSchema = z.enum([
  'Available',
  'Assigned',
  'On Leave',
  'Training',
  'Medical Leave',
  'Inactive',
  'Suspended'
]);

export const driverSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  dateOfBirth: z.string().datetime({ message: 'Invalid ISO date string for date of birth' }),
  joinedAt: z.string().datetime({ message: 'Invalid ISO date string for joined date' }),
});

export const updateDriverSchema = driverSchema.partial().extend({
  status: driverStatusSchema.optional()
});

export const licenceSchema = z.object({
  driverId: z.string().min(1),
  licenceNumber: z.string().min(1, 'Licence number is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  issuedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  issuingAuthority: z.string().min(1),
  documentUrl: z.string().url().optional(),
});
