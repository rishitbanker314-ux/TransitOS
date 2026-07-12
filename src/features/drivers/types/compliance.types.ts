export interface Licence {
  id: string;
  driverId: string;
  licenceNumber: string;
  categories: string[];
  issuedAt: string; // ISO
  expiresAt: string; // ISO
  issuingAuthority: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired' | 'Suspended';
  documentUrl?: string;
  
  isArchived: boolean;
  version: number;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
}

export interface Certification {
  id: string;
  driverId: string;
  type: 'Medical' | 'Training' | 'Background Check';
  title: string;
  issuedAt: string; // ISO
  expiresAt?: string; // ISO
  status: 'Valid' | 'Expired' | 'Pending Review';
  documentUrl?: string;
  metadata?: Record<string, any>;
  
  isArchived: boolean;
  version: number;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
}

export interface Incident {
  id: string;
  driverId: string;
  tripId?: string;
  date: string; // ISO
  type: 'Accident' | 'Traffic Violation' | 'Customer Complaint' | 'Other';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  status: 'Open' | 'Under Investigation' | 'Resolved';
  resolution?: string;
  
  isArchived: boolean;
  version: number;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
}
