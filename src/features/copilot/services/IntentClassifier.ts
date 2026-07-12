import { Intent } from '../types/copilot.types';

export class IntentClassifier {
  public classify(prompt: string): Intent {
    const clean = prompt.toLowerCase().trim();

    // 1. Dispatch Proposal Intents
    if (
      clean.includes('assign') || 
      clean.includes('dispatch') || 
      clean.includes('schedule trip') ||
      clean.includes('allocate')
    ) {
      return 'dispatch_proposal';
    }

    // 2. Maintenance / Repair Intents
    if (
      clean.includes('maintenance') || 
      clean.includes('in shop') || 
      clean.includes('repair') || 
      clean.includes('downtime') ||
      clean.includes('breakdown')
    ) {
      return 'query_maintenance';
    }

    // 3. Driver/Overworked Intents
    if (
      clean.includes('driver') || 
      clean.includes('overworked') || 
      clean.includes('workload') ||
      clean.includes('hours')
    ) {
      return 'query_drivers';
    }

    // 4. Trip Status / Delayed Intents
    if (
      clean.includes('trip') || 
      clean.includes('delayed') || 
      clean.includes('late') || 
      clean.includes('dispatch queue')
    ) {
      return 'query_trips';
    }

    // 5. Compliance & Documents
    if (
      clean.includes('insurance') || 
      clean.includes('puc') || 
      clean.includes('expire') || 
      clean.includes('compliance') ||
      clean.includes('document')
    ) {
      return 'query_compliance';
    }

    // 6. Analytics & Executive Reports
    if (
      clean.includes('utilization') || 
      clean.includes('summary') || 
      clean.includes('analytics') || 
      clean.includes('report') || 
      clean.includes('operating cost') ||
      clean.includes('health report') ||
      clean.includes('briefing')
    ) {
      return 'query_analytics';
    }

    // 7. General vehicle listings
    if (
      clean.includes('vehicle') || 
      clean.includes('truck') || 
      clean.includes('idle')
    ) {
      return 'query_vehicles';
    }

    // 8. Default
    if (clean.length > 0) {
      return 'general_chat';
    }

    return 'unknown';
  }
}
