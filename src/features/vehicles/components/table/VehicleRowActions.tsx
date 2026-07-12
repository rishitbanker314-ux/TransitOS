import React from 'react';
import { Row } from '@tanstack/react-table';
import { Vehicle } from '../../types/vehicle.types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash, FileText, UserPlus, Eye } from 'lucide-react';
import { PermissionService } from '@/lib/services/permission.service';

interface Props {
  row: Row<Vehicle>;
}

export function VehicleRowActions({ row }: Props) {
  const vehicle = row.original;
  const permissionService = new PermissionService();
  const canEdit = permissionService.requireRole(['admin', 'fleet_manager']); // Stubbed return

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => console.log('View details', vehicle.id)}>
          <Eye className="mr-2 h-4 w-4" /> View Details
        </DropdownMenuItem>
        
        {canEdit && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log('Edit', vehicle.id)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Assign Driver', vehicle.id)}>
              <UserPlus className="mr-2 h-4 w-4" /> Assign Driver
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Upload Docs', vehicle.id)}>
              <FileText className="mr-2 h-4 w-4" /> Documents
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => console.log('Retire', vehicle.id)}
              className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
            >
              <Trash className="mr-2 h-4 w-4" /> Retire
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
