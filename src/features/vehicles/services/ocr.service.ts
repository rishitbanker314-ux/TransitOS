import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

export const ExtractedVehicleDataSchema = z.object({
  registrationNumber: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.number().optional(),
  vin: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  insuranceExpiryDate: z.string().optional(),
  pucExpiryDate: z.string().optional(),
});

export type ExtractedVehicleData = z.infer<typeof ExtractedVehicleDataSchema>;

export class VehicleOcrService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    // Expect GEMINI_API_KEY to be available in the environment
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  /**
   * Processes a base64 image (registration or insurance document) and extracts vehicle data
   * @param base64Image Base64 string of the image without the data URL prefix
   * @param mimeType Mime type of the image (e.g. image/jpeg, image/png, application/pdf)
   * @returns ExtractedVehicleData
   */
  async extractDataFromDocument(base64Image: string, mimeType: string): Promise<ExtractedVehicleData> {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    // Use Gemini 1.5 Pro or Flash as it supports JSON structured output
    const model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `
      You are an expert OCR AI specialized in analyzing vehicle registration certificates and insurance policies.
      Extract the following information from the provided document image and output exactly in the JSON format requested.
      
      Fields to extract (if available, otherwise omit or return null):
      - registrationNumber (e.g., MH01AB1234)
      - make (e.g., Tata, Volvo)
      - model (e.g., LPK 2518)
      - year (numeric year of manufacture)
      - vin (Vehicle Identification Number / Chassis Number)
      - insuranceProvider (Company Name)
      - insurancePolicyNumber
      - insuranceExpiryDate (Convert to ISO 8601 YYYY-MM-DD if possible)
      - pucExpiryDate (Convert to ISO 8601 YYYY-MM-DD if possible)

      Ensure the output strictly adheres to this structure.
    `;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType
      },
    };

    try {
      const result = await model.generateContent([prompt, imagePart]);
      const responseText = result.response.text();
      
      const parsedJson = JSON.parse(responseText);
      
      // Validate the JSON against our schema to strip out hallucinations
      const validatedData = ExtractedVehicleDataSchema.parse(parsedJson);
      
      return validatedData;
    } catch (error) {
      console.error("OCR Extraction failed:", error);
      throw new Error("Failed to process document with AI OCR.");
    }
  }
}
