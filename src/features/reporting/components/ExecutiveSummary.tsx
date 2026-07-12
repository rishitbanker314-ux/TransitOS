import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AIExecutiveSummary } from '../types/reporting.types';
import { Bot, Lightbulb, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function ExecutiveSummary({ briefing }: { briefing: AIExecutiveSummary | null }) {
  if (!briefing) return null;

  return (
    <Card className="border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-background">
      <CardHeader className="border-b bg-white/50 dark:bg-black/20 pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
            <Bot className="h-6 w-6" /> AI Executive Briefing
          </CardTitle>
          <div className="text-right">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              AI Confidence Score
            </div>
            <div className="flex items-center justify-end gap-2">
              <Progress value={briefing.confidenceScore * 100} className="w-24 h-2" />
              <span className="text-sm font-bold text-indigo-600">{Math.round(briefing.confidenceScore * 100)}%</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{briefing.summary}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
          <div>
            <h4 className="text-sm font-bold flex items-center gap-2 text-orange-600 mb-3 uppercase tracking-wider">
              <AlertTriangle className="h-4 w-4" /> Operational Risks
            </h4>
            <ul className="space-y-2">
              {briefing.keyRisks.map((risk, i) => (
                <li key={i} className="text-sm flex items-start gap-2 text-muted-foreground">
                  <span className="text-orange-500 mt-0.5">•</span> {risk}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold flex items-center gap-2 text-emerald-600 mb-3 uppercase tracking-wider">
              <Lightbulb className="h-4 w-4" /> Strategic Recommendations
            </h4>
            <ul className="space-y-2">
              {briefing.recommendations.map((rec, i) => (
                <li key={i} className="text-sm flex items-start gap-2 text-muted-foreground">
                  <span className="text-emerald-500 mt-0.5">•</span> {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
