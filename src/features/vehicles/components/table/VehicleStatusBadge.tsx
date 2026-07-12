import React from 'react';
import { VehicleStatus } from '../../types/vehicle.types';
import { Badge } from '@/components/ui/badge';

interface Props {
  status: VehicleStatus;
}

export function VehicleStatusBadge({ status }: Props) {
  const variantMap: Record<VehicleStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    'Available': 'default',
    'On Trip': 'secondary',
    'In Shop': 'destructive',
    'Retired': 'outline',
  };

  return (
    <Badge variant={variantMap[status]}>
      {status}
    </Badge>
  );
}
