import { eventBus, BusinessEvent, BusinessEventType } from './BusinessEventBus';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export class AuditCoordinator {
  private static instance: AuditCoordinator;
  private initialized = false;

  private constructor() {}

  public static getInstance(): AuditCoordinator {
    if (!AuditCoordinator.instance) {
      AuditCoordinator.instance = new AuditCoordinator();
    }
    return AuditCoordinator.instance;
  }

  public initialize() {
    if (this.initialized) return;

    // We subscribe to a wildcard conceptually, but here we just iterate all types
    const allEventTypes: BusinessEventType[] = [
      'vehicle.created', 'vehicle.updated', 'vehicle.status_changed',
      'trip.created', 'trip.started', 'trip.completed', 'trip.failed', 'trip.assigned',
      'maintenance.requested', 'maintenance.started', 'maintenance.finished', 'maintenance.blocked',
      'driver.assigned', 'driver.status_changed', 'driver.available',
      'document.uploaded', 'document.verified', 'document.expired',
      'ai.insight_generated', 'system.error'
    ];

    allEventTypes.forEach(type => {
      eventBus.subscribe(type, this.logEvent.bind(this));
    });

    this.initialized = true;
    console.log('[AuditCoordinator] Initialized global audit logging');
  }

  private async logEvent(event: BusinessEvent) {
    try {
      const auditRef = collection(db, 'audit_logs');
      await addDoc(auditRef, {
        eventId: event.id,
        eventType: event.type,
        timestamp: event.timestamp,
        actor: event.actor,
        sourceModule: event.sourceModule,
        relatedEntityId: event.relatedEntityId || null,
        // Stringify payload to prevent deeply nested mapping issues in firestore indexes
        payloadSnapshot: JSON.stringify(event.payload) 
      });
      console.log(`[AuditCoordinator] Successfully logged ${event.type} to audit trail`);
    } catch (error) {
      console.error(`[AuditCoordinator] FATAL: Failed to write audit log for ${event.type}`, error);
      // In enterprise systems, failing to audit is a critical error that might warrant halting the workflow.
    }
  }
}

export const auditCoordinator = AuditCoordinator.getInstance();
