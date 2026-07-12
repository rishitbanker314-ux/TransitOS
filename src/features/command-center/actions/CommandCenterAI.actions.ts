import { CommandCenterState } from '../types/command-center.types';

export interface AICommandCenterInsights {
  fleetSummary: string;
  identifiedRisks: string[];
  dispatchSuggestions: {
    tripId?: string;
    suggestion: string;
  }[];
  maintenancePriorities: string[];
  operationalRecommendations: string[];
}

export async function generateCommandCenterInsights(state: CommandCenterState): Promise<AICommandCenterInsights> {
  // In a production environment, this would call a secure Cloud Function 
  // that communicates with the Gemini API to analyze the data payload.
  
  // Here we simulate the AI response based on the current local state.
  return new Promise((resolve) => {
    setTimeout(() => {
      const idleCount = state.vehicles.filter(v => v.status === 'Available').length;
      const maintCount = state.vehicles.filter(v => v.status === 'In Shop').length;
      const criticalAlerts = state.alerts.filter(a => a.severity === 'Critical');

      resolve({
        fleetSummary: `Currently tracking ${state.vehicles.length} total vehicles. ${idleCount} available, ${state.activeTrips.length} active trips.`,
        identifiedRisks: criticalAlerts.length > 0 
          ? criticalAlerts.map(a => a.message)
          : ['No immediate critical risks identified.'],
        dispatchSuggestions: idleCount > 0 
          ? [{ suggestion: `Consider assigning the ${idleCount} available vehicles to pending drafts.` }]
          : [],
        maintenancePriorities: maintCount > 0
          ? [`Expedite repairs on the ${maintCount} vehicles currently in the shop to increase fleet capacity.`]
          : ['No urgent maintenance required.'],
        operationalRecommendations: [
          'Monitor the active trips to ensure ETAs are met.',
          'Review upcoming insurance renewals this week.'
        ]
      });
    }, 1500); // Simulate network/AI latency
  });
}
