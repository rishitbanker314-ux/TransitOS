'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SmartDocumentUploader } from './SmartDocumentUploader';
import { vehicleSchema, VehicleSchemaType } from '../../schemas/vehicle.schema';
import { ExtractedVehicleData } from '../../services/ocr.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function VehicleForm() {
  const [highlightedFields, setHighlightedFields] = useState<Set<keyof VehicleSchemaType>>(new Set());

  const form = useForm<VehicleSchemaType>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      payloadCapacity: 0,
      currentOdometer: 0
    }
  });

  const handleExtraction = (data: ExtractedVehicleData) => {
    const fieldsToHighlight = new Set<keyof VehicleSchemaType>();

    // Map extracted data to form fields and mark them for highlighting
    if (data.registrationNumber) {
      form.setValue('registrationNumber', data.registrationNumber, { shouldValidate: true, shouldDirty: true });
      fieldsToHighlight.add('registrationNumber');
    }
    if (data.make) {
      form.setValue('make', data.make, { shouldValidate: true, shouldDirty: true });
      fieldsToHighlight.add('make');
    }
    if (data.model) {
      form.setValue('model', data.model, { shouldValidate: true, shouldDirty: true });
      fieldsToHighlight.add('model');
    }
    if (data.year) {
      form.setValue('year', data.year, { shouldValidate: true, shouldDirty: true });
      fieldsToHighlight.add('year');
    }
    if (data.vin) {
      form.setValue('vin', data.vin, { shouldValidate: true, shouldDirty: true });
      fieldsToHighlight.add('vin');
    }
    // Set other fields similarly...

    setHighlightedFields(fieldsToHighlight);

    // Remove highlighting after 3 seconds
    setTimeout(() => {
      setHighlightedFields(new Set());
    }, 3000);
  };

  const onSubmit = (data: VehicleSchemaType) => {
    console.log("Form submitted. Values confirmed by user:", data);
    // Submit to vehicle.service.ts
  };

  const getFieldClass = (fieldName: keyof VehicleSchemaType) => {
    return highlightedFields.has(fieldName)
      ? "ring-2 ring-green-500 animate-pulse bg-green-50 dark:bg-green-900/20 transition-all duration-300"
      : "transition-all duration-300";
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto p-6 bg-card rounded-xl border">
      <div>
        <h2 className="text-2xl font-bold mb-2">Register New Vehicle</h2>
        <p className="text-muted-foreground mb-6">Upload your RC or Insurance to automatically fill in the details below. Please review all highlighted fields.</p>
        
        <SmartDocumentUploader onExtractionComplete={handleExtraction} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="space-y-2">
          <label className="text-sm font-medium">Registration Number</label>
          <Input 
            {...form.register('registrationNumber')} 
            className={getFieldClass('registrationNumber')} 
            placeholder="MH01AB1234"
          />
          {form.formState.errors.registrationNumber && <p className="text-xs text-destructive">{form.formState.errors.registrationNumber.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">VIN / Chassis Number</label>
          <Input 
            {...form.register('vin')} 
            className={getFieldClass('vin')} 
          />
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
      </div>

      <div className="pt-4 flex justify-end gap-4 border-t">
        <Button variant="outline" type="button">Cancel</Button>
        <Button type="submit">Save Vehicle</Button>
      </div>
    </form>
  );
}
