import React from 'react';
import { DocumentMetadata } from '../../types/document.types';
import { VehicleDocumentCard } from './VehicleDocumentCard';

interface VehicleDocumentListProps {
  documents: DocumentMetadata[];
  onView: (doc: DocumentMetadata) => void;
  onArchive: (id: string) => void;
}

export function VehicleDocumentList({ documents, onView, onArchive }: VehicleDocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="p-8 text-center border rounded-md bg-muted/20">
        <p className="text-muted-foreground text-sm">No active documents found for this vehicle.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {documents.map(doc => (
        <VehicleDocumentCard
          key={doc.id}
          document={doc}
          onView={onView}
          onArchive={onArchive}
        />
      ))}
    </div>
  );
}
