import { DocumentUploadPayload } from '../../types/document.types';

export class VehicleDocumentValidator {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  public static validateFile(file: File): { isValid: boolean; error?: string } {
    if (!file) {
      return { isValid: false, error: 'No file provided.' };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { isValid: false, error: `File exceeds the maximum limit of 10MB.` };
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { isValid: false, error: 'Invalid file format. Only PDF, JPG, PNG, and WEBP are allowed.' };
    }

    // Additional generic name checks to prevent extreme payloads
    if (file.name.length > 200) {
      return { isValid: false, error: 'File name is too long.' };
    }

    return { isValid: true };
  }

  public static validatePayload(payload: DocumentUploadPayload): { isValid: boolean; error?: string } {
    const fileValidation = this.validateFile(payload.file);
    if (!fileValidation.isValid) return fileValidation;

    if (!payload.entityId) return { isValid: false, error: 'Missing entity reference.' };
    if (!payload.category) return { isValid: false, error: 'Document category is required.' };

    return { isValid: true };
  }
}
