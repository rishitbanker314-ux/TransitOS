import { collection, onSnapshot, query, where, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../firebase/config';
import { eventBus } from './BusinessEventBus';

export class RealtimeSyncManager {
  private static instance: RealtimeSyncManager;
  private unsubscribes: Map<string, () => void> = new Map();

  private constructor() {}

  public static getInstance(): RealtimeSyncManager {
    if (!RealtimeSyncManager.instance) {
      RealtimeSyncManager.instance = new RealtimeSyncManager();
    }
    return RealtimeSyncManager.instance;
  }

  /**
   * Initializes global realtime listeners
   */
  public initialize() {
    this.listenToActiveTrips();
    this.listenToVehicleStatuses();
    console.log('[RealtimeSyncManager] Initialized global Firestore listeners');
  }

  /**
   * Cleans up all listeners
   */
  public destroy() {
    this.unsubscribes.forEach(unsub => unsub());
    this.unsubscribes.clear();
    console.log('[RealtimeSyncManager] Destroyed global Firestore listeners');
  }

  // --- Listeners ---

  private listenToActiveTrips() {
    const q = query(collection(db, 'trips'), where('status', 'in', ['in_progress', 'assigned']));
    
    const unsub = onSnapshot(q, {
      next: (snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'modified') {
            const data = change.doc.data();
            // Publish local event for dashboard sync
            eventBus.publish(
              eventBus.createEvent(
                'trip.updated',
                'RealtimeSyncManager',
                'system',
                { tripId: change.doc.id, ...data },
                change.doc.id
              )
            );
          }
        });
      },
      error: (error) => {
        console.error('[RealtimeSyncManager] Error in ActiveTrips listener', error);
        // Fallback or retry strategy here
      }
    });

    this.unsubscribes.set('active_trips', unsub);
  }

  private listenToVehicleStatuses() {
    const q = query(collection(db, 'vehicles'), where('isArchived', '==', false));
    
    const unsub = onSnapshot(q, {
      next: (snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'modified') {
            const data = change.doc.data();
            eventBus.publish(
              eventBus.createEvent(
                'vehicle.status_changed',
                'RealtimeSyncManager',
                'system',
                { vehicleId: change.doc.id, status: data.status, ...data },
                change.doc.id
              )
            );
          }
        });
      },
      error: (error) => {
        console.error('[RealtimeSyncManager] Error in VehicleStatuses listener', error);
      }
    });

    this.unsubscribes.set('vehicle_statuses', unsub);
  }
}

export const realtimeSyncManager = RealtimeSyncManager.getInstance();
