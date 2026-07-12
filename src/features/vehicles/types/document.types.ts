export type DocumentCategory =
  | 'REGISTRATION_CERTIFICATE'
  | 'INSURANCE_POLICY'
  | 'PUC_CERTIFICATE'
  | 'FITNESS_CERTIFICATE'
  | 'ROAD_TAX_RECEIPT'
  | 'PERMIT'
  | 'VEHICLE_IMAGE'
  | 'PURCHASE_INVOICE'
  | 'WARRANTY_DOCUMENT'
  | 'MAINTENANCE_REPORT'
  | 'REPAIR_BILL'
  | 'INSPECTION_REPORT'
  | 'MISC';

export interface DocumentMetadata {
  id: string;                 // UUID
  entityId: string;           // Vehicle ID
  entityType: 'VEHICLE';
  category: DocumentCategory;
  fileName: string;
  storagePath: string;        // Firebase Storage reference
  version: number;
  status: 'ACTIVE' | 'EXPIRED' | 'ARCHIVED';
  uploadedAt: string;         // ISO-8601
  uploadedBy: string;         // User ID
  issueDate?: string;
  expiryDate?: string;
  notes?: string;
  checksum: string;           // SHA-256 (optional implementation)
  metadata: Record<string, any>; // AI extracted metadata (Policy #, etc)
  downloadUrl?: string;       // Populated on client side for viewing
}

export interface DocumentUploadPayload {
  entityId: string;
  category: DocumentCategory;
  file: File;
  issueDate?: string;
  expiryDate?: string;
  notes?: string;
  userId: string;
}
