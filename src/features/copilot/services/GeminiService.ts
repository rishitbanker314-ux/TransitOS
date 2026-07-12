import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message, ActionCardData } from '../types/copilot.types';

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private modelName = 'gemini-1.5-flash';

  constructor(apiKey?: string) {
    const key = apiKey || this.getApiKey();
    if (key) {
      this.genAI = new GoogleGenerativeAI(key);
    }
  }

  private getApiKey(): string | null {
    if (typeof process !== 'undefined' && process.env) {
      if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) return process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem('TRANSITOPS_GEMINI_API_KEY');
    }
    return null;
  }

  public hasClient(): boolean {
    return this.genAI !== null;
  }

  /**
   * Streams response from Gemini API or falls back to a simulated operations engine if API key is not set.
   */
  public async *streamChatResponse(
    prompt: string,
    history: Message[],
    systemInstruction: string
  ): AsyncGenerator<{ text: string; proposal?: ActionCardData }, void, unknown> {
    
    if (!this.genAI) {
      // Offline/Mock simulation mode
      yield* this.simulateResponse(prompt, systemInstruction);
      return;
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction: systemInstruction,
      });

      // Map our message history format to Gemini's expected format
      const contents = history.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      // Append latest prompt
      contents.push({
        role: 'user',
        parts: [{ text: prompt }]
      });

      const result = await model.generateContentStream({
        contents
      });

      let fullText = '';
      for await (const chunk of result.stream) {
        const textChunk = chunk.text();
        fullText += textChunk;
        yield { text: textChunk };
      }

      // Check if there is a JSON proposal inside the full response
      const proposal = this.extractProposal(fullText);
      if (proposal) {
        yield { text: '', proposal };
      }
    } catch (error) {
      console.error('Error generating content from Gemini API:', error);
      yield { text: `\n\n[API Error: ${error instanceof Error ? error.message : 'Unknown error'}]. Falling back to offline simulator:\n` };
      yield* this.simulateResponse(prompt, systemInstruction);
    }
  }

  private extractProposal(text: string): ActionCardData | undefined {
    try {
      const match = text.match(/```json-proposal\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        const parsed = JSON.parse(match[1]);
        return {
          id: `proposal-${Date.now()}`,
          type: parsed.type,
          payload: parsed.payload,
          reasoning: parsed.reasoning || '',
          status: 'pending',
          confidenceScore: parsed.confidenceScore || 0.9
        };
      }
    } catch (e) {
      console.error('Failed to parse json-proposal block', e);
    }
    return undefined;
  }

  private async *simulateResponse(
    prompt: string,
    systemInstruction: string
  ): AsyncGenerator<{ text: string; proposal?: ActionCardData }, void, unknown> {
    const clean = prompt.toLowerCase();
    
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let responseText = '';
    let proposal: ActionCardData | undefined = undefined;

    // Check role from system instruction
    const isDispatcher = systemInstruction.includes('Dispatcher') || systemInstruction.includes('admin') || systemInstruction.includes('FleetManager');
    const isMaintenanceOrManager = systemInstruction.includes('Maintenance') || systemInstruction.includes('admin') || systemInstruction.includes('FleetManager');

    if (clean.includes('overworked')) {
      responseText = `Based on current operational logs:
* **Suresh Sharma** (Driver ID: \`d-202\`) is currently assigned to **Mumbai - Pune Express Route** (\`t-301\`).
* The planned arrival was 2 hours ago, but the trip is flagged as **InProgress** and delayed, accumulating extra driving hours.
* Rajesh Kumar is currently **Available** and well-rested.

**Recommendation**: Acknowledge delay on route \`t-301\` and monitor Suresh's driving limit.`;
    } 
    
    else if (clean.includes('maintenance') || clean.includes('shop')) {
      if (!isMaintenanceOrManager) {
        responseText = "Your current role does not have permission to schedule maintenance.";
      } else {
        responseText = `Analyzing fleet health telemetry:
* **Mahindra Blazo X** (\`MH-12-XY-1234\`) is currently in the status **In Shop** due to an expired PUC and warning flags.
* **Tata Ultra Truck** (\`MH-12-PQ-9876\`) has its insurance expiring in 4 days.

I suggest scheduling a preventive inspection for **Tata Ultra Truck** to renew compliance documents and check filters.`;
        
        proposal = {
          id: `proposal-${Date.now()}`,
          type: 'maintenance',
          payload: {
            vehicleId: 'v-101',
            reason: 'Preventive inspection & Insurance renewal pre-check',
            scheduleDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          },
          reasoning: 'Vehicle insurance expires in 4 days. Scheduling maintenance checks prior to dispatch is advised.',
          status: 'pending',
          confidenceScore: 0.92
        };
      }
    } 
    
    else if (clean.includes('assign') || clean.includes('dispatch') || clean.includes('tomorrow')) {
      if (!isDispatcher) {
        responseText = "Your current role does not have permission to dispatch trips.";
      } else {
        responseText = `To optimize tomorrow's dispatch:
* **Depot Transfer Route B** (\`t-302\`) is scheduled for tomorrow but has no assigned driver or vehicle.
* **Tata Ultra Truck** (\`v-101\`) and driver **Rajesh Kumar** (\`d-201\`) are both **Available** and qualify for this route.

I recommend assigning Rajesh Kumar and Tata Ultra Truck to Depot Transfer Route B.`;

        proposal = {
          id: `proposal-${Date.now()}`,
          type: 'dispatch',
          payload: {
            tripId: 't-302',
            vehicleId: 'v-101',
            driverId: 'd-201'
          },
          reasoning: 'Matching available driver Rajesh Kumar with Tata Ultra Truck for the Ahmedabad transfer route to maximize fleet utilization.',
          status: 'pending',
          confidenceScore: 0.95
        };
      }
    } 
    
    else if (clean.includes('utilization') || clean.includes('low')) {
      responseText = `Average fleet utilization is currently **33%** (with **66%** idle rate):
1. **Tata Ultra Truck** (\`v-101\`) is Idle/Available.
2. **Ashok Leyland Dost** (\`v-103\`) is Idle/Available.
3. Only 1 out of 3 vehicles is currently executing an active trip.

**Recommendation**: Reallocate idle vehicles to higher-demand northern hubs or schedule pending shipments immediately.`;
    } 
    
    else if (clean.includes('insurance') || clean.includes('expire') || clean.includes('compliance')) {
      responseText = `Compliance Review:
* **Tata Ultra Truck** (\`MH-12-PQ-9876\`) - **Insurance Expiring** in 4 days (${new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString()}).
* **Mahindra Blazo X** (\`MH-12-XY-1234\`) - **PUC Expired** 2 days ago.

**Action Required**: Renew PUC immediately for vehicle \`v-102\` and file insurance renewal papers for \`v-101\`.`;
    } 
    
    else if (clean.includes('summary') || clean.includes('report') || clean.includes('executive')) {
      responseText = `# Executive Fleet Operations Briefing
**Date**: ${new Date().toLocaleDateString()}
**Overall Health Score**: 82/100 | **Compliance Score**: 66%

### Operations Summary
* **Active Vehicles**: 1 / 3
* **Idle Vehicles**: 2 / 3
* **Overdue Maintenance**: 1
* **Active Alert**: Critical - 1 Vehicle PUC is Expired (\`v-102\`).

### Optimization Directives
1. **Compliance**: Renew PUC for \`v-102\` to restore active status.
2. **Dispatch**: Assign Rajesh Kumar to Depot Transfer Route B (\`t-302\`) to capture load.
3. **Safety**: Monitor delayed Mumbai-Pune run (\`t-301\`).`;
    } 
    
    else {
      responseText = `Hello! I am your Operations Copilot. I can assist you with:
* Finding overworked drivers or idle vehicles.
* Scheduling maintenance for vehicles (e.g. Tata Ultra Truck).
* Planning dispatches and routing tomorrow's trips.
* Extracting compliance documents and insurance expiry alerts.
* Generating executive status reports.

How can I help you optimize fleet operations today?`;
    }

    // Yield response in chunks to simulate streaming text
    const words = responseText.split(' ');
    for (let i = 0; i < words.length; i += 3) {
      const chunk = words.slice(i, i + 3).join(' ') + ' ';
      await new Promise(resolve => setTimeout(resolve, 80));
      yield { text: chunk };
    }

    // Append proposal if present
    if (proposal) {
      yield { text: '', proposal };
    }
  }
}
