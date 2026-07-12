import { DriverRepository } from '../repositories/driver.repository';
import { ComplianceRepository } from '../repositories/compliance.repository';
import { PerformanceService } from '../services/performance.service';

export class DriverAIActions {
  constructor(
    private driverRepo: DriverRepository = new DriverRepository(),
    private complianceRepo: ComplianceRepository = new ComplianceRepository(),
    private performanceService: PerformanceService = new PerformanceService()
  ) {}

  async recommendDriverForTrip(tripRequirements: { requiredCategories: string[], maxDistanceKm: number }) {
    // 1. Gather all available drivers
    const availableDrivers = await this.driverRepo.listAvailable();
    
    // 2. Hydrate with compliance and performance context
    const driverContexts = await Promise.all(
      availableDrivers.map(async (driver) => {
        const licences = await this.complianceRepo.getLicencesByDriver(driver.id);
        const metrics = await this.performanceService.calculateDriverMetrics(driver.id);
        
        return {
          driverId: driver.id,
          name: `${driver.firstName} ${driver.lastName}`,
          licences: licences.map(l => ({ categories: l.categories, status: l.status })),
          safetyScore: metrics.safetyScore,
          incidents: metrics.totalIncidents
        };
      })
    );

    // 3. In a real implementation, this payload would be sent to Gemini for processing.
    // The prompt would be structured to enforce a JSON schema output.
    /*
      PROMPT:
      You are the AI Dispatcher for Odoo TransitOps.
      Find the best driver for the trip based on the following requirements:
      ${JSON.stringify(tripRequirements)}
      
      Available drivers and their metrics:
      ${JSON.stringify(driverContexts)}
      
      RULES:
      1. Driver MUST have the required licence categories.
      2. Prioritize drivers with highest safety scores.
      3. Return ONLY a JSON object matching this schema:
      {
        "recommendedDriverId": "string",
        "reasoning": "string",
        "confidenceScore": "number"
      }
    */
    
    // Mocking the AI response for this structural blueprint
    const qualifiedDrivers = driverContexts.filter(d => 
      d.licences.some(l => l.status === 'Valid' && tripRequirements.requiredCategories.every(cat => l.categories.includes(cat)))
    );
    
    if (qualifiedDrivers.length === 0) {
      return { recommendedDriverId: null, reasoning: 'No drivers available with required categories.', confidenceScore: 0 };
    }
    
    qualifiedDrivers.sort((a, b) => b.safetyScore - a.safetyScore);
    const topDriver = qualifiedDrivers[0];

    return {
      recommendedDriverId: topDriver.driverId,
      reasoning: `Selected ${topDriver.name} due to optimal safety score of ${topDriver.safetyScore} and matching licence categories.`,
      confidenceScore: 0.95
    };
  }
}
