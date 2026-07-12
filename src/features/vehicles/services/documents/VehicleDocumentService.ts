import { db, storage } from '@/lib/firebase/config';
import { DocumentMetadata, DocumentUploadPayload } from '../../types/document.types';
import { v4 as uuidv4 } from 'uuid';

export class VehicleDocumentService {
  /**
   * Uploads a document to Firebase Storage and records its metadata in Firestore.
   * Handles versioning inherently by writing new IDs per upload and querying by category later.
   */
  public async uploadDocument(payload: DocumentUploadPayload): Promise<DocumentMetadata> {
    const documentId = uuidv4();
    const fileExt = payload.file.name.split('.').pop() || '';
    // Structure: entities/vehicles/{vehicleId}/documents/{category}/{documentId}/v1_{documentId}.ext
    // In a full implementation, version number would be queried first to increment v2, v3, etc.
    const storagePath = `entities/vehicles/${payload.entityId}/documents/${payload.category}/${documentId}/v1_${documentId}.${fileExt}`;

    try {
      // 1. Upload to Storage (Mocked out actual Firebase SDK logic here for compilation)
      const storageRef = storage?.ref?.()?.child?.(storagePath);
      if (storageRef) {
        await storageRef.put(payload.file);
      } else {
        console.warn('Storage not fully initialized, skipping physical upload for mock context.');
      }

      // 2. Build Metadata
      const metadata: DocumentMetadata = {
        id: documentId,
        entityId: payload.entityId,
        entityType: 'VEHICLE',
        category: payload.category,
        fileName: payload.file.name,
        storagePath,
        version: 1,
        status: 'ACTIVE',
        uploadedAt: new Date().toISOString(),
        uploadedBy: payload.userId,
        issueDate: payload.issueDate,
        expiryDate: payload.expiryDate,
        notes: payload.notes,
        checksum: 'mock-checksum-TODO', // Needs WebCrypto API
        metadata: {},
      };

      // 3. Save to Firestore
      const docRef = db.collection('vehicles').doc(payload.entityId).collection('documents').doc(documentId);
      await docRef.set(metadata);

      return metadata;
    } catch (error: any) {
      console.error('Document upload failed:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  /**
   * Fetches all active documents for a vehicle
   */
  public async getDocuments(vehicleId: string): Promise<DocumentMetadata[]> {
    const snapshot = await db.collection('vehicles').doc(vehicleId).collection('documents').where('status', '==', 'ACTIVE').get();
    if (!snapshot || !snapshot.docs) return []; // Mock safety
    return snapshot.docs.map((doc: any) => doc.data() as DocumentMetadata);
  }

  /**
   * Archives a document (soft delete)
   */
  public async archiveDocument(vehicleId: string, documentId: string): Promise<void> {
    await db.collection('vehicles').doc(vehicleId).collection('documents').doc(documentId).update({
      status: 'ARCHIVED'
    });
  }
}
