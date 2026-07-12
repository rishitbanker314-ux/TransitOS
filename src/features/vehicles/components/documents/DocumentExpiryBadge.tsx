import React from 'react';
import { Badge } from '@/components/ui/badge';
import { differenceInDays, parseISO } from 'date-fns';

interface DocumentExpiryBadgeProps {
  expiryDate?: string; // ISO string
}

export function DocumentExpiryBadge({ expiryDate }: DocumentExpiryBadgeProps) {
  if (!expiryDate) return <Badge variant="secondary">No Expiry</Badge>;

  const daysUntilExpiry = differenceInDays(parseISO(expiryDate), new Date());

  if (daysUntilExpiry < 0) {
    return <Badge variant="destructive">Expired</Badge>;
  }
  
  if (daysUntilExpiry <= 15) {
    return <Badge variant="destructive">Expiring Soon ({daysUntilExpiry} days)</Badge>;
  }

  if (daysUntilExpiry <= 30) {
    return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Warning ({daysUntilExpiry} days)</Badge>;
  }

  return <Badge className="bg-green-500 hover:bg-green-600 text-white">Valid</Badge>;
}
