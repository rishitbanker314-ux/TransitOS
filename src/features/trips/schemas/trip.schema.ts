import { z } from 'zod';

const tripLocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  address: z.string().min(5),
});

const tripStopSchema = z.object({
  id: z.string(),
  location: tripLocationSchema,
  plannedArrivalTime: z.string().datetime(),
  actualArrivalTime: z.string().datetime().optional(),
  status: z.enum(['Pending', 'Reached', 'Skipped']),
});

const tripRouteSchema = z.object({
  origin: tripLocationSchema,
  destination: tripLocationSchema,
  stops: z.array(tripStopSchema).default([]),
  estimatedDistanceKm: z.number().min(0.1),
  actualDistanceKm: z.number().min(0).optional(),
});

const tripScheduleSchema = z.object({
  plannedStartTime: z.string().datetime(),
  plannedEndTime: z.string().datetime(),
  actualStartTime: z.string().datetime().optional(),
  actualEndTime: z.string().datetime().optional(),
});

export const createTripSchema = z.object({
  title: z.string().min(3).max(100),
  route: tripRouteSchema,
  schedule: tripScheduleSchema,
});

export const assignTripSchema = z.object({
  vehicleId: z.string(),
  driverId: z.string(),
});

export const tripEventSchema = z.object({
  type: z.enum(['Created', 'StatusChange', 'Assigned', 'Delay', 'Emergency', 'Note']),
  message: z.string().min(1),
  metadata: z.record(z.string(), z.any()).optional(),
});
