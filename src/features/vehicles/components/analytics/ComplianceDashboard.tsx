import React from 'react';
import { Card } from '@/components/ui/card';
import { FleetSnapshot } from '../../types/analytics.types';
import { ShieldCheck, ShieldAlert, FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ComplianceDashboardProps {
  compliance: FleetSnapshot['compliance'];
}

export function ComplianceDashboard({ compliance }: ComplianceDashboardProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Compliance & Risk</h3>
        <span className="text-sm font-bold px-3 py-1 bg-green-100 text-green-800 rounded-full">
          Score: {compliance.score}%
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 border rounded-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-full"><ShieldAlert className="h-4 w-4" /></div>
            <div>
              <p className="text-sm font-medium">Insurance Risk</p>
              <p className="text-xs text-muted-foreground">Expiring in &lt; 30 days</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">{compliance.insuranceExpiring30Days}</span>
            <Button variant="outline" size="sm">Review</Button>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border rounded-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-full"><FileWarning className="h-4 w-4" /></div>
            <div>
              <p className="text-sm font-medium">PUC Risk</p>
              <p className="text-xs text-muted-foreground">Expiring in &lt; 30 days</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">{compliance.pucExpiring30Days}</span>
            <Button variant="outline" size="sm">Review</Button>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border rounded-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 text-gray-600 rounded-full"><ShieldCheck className="h-4 w-4" /></div>
            <div>
              <p className="text-sm font-medium">Missing Documents</p>
              <p className="text-xs text-muted-foreground">Incomplete vehicle profiles</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">{compliance.missingDocuments}</span>
            <Button variant="outline" size="sm">Audit</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
