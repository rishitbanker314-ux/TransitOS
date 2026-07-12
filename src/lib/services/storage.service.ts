import { storage } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { PermissionService } from './permission.service';

export class StorageService {
  constructor(private permissions: PermissionService = new PermissionService()) {}

  async uploadVehicleDocument(vehicleId: string, file: File, docType: string): Promise<string> {
    this.permissions.requireRole(['admin', 'fleet_manager', 'safety_officer']);
    
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('FILE_TOO_LARGE: Document exceeds 5MB limit.');
    }
    
    const filePath = `vehicles/${vehicleId}/documents/${Date.now()}_${docType}_${file.name}`;
    const storageRef = ref(storage, filePath);
    
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }
}
