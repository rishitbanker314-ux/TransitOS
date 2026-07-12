export type DriverStatus = 
  | 'Available'
  | 'Assigned'
  | 'On Leave'
  | 'Training'
  | 'Medical Leave'
  | 'Inactive'
  | 'Suspended';

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string; // ISO
  joinedAt: string; // ISO
  status: DriverStatus;
  
  // Standard enterprise fields
  isArchived: boolean;
  version: number;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
}

export type CreateDriverDTO = Omit<Driver, 'id' | 'status' | 'isArchived' | 'version' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>;
export type UpdateDriverDTO = Partial<CreateDriverDTO> & { status?: DriverStatus };
