'use client';

import React, { useState, useEffect } from 'react';
import { Vehicle } from '../../types/vehicle.types';
import { VehicleEditForm } from '../forms/VehicleEditForm';
import { VehicleUnsavedChangesDialog } from '../forms/VehicleUnsavedChangesDialog';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Skeleton } from '@/components/ui/skeleton';
// In a real app with next/router or react-router, use the router hook.
// We simulate navigation logic for this page component.

interface EditVehiclePageProps {
  vehicleId: string;
  currentUserId: string; // From auth context
  onNavigateBack: () => void;
}

export function EditVehiclePage({ vehicleId, currentUserId, onNavigateBack }: EditVehiclePageProps) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const fetchVehicle = async () => {
    setLoading(true);
    setError(null);
    try {
      const vehicleRef = doc(db, 'vehicles', vehicleId);
      const snap = await getDoc(vehicleRef);
      if (!snap.exists()) {
        throw new Error('Vehicle not found');
      }
      setVehicle(snap.data() as Vehicle);
    } catch (err: any) {
      setError(err.message || 'Failed to load vehicle data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, [vehicleId]);

  // Trap navigation if form is dirty (implementation depends on router)
  // For demonstration, we intercept the manual cancel/back button.
  const handleAttemptLeave = () => {
    if (isFormDirty) {
      setShowUnsavedDialog(true);
    } else {
      onNavigateBack();
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h2 className="text-xl font-bold text-destructive mb-2">Error Loading Vehicle</h2>
        <p className="text-muted-foreground">{error}</p>
        <button onClick={onNavigateBack} className="mt-4 text-primary hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <VehicleEditForm 
        initialVehicle={vehicle} 
        currentUserId={currentUserId}
        onSuccess={() => {
          setIsFormDirty(false);
          onNavigateBack();
        }}
        onCancel={handleAttemptLeave}
        onReloadRequested={fetchVehicle}
      />
      
      <VehicleUnsavedChangesDialog 
        isOpen={showUnsavedDialog} 
        onOpenChange={setShowUnsavedDialog}
        onConfirmLeave={() => {
          setShowUnsavedDialog(false);
          onNavigateBack();
        }}
      />
    </div>
  );
}
