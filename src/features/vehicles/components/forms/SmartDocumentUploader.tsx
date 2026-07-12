'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileCheck, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { processVehicleDocument } from '../../actions/vehicle-ocr.actions';
import { ExtractedVehicleData } from '../../services/ocr.service';

interface Props {
  onExtractionComplete: (data: ExtractedVehicleData) => void;
}

export function SmartDocumentUploader({ onExtractionComplete }: Props) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setSuccess(false);
    setIsScanning(true);

    try {
      // Read file as base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64String = event.target?.result as string;
        // Remove the data:image/jpeg;base64, prefix
        const base64Data = base64String.split(',')[1];
        
        // Call the server action
        const result = await processVehicleDocument(base64Data, file.type);
        
        if (result.success && result.data) {
          setSuccess(true);
          onExtractionComplete(result.data);
        } else {
          setError(result.error || 'Failed to extract data. Please fill manually.');
        }
        setIsScanning(false);
      };
      reader.onerror = () => {
        setError("Failed to read file.");
        setIsScanning(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("An unexpected error occurred.");
      setIsScanning(false);
    }
  };

  return (
    <div className="rounded-lg border-2 border-dashed p-6 text-center hover:bg-muted/50 transition-colors">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, application/pdf"
        className="hidden"
      />
      
      <div className="flex flex-col items-center justify-center gap-4">
        {isScanning ? (
          <>
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Scanning Document...</p>
              <p className="text-xs text-muted-foreground">Extracting registration and insurance details using AI.</p>
            </div>
          </>
        ) : success ? (
          <>
            <div className="rounded-full bg-green-500/10 p-3 text-green-500">
              <FileCheck className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-green-600">Scan Complete</p>
              <p className="text-xs text-muted-foreground">Please review the highlighted fields below.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              Scan Another Document
            </Button>
          </>
        ) : (
          <>
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Smart Assisted Registration</p>
              <p className="text-xs text-muted-foreground">Upload RC or Insurance to auto-fill details.</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
              Choose File
            </Button>
          </>
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive mt-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
