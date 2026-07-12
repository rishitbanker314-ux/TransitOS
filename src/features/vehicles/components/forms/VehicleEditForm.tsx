'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleSchema, VehicleSchemaType } from '../../schemas/vehicle.schema';
import { Vehicle } from '../../types/vehicle.types';
import { useEditVehicle } from '../../hooks/useEditVehicle';
import { VehicleChangeSummary } from './VehicleChangeSummary';
import { VehicleConflictDialog } from './VehicleConflictDialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface VehicleEditFormProps {
  initialVehicle: Vehicle;
  currentUserId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  onReloadRequested?: () => void;
}

export function VehicleEditForm({ 
  initialVehicle, 
  currentUserId,
  onSuccess,
  onCancel,
  onReloadRequested
}: VehicleEditFormProps) {
  
  const { 
    vehicle, 
    changes, 
    isDirty, 
    isSaving, 
    error, 
    conflictError, 
    updateField, 
    saveChanges 
  } = useEditVehicle(initialVehicle);

  const [showConflictDialog, setShowConflictDialog] = useState(false);

  const form = useForm<VehicleSchemaType>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      registrationNumber: vehicle.registrationNumber,
      vin: vehicle.vin,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      payloadCapacity: vehicle.payloadCapacity,
      currentOdometer: vehicle.currentOdometer,
      insuranceExpiry: vehicle.insuranceExpiry,
      pucExpiry: vehicle.pucExpiry,
    }
  });

  // Watch for changes in the form and update the draft in useEditVehicle
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && value[name] !== undefined) {
        updateField(name as keyof Vehicle, value[name]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, updateField]);

  useEffect(() => {
    if (conflictError) {
      setShowConflictDialog(true);
    }
  }, [conflictError]);

  const onSubmit = async (data: VehicleSchemaType) => {
    try {
      await saveChanges(currentUserId);
      if (onSuccess) onSuccess();
    } catch (err) {
      // Error handled by hook, conflict dialog might pop up
      console.error("Save failed", err);
    }
  };

  const hasFieldChanged = (fieldName: string) => {
    return changes.some(c => c.field === fieldName);
  };

  const getFieldClass = (fieldName: string) => {
    return hasFieldChanged(fieldName)
      ? "ring-1 ring-amber-500 bg-amber-50 dark:bg-amber-900/10 transition-colors"
      : "transition-colors";
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto p-6 bg-card rounded-xl border shadow-sm">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold">Edit Vehicle</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Modifying {vehicle.registrationNumber} (Version {vehicle.version})
            </p>
          </div>
          {isDirty && <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full animate-pulse">Unsaved Changes</span>}
        </div>

        {error && !conflictError && (
          <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Registration Number</label>
            <Input 
              {...form.register('registrationNumber')} 
              className={getFieldClass('registrationNumber')} 
            />
            {form.formState.errors.registrationNumber && <p className="text-xs text-destructive">{form.formState.errors.registrationNumber.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">VIN / Chassis Number</label>
            <Input 
              {...form.register('vin')} 
              className={getFieldClass('vin')} 
            />
            {form.formState.errors.vin && <p className="text-xs text-destructive">{form.formState.errors.vin.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Make</label>
            <Input 
              {...form.register('make')} 
              className={getFieldClass('make')} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Model</label>
            <Input 
              {...form.register('model')} 
              className={getFieldClass('model')} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Year of Manufacture</label>
            <Input 
              type="number"
              {...form.register('year', { valueAsNumber: true })} 
              className={getFieldClass('year')} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Current Odometer</label>
            <Input 
              type="number"
              {...form.register('currentOdometer', { valueAsNumber: true })} 
              className={getFieldClass('currentOdometer')} 
            />
            {form.formState.errors.currentOdometer && <p className="text-xs text-destructive">{form.formState.errors.currentOdometer.message}</p>}
          </div>
        </div>

        {/* Change Summary rendered inline before submit */}
        {isDirty && (
          <div className="mt-8 pt-6 border-t border-dashed">
            <VehicleChangeSummary changes={changes} />
          </div>
        )}

        <div className="pt-6 flex justify-end gap-4 border-t">
          <Button variant="outline" type="button" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isDirty || isSaving || !form.formState.isValid}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>

      <VehicleConflictDialog 
        isOpen={showConflictDialog} 
        onOpenChange={setShowConflictDialog}
        conflictMessage={conflictError}
        onReload={() => {
          setShowConflictDialog(false);
          if (onReloadRequested) onReloadRequested();
        }}
      />
    </>
  );
}
