import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Plus, CarFront, FileText, Wrench } from 'lucide-react';

export function QuickActions() {
  return (
    <Card className="col-span-full border-dashed bg-slate-50 dark:bg-slate-900/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
          <Zap className="h-4 w-4" /> Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <Button variant="default" size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> New Trip
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <CarFront className="h-4 w-4" /> Assign Vehicle
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Wrench className="h-4 w-4" /> Schedule Maintenance
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-4 w-4" /> Upload Document
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
