import { db } from '@/lib/firebase/config';
import { TripEvent, TripEventType } from '../types/trip.types';

export class TripTimelineService {
  /**
   * Logs an immutable event to the trip's timeline subcollection.
   */
  async logEvent(
    tripId: string,
    type: TripEventType,
    message: string,
    userId: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const tripRef = db.collection('trips').doc(tripId);
    const eventRef = tripRef.collection('trip_events').doc();
    
    const event: TripEvent = {
      id: eventRef.id,
      tripId,
      type,
      message,
      userId,
      timestamp: new Date().toISOString(),
      metadata
    };

    await eventRef.set(event);

    // Also log to the global audit trail
    await db.collection('audit_logs').doc().set({
      action: 'UPDATE',
      entity: 'Trip',
      entityId: tripId,
      userId,
      details: { type, message, metadata },
      timestamp: new Date().toISOString()
    });
  }

  async getTimeline(tripId: string): Promise<TripEvent[]> {
    const snapshot = await db.collection('trips').doc(tripId)
      .collection('trip_events')
      .orderBy('timestamp', 'desc')
      .get();
    
    return snapshot.docs.map((doc: any) => doc.data() as TripEvent);
  }
}
