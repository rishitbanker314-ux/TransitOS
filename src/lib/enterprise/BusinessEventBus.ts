export type BusinessEventType = 
  | 'vehicle.created' | 'vehicle.updated' | 'vehicle.status_changed'
  | 'trip.created' | 'trip.started' | 'trip.completed' | 'trip.failed' | 'trip.assigned'
  | 'maintenance.requested' | 'maintenance.started' | 'maintenance.finished' | 'maintenance.blocked'
  | 'driver.assigned' | 'driver.status_changed' | 'driver.available'
  | 'document.uploaded' | 'document.verified' | 'document.expired'
  | 'ai.insight_generated'
  | 'system.error';

export interface BusinessEvent<T = any> {
  id: string;
  type: BusinessEventType;
  timestamp: string;
  sourceModule: string;
  actor: string;
  payload: T;
  relatedEntityId?: string;
}

type EventCallback<T = any> = (event: BusinessEvent<T>) => Promise<void> | void;

class BusinessEventBus {
  private static instance: BusinessEventBus;
  private subscribers: Map<BusinessEventType, EventCallback[]> = new Map();

  private constructor() {}

  public static getInstance(): BusinessEventBus {
    if (!BusinessEventBus.instance) {
      BusinessEventBus.instance = new BusinessEventBus();
    }
    return BusinessEventBus.instance;
  }

  public subscribe<T = any>(eventType: BusinessEventType, callback: EventCallback<T>): () => void {
    const currentSubscribers = this.subscribers.get(eventType) || [];
    this.subscribers.set(eventType, [...currentSubscribers, callback as EventCallback]);

    // Return an unsubscribe function
    return () => {
      const updatedSubscribers = this.subscribers.get(eventType)?.filter(cb => cb !== callback) || [];
      this.subscribers.set(eventType, updatedSubscribers);
    };
  }

  public async publish<T = any>(event: BusinessEvent<T>): Promise<void> {
    console.log(`[EventBus] Publishing ${event.type} from ${event.sourceModule}`);
    
    const callbacks = this.subscribers.get(event.type) || [];
    
    // We execute all subscribers concurrently
    const results = await Promise.allSettled(callbacks.map(cb => cb(event)));

    // Handle any subscriber failures
    const failures = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');
    if (failures.length > 0) {
      console.error(`[EventBus] ${failures.length} subscribers failed for event ${event.type}`, failures);
      // In a real production system, push to a Dead Letter Queue here.
    }
  }

  public createEvent<T = any>(
    type: BusinessEventType, 
    sourceModule: string, 
    actor: string, 
    payload: T, 
    relatedEntityId?: string
  ): BusinessEvent<T> {
    return {
      id: crypto.randomUUID(),
      type,
      timestamp: new Date().toISOString(),
      sourceModule,
      actor,
      payload,
      relatedEntityId
    };
  }
}

export const eventBus = BusinessEventBus.getInstance();
