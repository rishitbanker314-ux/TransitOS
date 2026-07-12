import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentCategory, DocumentUploadPayload } from '../../types/document.types';
import { VehicleDocumentValidator } from '../../services/documents/VehicleDocumentValidator';
import { UploadCloud, Sparkles } from 'lucide-react';

interface VehicleDocumentUploaderProps {
  entityId: string;
  onUploadComplete: (payload: DocumentUploadPayload) => Promise<any>;
}

export function VehicleDocumentUploader({ entityId, onUploadComplete }: VehicleDocumentUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<DocumentCategory | ''>('');
  const [expiryDate, setExpiryDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const validation = VehicleDocumentValidator.validateFile(selected);
      if (!validation.isValid) {
        setError(validation.error || 'Invalid file');
        setFile(null);
      } else {
        setError(null);
        setFile(selected);
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !category) {
      setError('Please select a file and category.');
      return;
    }

    const payload: DocumentUploadPayload = {
      entityId,
      category: category as DocumentCategory,
      file,
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined,
      userId: 'current-user-id', // Mocked user ID
    };

    const validation = VehicleDocumentValidator.validatePayload(payload);
    if (!validation.isValid) {
      setError(validation.error || 'Validation failed');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      await onUploadComplete(payload);
      // Reset form on success
      setFile(null);
      setCategory('');
      setExpiryDate('');
    } catch (err: any) {
      setError(err.message || 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-muted rounded-lg p-6 bg-muted/5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Zone */}
        <div className="flex flex-col items-center justify-center space-y-4 py-8 border rounded-md bg-background">
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">Drag & drop or click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 10MB</p>
          </div>
          <Input type="file" onChange={handleFileChange} className="max-w-xs cursor-pointer" accept=".pdf,.jpg,.jpeg,.png,.webp" />
          {file && <p className="text-sm text-green-600 font-medium">Selected: {file.name}</p>}
        </div>

        {/* Metadata Form */}
        <div className="space-y-4">
          <div>
            <Label>Document Category *</Label>
            <Select value={category} onValueChange={(val: string) => setCategory(val as DocumentCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REGISTRATION_CERTIFICATE">Registration (RC)</SelectItem>
                <SelectItem value="INSURANCE_POLICY">Insurance</SelectItem>
                <SelectItem value="PUC_CERTIFICATE">PUC (Pollution)</SelectItem>
                <SelectItem value="FITNESS_CERTIFICATE">Fitness Certificate</SelectItem>
                <SelectItem value="VEHICLE_IMAGE">Vehicle Image</SelectItem>
                <SelectItem value="MISC">Miscellaneous</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Expiry Date</Label>
            <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
          </div>

          {error && <p className="text-sm text-destructive font-medium">{error}</p>}

          <div className="flex space-x-2 pt-2">
            <Button onClick={handleUpload} disabled={isUploading || !file || !category} className="flex-1">
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </Button>
            <Button variant="secondary" title="AI Assist (Extract Details)">
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
