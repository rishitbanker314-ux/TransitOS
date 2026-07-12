export type VehicleStatus = 'Available' | 'On Trip' | 'In Shop' | 'Retired';

export interface Vehicle {
  id: string;
  registrationNumber: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  payloadCapacity: number;
  currentOdometer: number;
  status: VehicleStatus;
  insuranceExpiry: string;
  pucExpiry: string;
  isArchived: boolean;
  version: number;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
}

export type CreateVehicleDTO = Omit<Vehicle, 'id' | 'status' | 'isArchived' | 'version' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>;
export type UpdateVehicleDTO = Partial<CreateVehicleDTO>;
