import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DocumentMetadata } from '../../types/document.types';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface VehicleDocumentViewerProps {
  document: DocumentMetadata | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VehicleDocumentViewer({ document, isOpen, onClose }: VehicleDocumentViewerProps) {
  if (!document) return null;

  const isImage = document.fileName.match(/\.(jpg|jpeg|png|webp)$/i);
  // Mock URL for now. In real app, we'd fetch a signed URL or use standard Firebase Storage download URL
  const mockUrl = `https://placehold.co/600x400?text=${encodeURIComponent(document.fileName)}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{document.category.replace(/_/g, ' ')} (v{document.version})</DialogTitle>
          <Button variant="outline" size="sm" onClick={() => window.open(mockUrl, '_blank')}>
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
        </DialogHeader>
        
        <div className="flex-1 w-full bg-muted/10 rounded-md border flex items-center justify-center overflow-hidden">
          {isImage ? (
             <img src={mockUrl} alt={document.fileName} className="max-w-full max-h-full object-contain" />
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">PDF preview simulation.</p>
              <Button variant="secondary" onClick={() => window.open(mockUrl, '_blank')}>Open File External</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
