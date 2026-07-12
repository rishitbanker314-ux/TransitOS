import React from 'react';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Download, Archive, Trash } from 'lucide-react';
import { PermissionService } from '@/lib/services/permission.service';

interface Props<TData> {
  table: Table<TData>;
}

export function VehicleBulkActions<TData>({ table }: Props<TData>) {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const permissionService = new PermissionService();
  const isAdmin = permissionService.requireRole(['admin']); // Stub

  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-sm text-muted-foreground mr-2">
        {selectedCount} selected
      </div>
      <Button variant="secondary" size="sm" className="h-8">
        <Download className="mr-2 h-4 w-4" /> Export
      </Button>
      <Button variant="secondary" size="sm" className="h-8">
        <Archive className="mr-2 h-4 w-4" /> Archive
      </Button>
      {isAdmin && (
        <Button variant="destructive" size="sm" className="h-8">
          <Trash className="mr-2 h-4 w-4" /> Delete
        </Button>
      )}
    </div>
  );
}
