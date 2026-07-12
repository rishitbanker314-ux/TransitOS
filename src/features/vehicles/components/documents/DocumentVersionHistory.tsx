import React from 'react';
import { DocumentMetadata } from '../../types/document.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';

interface DocumentVersionHistoryProps {
  documents: DocumentMetadata[]; // Array of history for a specific category
}

export function DocumentVersionHistory({ documents }: DocumentVersionHistoryProps) {
  // Sort by version descending
  const sorted = [...documents].sort((a, b) => b.version - a.version);

  if (sorted.length === 0) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-md">Version History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sorted.map(doc => (
            <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/10">
              <div>
                <p className="text-sm font-medium">Version {doc.version}</p>
                <p className="text-xs text-muted-foreground">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
