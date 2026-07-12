import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricAggregation } from '../types/reporting.types';

interface Props {
  metrics: MetricAggregation[];
  costData: { month: string; cost: number }[];
}

export default function ReportCharts({ metrics, costData }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 break-inside-avoid">
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Costs Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={costData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" fontSize={12} tickMargin={10} />
              <YAxis fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
              <Tooltip formatter={(value) => [`$${value}`, 'Cost']} />
              <Line type="monotone" dataKey="cost" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fleet Utilization</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.filter(m => m.label !== 'Total Fleet')}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="label" fontSize={12} tickMargin={10} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
