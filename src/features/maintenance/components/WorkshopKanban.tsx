import React from 'react';
import { MaintenanceJob } from '../types/maintenance.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function WorkshopKanban({ jobs }: { jobs: MaintenanceJob[] }) {
  const columns = ['Scheduled', 'InProgress', 'Inspection', 'Completed'];

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Workshop Flow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {columns.map(col => {
            const colJobs = jobs.filter(j => j.status === col);
            return (
              <div key={col} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-dashed">
                <h3 className="font-semibold text-sm mb-4 flex items-center justify-between text-muted-foreground uppercase tracking-wider">
                  {col}
                  <Badge variant="secondary">{colJobs.length}</Badge>
                </h3>
                <div className="space-y-3">
                  {colJobs.map(job => (
                    <div key={job.id} className="bg-background p-3 rounded-md border shadow-sm cursor-pointer hover:border-primary/50 transition-colors">
                      <div className="font-medium text-sm mb-1">{job.title}</div>
                      <div className="text-xs text-muted-foreground mb-2">{job.vehicleId.substring(0, 8)}...</div>
                      <Badge variant="outline" className="text-[10px]">
                        {job.priority}
                      </Badge>
                    </div>
                  ))}
                  {colJobs.length === 0 && (
                    <div className="text-center py-6 text-xs text-muted-foreground">
                      No jobs
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
