'use server';

import { VehicleOcrService, ExtractedVehicleData } from '../services/ocr.service';

/**
 * Server action to process an uploaded document securely on the server.
 * This prevents the Gemini API key from being exposed to the client.
 */
export async function processVehicleDocument(
  base64Image: string,
  mimeType: string
): Promise<{ success: boolean; data?: ExtractedVehicleData; error?: string }> {
  try {
    const ocrService = new VehicleOcrService();
    const data = await ocrService.extractDataFromDocument(base64Image, mimeType);
    return { success: true, data };
  } catch (error: any) {
    console.error("Server Action Error - processVehicleDocument:", error);
    return { success: false, error: error.message || "Failed to process document." };
  }
}
