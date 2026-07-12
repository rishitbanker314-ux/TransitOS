import React from 'react';
import { Card } from '@/components/ui/card';
import { FleetSnapshot } from '../../types/analytics.types';
import { DollarSign, TrendingDown } from 'lucide-react';

interface FleetCostAnalysisProps {
  costs: FleetSnapshot['costs'];
}

export function FleetCostAnalysis({ costs }: FleetCostAnalysisProps) {
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Cost Analysis</h3>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> Operating Cost (YTD)
            </span>
          </div>
          <div className="text-3xl font-bold">{formatCurrency(costs.totalOperatingCost)}</div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4" /> Cost Per Kilometer (CPK)
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(costs.averageCostPerKm)}<span className="text-sm font-normal text-muted-foreground">/km</span></div>
          <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
            CPK is up 2.4% this quarter due to rising fuel costs.
          </p>
        </div>
      </div>
    </Card>
  );
}
