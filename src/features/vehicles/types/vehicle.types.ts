export type VehicleStatus = 'Available' | 'On Trip' | 'In Shop' | 'Retired';

export interface Vehicle {
  id: string;
  registrationNumber: string;
  name?: string;
  type?: 'Truck' | 'Van' | 'Mini' | string;
  capacity?: number;
  odometerReading?: number;
  acquisitionCost?: number;
  
  // Legacy fields
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
  payloadCapacity?: number;
  currentOdometer: number;
  insuranceExpiry?: string;
  pucExpiry?: string;
  
  status: VehicleStatus;
  isArchived: boolean;
  version: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  
  specifications?: {
    fuelType?: string;
    transmission?: string;
    year?: number;
  };
}

export type CreateVehicleDTO = Omit<Vehicle, 'id' | 'status' | 'isArchived' | 'version' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>;
export type UpdateVehicleDTO = Partial<CreateVehicleDTO>;

