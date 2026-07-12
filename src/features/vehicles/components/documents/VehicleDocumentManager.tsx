import React, { useState } from 'react';
import { useVehicleDocuments } from '../../hooks/useVehicleDocuments';
import { VehicleDocumentList } from './VehicleDocumentList';
import { VehicleDocumentUploader } from './VehicleDocumentUploader';
import { VehicleDocumentViewer } from './VehicleDocumentViewer';
import { DocumentMetadata } from '../../types/document.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

interface VehicleDocumentManagerProps {
  vehicleId: string;
}

export function VehicleDocumentManager({ vehicleId }: VehicleDocumentManagerProps) {
  const { documents, isLoading, error, uploadDocument, archiveDocument } = useVehicleDocuments(vehicleId);
  const [selectedDoc, setSelectedDoc] = useState<DocumentMetadata | null>(null);

  const handleView = (doc: DocumentMetadata) => {
    setSelectedDoc(doc);
  };

  const handleCloseViewer = () => {
    setSelectedDoc(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Document</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleDocumentUploader entityId={vehicleId} onUploadComplete={uploadDocument} />
        </CardContent>
      </Card>

      {/* Active Documents Section */}
      <Card>
        <CardHeader>
          <CardTitle>Active Documents</CardTitle>
        </CardHeader>
        <Separator className="mb-4" />
        <CardContent>
          {error && <p className="text-destructive mb-4">{error}</p>}
          
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <VehicleDocumentList 
              documents={documents} 
              onView={handleView}
              onArchive={archiveDocument} 
            />
          )}
        </CardContent>
      </Card>

      {/* Fullscreen Viewer Modal */}
      <VehicleDocumentViewer 
        document={selectedDoc} 
        isOpen={!!selectedDoc} 
        onClose={handleCloseViewer} 
      />
    </div>
  );
}
