import React from 'react';
import { Card } from '@/components/ui/card';
import { AIFleetSummary } from '../../types/analytics.types';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FleetAIInsightsProps {
  insights: AIFleetSummary | null;
  isLoading: boolean;
}

export function FleetAIInsights({ insights, isLoading }: FleetAIInsightsProps) {
  if (isLoading || !insights) {
    return (
      <Card className="p-6 flex flex-col items-center justify-center min-h-[300px] border-blue-100 bg-blue-50/30">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-sm font-medium text-blue-800">Gemini is analyzing fleet telemetry...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-blue-200 bg-blue-50/10">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-bold text-blue-900">AI Decision Intelligence</h3>
      </div>
      
      <p className="text-sm text-blue-800/80 mb-6 font-medium leading-relaxed">
        {insights.summary}
      </p>

      <div className="space-y-4">
        {insights.insights.map(insight => (
          <div key={insight.id} className="bg-background rounded-lg p-4 border shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-sm">{insight.title}</h4>
              <span className="text-[10px] uppercase font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                {insight.category.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
            <div className="pt-3 border-t flex justify-between items-center">
              <span className="text-xs font-semibold text-blue-700">Recommendation:</span>
              <span className="text-xs text-foreground font-medium text-right flex-1 ml-4">{insight.recommendedAction}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-100">
          Run deep diagnostic <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
