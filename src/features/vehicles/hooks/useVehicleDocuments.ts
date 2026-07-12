import { useState, useEffect } from 'react';
import { VehicleDocumentService } from '../services/documents/VehicleDocumentService';
import { DocumentMetadata, DocumentUploadPayload } from '../types/document.types';

export function useVehicleDocuments(vehicleId: string) {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const service = new VehicleDocumentService();

  const fetchDocuments = async () => {
    if (!vehicleId) return;
    setIsLoading(true);
    try {
      const data = await service.getDocuments(vehicleId);
      setDocuments(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch documents.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [vehicleId]);

  const uploadDocument = async (payload: DocumentUploadPayload) => {
    try {
      const newDoc = await service.uploadDocument(payload);
      setDocuments(prev => [...prev, newDoc]);
      return newDoc;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to upload document.');
    }
  };

  const archiveDocument = async (documentId: string) => {
    try {
      await service.archiveDocument(vehicleId, documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (err: any) {
      throw new Error(err.message || 'Failed to archive document.');
    }
  };

  return {
    documents,
    isLoading,
    error,
    uploadDocument,
    archiveDocument,
    refresh: fetchDocuments
  };
}
