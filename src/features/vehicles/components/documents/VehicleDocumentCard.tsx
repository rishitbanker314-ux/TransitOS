import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DocumentExpiryBadge } from './DocumentExpiryBadge';
import { DocumentMetadata } from '../../types/document.types';
import { FileText, Download, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VehicleDocumentCardProps {
  document: DocumentMetadata;
  onView: (doc: DocumentMetadata) => void;
  onArchive: (id: string) => void;
}

export function VehicleDocumentCard({ document, onView, onArchive }: VehicleDocumentCardProps) {
  const isImage = document.fileName.match(/\.(jpg|jpeg|png|webp)$/i);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-sm font-medium truncate max-w-[150px]">
            {document.category.replace(/_/g, ' ')}
          </CardTitle>
        </div>
        <Badge variant="outline">v{document.version}</Badge>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground mb-4 truncate" title={document.fileName}>
          {document.fileName}
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-semibold">Status</span>
          <DocumentExpiryBadge expiryDate={document.expiryDate} />
        </div>

        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" className="flex-1" onClick={() => onView(document)}>
            <Eye className="h-4 w-4 mr-1" /> View
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
              if (window.confirm('Are you sure you want to archive this document?')) {
                  onArchive(document.id);
              }
          }}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
