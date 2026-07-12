import React, { useEffect, useState } from 'react';
import { ReportBuilder } from './ReportBuilder';
import { ExecutiveSummary } from './ExecutiveSummary';
import { reportingService } from '../services/ReportingService';
import { generateExecutiveBriefing } from '../actions/AIExecutiveBriefing.actions';
import { MetricAggregation, AIExecutiveSummary } from '../types/reporting.types';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const ReportCharts = React.lazy(() => import('./ReportCharts'));

export function ReportsDashboard() {
  const [metrics, setMetrics] = useState<MetricAggregation[]>([]);
  const [costData, setCostData] = useState<{ month: string; cost: number }[]>([]);
  const [briefing, setBriefing] = useState<AIExecutiveSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [fleetMetrics, costs] = await Promise.all([
      reportingService.getFleetMetrics(),
      reportingService.getMaintenanceCosts()
    ]);
    
    setMetrics(fleetMetrics);
    setCostData(costs);
    
    // Automatically generate AI briefing based on metrics
    const aiSummary = await generateExecutiveBriefing(fleetMetrics);
    setBriefing(aiSummary);
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-muted-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p>Generating Executive Reports...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 print:p-0 print:space-y-4">
      <div className="print:hidden">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Executive Reporting</h1>
        <p className="text-muted-foreground">Comprehensive fleet intelligence and AI briefings.</p>
      </div>

      <ReportBuilder onGenerate={(type, range) => console.log('Generating', type, range)} />

      <ExecutiveSummary briefing={briefing} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{m.label}</div>
                {m.trend === 'up' ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : 
                 m.trend === 'down' ? <TrendingDown className="h-4 w-4 text-rose-500" /> : 
                 <Minus className="h-4 w-4 text-slate-400" />}
              </div>
              <div className="text-3xl font-bold mt-2">{m.value}</div>
              <div className={`text-xs font-medium mt-1 ${m.percentageChange > 0 ? 'text-emerald-600' : m.percentageChange < 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                {m.percentageChange > 0 ? '+' : ''}{m.percentageChange}% from last period
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <React.Suspense fallback={
        <div className="flex items-center justify-center h-64 border rounded-xl bg-slate-50 dark:bg-slate-900/50">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }>
        <ReportCharts metrics={metrics} costData={costData} />
      </React.Suspense>
    </div>
  );
}
