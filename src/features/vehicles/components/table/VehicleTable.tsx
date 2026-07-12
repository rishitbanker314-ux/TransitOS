'use client';

import React from 'react';
import { flexRender } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Vehicle } from '../../types/vehicle.types';
import { vehicleColumns } from './VehicleColumns';
import { useVehicleTable } from '../../hooks/useVehicleTable';
import { VehicleToolbar } from './VehicleToolbar';
import { VehiclePagination } from './VehiclePagination';
import { VehicleStatusBadge } from './VehicleStatusBadge';
import { VehicleRowActions } from './VehicleRowActions';

interface Props {
  data: Vehicle[];
}

export function VehicleTable({ data }: Props) {
  const { table, globalFilter, setGlobalFilter } = useVehicleTable(data);

  return (
    <div className="w-full space-y-4">
      <VehicleToolbar table={table} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={vehicleColumns.length} className="h-24 text-center">
                  No vehicles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <div key={row.id} className="rounded-lg border bg-card p-4 shadow-sm flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{row.original.registrationNumber}</h3>
                  <p className="text-sm text-muted-foreground">{row.original.make} {row.original.model}</p>
                </div>
                <VehicleRowActions row={row} />
              </div>
              <div className="flex justify-between items-center mt-2">
                <VehicleStatusBadge status={row.original.status} />
                <span className="text-sm font-medium">{row.original.currentOdometer.toLocaleString()} km</span>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border p-8 text-center text-muted-foreground">
            No vehicles found.
          </div>
        )}
      </div>

      <VehiclePagination table={table} />
    </div>
  );
}
