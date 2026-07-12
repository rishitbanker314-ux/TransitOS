import { eventBus, BusinessEvent } from './BusinessEventBus';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export class NotificationCoordinator {
  private static instance: NotificationCoordinator;
  private initialized = false;

  private constructor() {}

  public static getInstance(): NotificationCoordinator {
    if (!NotificationCoordinator.instance) {
      NotificationCoordinator.instance = new NotificationCoordinator();
    }
    return NotificationCoordinator.instance;
  }

  public initialize() {
    if (this.initialized) return;

    // High Priority Notifications
    eventBus.subscribe('system.error', (e) => this.dispatchNotification(e, ['ADMIN'], 'HIGH'));
    eventBus.subscribe('maintenance.requested', (e) => this.dispatchNotification(e, ['FLEET_MANAGER', 'TECHNICIAN'], 'HIGH'));
    eventBus.subscribe('trip.failed', (e) => this.dispatchNotification(e, ['DISPATCHER', 'FLEET_MANAGER'], 'HIGH'));
    
    // Medium Priority
    eventBus.subscribe('document.expired', (e) => this.dispatchNotification(e, ['FLEET_MANAGER'], 'MEDIUM'));
    eventBus.subscribe('trip.completed', (e) => this.dispatchNotification(e, ['DISPATCHER'], 'MEDIUM'));
    eventBus.subscribe('ai.insight_generated', (e) => this.dispatchNotification(e, ['FLEET_MANAGER'], 'MEDIUM'));
    
    // Low Priority
    eventBus.subscribe('vehicle.created', (e) => this.dispatchNotification(e, ['FLEET_MANAGER'], 'LOW'));
    eventBus.subscribe('driver.assigned', (e) => this.dispatchNotification(e, ['DRIVER'], 'LOW'));
    
    this.initialized = true;
    console.log('[NotificationCoordinator] Initialized role-based notification routing');
  }

  private async dispatchNotification(
    event: BusinessEvent, 
    roles: string[], 
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
  ) {
    try {
      const notificationRef = collection(db, 'notifications');
      
      const promises = roles.map(role => 
        addDoc(notificationRef, {
          eventId: event.id,
          eventType: event.type,
          role,
          priority,
          payload: event.payload,
          timestamp: new Date().toISOString(),
          read: false
        })
      );

      await Promise.allSettled(promises);
      console.log(`[NotificationCoordinator] Dispatched ${priority} notification for ${event.type} to ${roles.join(',')}`);
    } catch (error) {
      console.error('[NotificationCoordinator] Failed to dispatch notification', error);
    }
  }
}

export const notificationCoordinator = NotificationCoordinator.getInstance();
