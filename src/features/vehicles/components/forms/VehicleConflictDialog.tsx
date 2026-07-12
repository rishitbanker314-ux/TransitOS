import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface VehicleConflictDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  conflictMessage: string | null;
  onReload: () => void;
  onForceOverwrite?: () => void;
}

export function VehicleConflictDialog({
  isOpen,
  onOpenChange,
  conflictMessage,
  onReload,
  onForceOverwrite
}: VehicleConflictDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-destructive" />
            <DialogTitle>Version Conflict Detected</DialogTitle>
          </div>
          <DialogDescription className="pt-3">
            {conflictMessage || 'This vehicle has been modified by another user since you started editing.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="text-sm text-muted-foreground">
          To ensure data integrity, you cannot save your current changes. Please reload the latest data.
        </div>
        
        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {onForceOverwrite && (
            <Button variant="destructive" onClick={onForceOverwrite}>
              Force Overwrite
            </Button>
          )}
          <Button onClick={onReload}>
            Reload Latest Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
