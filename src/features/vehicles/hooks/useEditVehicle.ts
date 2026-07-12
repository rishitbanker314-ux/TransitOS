import { useState, useCallback } from 'react';
import { Vehicle, UpdateVehicleDTO } from '../types/vehicle.types';
import { VehicleEditService } from '../services/VehicleEditService';
import { VehicleDiffEngine, FieldChange } from '../services/VehicleDiffEngine';

export function useEditVehicle(initialVehicle: Vehicle) {
  const [vehicle, setVehicle] = useState<Vehicle>(initialVehicle);
  const [draft, setDraft] = useState<Partial<Vehicle>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflictError, setConflictError] = useState<string | null>(null);

  const editService = new VehicleEditService();

  // Compute changes dynamically
  const changes = VehicleDiffEngine.computeDifferences(vehicle, draft);
  const isDirty = changes.length > 0;

  const updateField = useCallback(<K extends keyof Vehicle>(field: K, value: Vehicle[K]) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  }, []);

  const saveChanges = async (userId: string) => {
    if (!isDirty) return;

    setIsSaving(true);
    setError(null);
    setConflictError(null);

    try {
      await editService.updateVehicle(vehicle.id, draft as UpdateVehicleDTO, userId, vehicle.version);
      
      // On success, merge draft into vehicle and bump version locally
      setVehicle(prev => ({
        ...prev,
        ...draft,
        version: prev.version + 1
      }));
      setDraft({}); // Clear draft
    } catch (err: any) {
      if (err.message?.includes('CONFLICT')) {
        setConflictError(err.message);
      } else {
        setError(err.message || 'Failed to update vehicle');
      }
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const discardChanges = useCallback(() => {
    setDraft({});
    setError(null);
    setConflictError(null);
  }, []);

  return {
    vehicle,
    draft,
    changes,
    isDirty,
    isSaving,
    error,
    conflictError,
    updateField,
    saveChanges,
    discardChanges
  };
}
