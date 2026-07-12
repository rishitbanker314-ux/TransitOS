import { useState, useEffect } from 'react';
import { FleetAnalyticsService } from '../services/analytics/FleetAnalyticsService';
import { generateFleetInsights } from '../actions/FleetAnalyticsAI.actions';
import { FleetSnapshot, FleetAlert, AIFleetSummary } from '../types/analytics.types';

export function useFleetAnalytics() {
  const [snapshot, setSnapshot] = useState<FleetSnapshot | null>(null);
  const [alerts, setAlerts] = useState<FleetAlert[]>([]);
  const [aiInsights, setAiInsights] = useState<AIFleetSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAILoading, setIsAILoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const service = new FleetAnalyticsService();

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [snapData, alertData] = await Promise.all([
          service.getLatestSnapshot(),
          service.getAlerts()
        ]);

        if (mounted) {
          setSnapshot(snapData);
          setAlerts(alertData);
          
          // Trigger AI Analysis automatically when snapshot loads
          setIsAILoading(true);
          generateFleetInsights(snapData)
            .then(insights => {
              if (mounted) setAiInsights(insights);
            })
            .catch(err => console.error("AI Insight generation failed", err))
            .finally(() => {
              if (mounted) setIsAILoading(false);
            });
        }
      } catch (err: any) {
        if (mounted) setError(err.message || 'Failed to load analytics');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadData();
    return () => { mounted = false; };
  }, []);

  return {
    snapshot,
    alerts,
    aiInsights,
    isLoading,
    isAILoading,
    error
  };
}
