import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CommandCenterState } from '../types/command-center.types';
import { AICommandCenterInsights, generateCommandCenterInsights } from '../actions/CommandCenterAI.actions';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

export function AIOperationsPanel({ state }: { state: CommandCenterState }) {
  const [insights, setInsights] = useState<AICommandCenterInsights | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only run if we have data to avoid unnecessary AI calls during initial load
    if (state.isLoading) return;
    
    setLoading(true);
    generateCommandCenterInsights(state)
      .then(res => {
        setInsights(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [state.vehicles.length, state.activeTrips.length, state.isLoading]); // Depend on coarse changes, not object identity

  return (
    <Card className="col-span-full border-blue-200 dark:border-blue-900 shadow-sm bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-background">
      <CardHeader className="pb-3 border-b bg-white/50 dark:bg-black/20">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <Sparkles className="h-5 w-5" /> AI Fleet Operations
          </span>
          <Button variant="outline" size="sm" onClick={() => {
            setLoading(true);
            generateCommandCenterInsights(state).then(res => {
              setInsights(res);
              setLoading(false);
            });
          }} disabled={loading}>
            Refresh Insights
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {loading || !insights ? (
          <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-500" />
            <p>Gemini is analyzing fleet telemetry...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
            <div className="p-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Operations Summary</h4>
              <p className="text-sm leading-relaxed">{insights.fleetSummary}</p>
              
              <div className="mt-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Identified Risks</h4>
                <ul className="space-y-2">
                  {insights.identifiedRisks.map((risk, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span> {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Dispatch Suggestions</h4>
              <ul className="space-y-4">
                {insights.dispatchSuggestions.map((ds, i) => (
                  <li key={i} className="text-sm bg-blue-100/50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-200 dark:border-blue-800">
                    <div className="flex justify-between items-start">
                      <span>{ds.suggestion}</span>
                      <ArrowRight className="h-4 w-4 text-blue-500 shrink-0 ml-2 mt-0.5" />
                    </div>
                  </li>
                ))}
                {insights.dispatchSuggestions.length === 0 && (
                  <li className="text-sm text-muted-foreground">No pending dispatches recommended.</li>
                )}
              </ul>
            </div>

            <div className="p-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Maintenance & Strategy</h4>
              <ul className="space-y-3 mb-6">
                {insights.maintenancePriorities.map((mp, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span> {mp}
                  </li>
                ))}
              </ul>
              
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Recommendations</h4>
              <ul className="space-y-2">
                {insights.operationalRecommendations.map((or, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span>-</span> {or}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
