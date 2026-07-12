import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Vehicle } from '../../types/vehicle.types';
import { Checkbox } from '@/components/ui/checkbox';
import { VehicleStatusBadge } from './VehicleStatusBadge';
import { VehicleRowActions } from './VehicleRowActions';

export const vehicleColumns: ColumnDef<Vehicle>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'registrationNumber',
    header: 'Reg No.',
    cell: ({ row }) => <div className="font-medium">{row.getValue('registrationNumber')}</div>,
  },
  {
    accessorKey: 'model',
    header: 'Model',
    cell: ({ row }) => {
      const make = row.original.make;
      const model = row.original.model;
      return <div>{`${make} ${model}`}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <VehicleStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'payloadCapacity',
    header: 'Capacity (kg)',
  },
  {
    accessorKey: 'insuranceExpiry',
    header: 'Insurance Expiry',
    cell: ({ row }) => {
      const dateStr: string = row.getValue('insuranceExpiry');
      const date = new Date(dateStr);
      const isExpired = date < new Date();
      return (
        <div className={isExpired ? "text-destructive font-bold" : ""}>
          {date.toLocaleDateString()}
        </div>
      );
    },
  },
  {
    accessorKey: 'currentOdometer',
    header: 'Odometer',
    cell: ({ row }) => <div>{row.original.currentOdometer.toLocaleString()}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <VehicleRowActions row={row} />,
  },
];
