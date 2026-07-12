import React from 'react';
import { MaintenanceJob } from '../types/maintenance.types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function WorkOrderTable({ jobs }: { jobs: MaintenanceJob[] }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Work Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-4 py-3 rounded-tl-md">Job Title</th>
                <th className="px-4 py-3">Vehicle ID</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-tr-md">Scheduled</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{job.title}</td>
                  <td className="px-4 py-3">{job.vehicleId.substring(0, 8)}...</td>
                  <td className="px-4 py-3">{job.type}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={getPriorityColor(job.priority)}>
                      {job.priority}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{job.status}</td>
                  <td className="px-4 py-3">
                    {job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString() : 'TBD'}
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No active work orders.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
