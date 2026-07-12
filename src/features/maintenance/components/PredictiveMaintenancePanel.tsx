import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PredictiveMaintenanceRecommendation } from '../types/maintenance.types';
import { computePredictiveMaintenance } from '../actions/PredictiveMaintenanceAI.actions';
import { Sparkles, Loader2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export function PredictiveMaintenancePanel() {
  const [recommendation, setRecommendation] = useState<PredictiveMaintenanceRecommendation | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPrediction = async () => {
    setLoading(true);
    // In a real scenario, this would pass specific vehicle data
    const res = await computePredictiveMaintenance('VH-7392-XT', [], 85000);
    setRecommendation(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchPrediction();
  }, []);

  return (
    <Card className="col-span-full md:col-span-1 border-blue-200 dark:border-blue-900 shadow-sm bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-background">
      <CardHeader className="pb-3 border-b bg-white/50 dark:bg-black/20">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <Sparkles className="h-5 w-5" /> Predictive AI Analysis
          </span>
          <Button variant="outline" size="sm" onClick={fetchPrediction} disabled={loading}>
            Scan Fleet
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {loading || !recommendation ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-500" />
            <p>Gemini is scanning telemetry for failure patterns...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-100 dark:border-orange-900/30">
              <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-800 dark:text-orange-400">High Risk Detected</h4>
                <p className="text-sm mt-1 text-orange-700 dark:text-orange-300">Vehicle {recommendation.vehicleId} has a {Math.round(recommendation.probabilityOfFailure * 100)}% probability of failure before {new Date(recommendation.predictedFailureDate).toLocaleDateString()}.</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground font-medium uppercase tracking-wider">Confidence Score</span>
                <span className="font-semibold text-blue-600">{Math.round(recommendation.confidenceScore * 100)}%</span>
              </div>
              <Progress value={recommendation.confidenceScore * 100} className="h-2" />
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Recommended Action</h4>
              <div className="bg-muted/50 p-3 rounded-md text-sm flex items-start gap-3 border">
                <span>{recommendation.recommendedAction}</span>
                <Button size="sm" className="shrink-0 h-7 ml-auto gap-1">Create Job <ArrowRight className="h-3 w-3" /></Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">AI Reasoning</h4>
              <p className="text-sm leading-relaxed text-muted-foreground bg-background p-3 rounded-md border border-dashed">
                {recommendation.reasoning}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
