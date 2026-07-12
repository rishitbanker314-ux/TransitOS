'use server';

import { VehicleFilterOptions } from '../types/search.types';

/**
 * MOCK SERVER ACTION for Gemini AI natural language to structured JSON filters.
 * Real implementation would use the @google/genai SDK with structured output (responseSchema).
 */
export async function convertNaturalLanguageToFilters(prompt: string): Promise<VehicleFilterOptions> {
  console.log(`[AI Search] Processing query: "${prompt}"`);
  
  // Simulated Gemini processing delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const filters: VehicleFilterOptions = {};

  // Extremely basic mock NLP logic for demonstration
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('diesel')) {
    filters.fuelType = ['Diesel'];
  }
  if (lowerPrompt.includes('truck') || lowerPrompt.includes('trucks')) {
    filters.vehicleType = ['Truck'];
  }
  if (lowerPrompt.includes('insurance')) {
    // Set to 30 days from now
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);
    filters.insuranceExpiryMax = nextMonth.toISOString();
  }
  if (lowerPrompt.includes('idle')) {
    filters.status = ['Idle', 'Available'];
  }
  if (lowerPrompt.includes('maintenance')) {
    filters.status = ['MaintenanceScheduled', 'UnderMaintenance', 'Inspection'];
  }

  // If we couldn't parse anything specific, dump it in searchTerm
  if (Object.keys(filters).length === 0) {
    filters.searchTerm = prompt;
  }

  return filters;
}
