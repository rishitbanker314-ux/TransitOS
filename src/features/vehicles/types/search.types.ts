export interface VehicleFilterOptions {
  searchTerm?: string;
  status?: string[];
  manufacturer?: string[];
  fuelType?: string[];
  vehicleType?: string[];
  transmission?: string[];
  purchaseYearMin?: number;
  purchaseYearMax?: number;
  capacityMin?: number;
  capacityMax?: number;
  insuranceExpiryMax?: string; // ISO date string
  pucExpiryMax?: string;
  assignedDriverId?: string;
  hasActiveTrip?: boolean;
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: VehicleFilterOptions;
  createdAt: string;
  isPinned?: boolean;
}

export type SortDirection = 'asc' | 'desc';

export interface VehicleSortOptions {
  field: 'registrationNumber' | 'name' | 'make' | 'purchaseDate' | 'mileage' | 'status' | 'createdAt';
  direction: SortDirection;
}

export interface SearchPaginationState {
  pageSize: number;
  lastVisibleDocId?: string | null;
}
