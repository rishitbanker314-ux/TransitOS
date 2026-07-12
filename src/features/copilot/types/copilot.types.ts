export type MessageRole = 'user' | 'assistant' | 'system';

export interface ActionCardData {
  id: string;
  type: 'dispatch' | 'maintenance' | 'driver_assignment';
  payload: {
    tripId?: string;
    vehicleId?: string;
    driverId?: string;
    reason?: string;
    scheduleDate?: string;
    [key: string]: any;
  };
  reasoning: string;
  status: 'pending' | 'approved' | 'rejected';
  confidenceScore: number;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string; // ISO string
  actionCard?: ActionCardData;
  isStreaming?: boolean;
}

export interface CopilotContext {
  activeVehicleId?: string;
  activeDriverId?: string;
  activeView?: string;
  filters?: Record<string, any>;
  userRole: string;
  timestamp: string; // ISO string
}

export type Intent =
  | 'query_vehicles'
  | 'query_drivers'
  | 'query_trips'
  | 'query_maintenance'
  | 'query_compliance'
  | 'query_analytics'
  | 'dispatch_proposal'
  | 'maintenance_proposal'
  | 'general_chat'
  | 'unknown';
