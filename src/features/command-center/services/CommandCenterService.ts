import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, limit, onSnapshot, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { Vehicle } from '../../vehicles/types/vehicle.types';
import { Trip } from '../../trips/types/trip.types';
import { ActivityEvent, CommandAlert } from '../types/command-center.types';

export class CommandCenterService {
  /**
   * Subscribes to active trips. We limit to InProgress and Assigned.
   */
  subscribeToActiveTrips(callback: (trips: Trip[]) => void) {
    const q = query(
      collection(db, 'trips'),
      where('status', 'in', ['Assigned', 'InProgress', 'Paused'])
    );
    
    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const trips = snapshot.docs.map(doc => doc.data() as Trip);
      callback(trips);
    });
  }

  /**
   * Subscribes to all non-archived vehicles to give a complete fleet overview.
   */
  subscribeToFleet(callback: (vehicles: Vehicle[]) => void) {
    const q = query(
      collection(db, 'vehicles'),
      where('isArchived', '==', false)
    );
    
    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const vehicles = snapshot.docs.map(doc => doc.data() as Vehicle);
      callback(vehicles);
    });
  }

  /**
   * Subscribes to recent audit logs for the activity feed.
   */
  subscribeToActivityFeed(callback: (events: ActivityEvent[]) => void) {
    const q = query(
      collection(db, 'audit_logs'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    
    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const events = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          action: data.action,
          entity: data.entity,
          entityId: data.entityId,
          userId: data.userId,
          timestamp: data.timestamp,
          details: data.details
        } as ActivityEvent;
      });
      callback(events);
    });
  }

  /**
   * Generates alerts based on current state of vehicles and trips.
   * This is computed client-side for immediate feedback, though an enterprise
   * version might use Cloud Functions to push these to a dedicated alerts collection.
   */
  computeAlerts(vehicles: Vehicle[], activeTrips: Trip[]): CommandAlert[] {
    const alerts: CommandAlert[] = [];
    const now = new Date();

    vehicles.forEach(v => {
      if (v.status === 'In Shop') {
        alerts.push({
          id: `alert-maint-${v.id}`,
          severity: 'Warning',
          message: `Vehicle ${v.registrationNumber} is in shop for maintenance.`,
          source: 'Vehicle',
          timestamp: now.toISOString(),
          entityId: v.id
        });
      }
      
      if (v.insuranceExpiry) {
        const expiry = new Date(v.insuranceExpiry);
        const daysToExpiry = (expiry.getTime() - now.getTime()) / (1000 * 3600 * 24);
        if (daysToExpiry < 0) {
          alerts.push({
            id: `alert-ins-exp-${v.id}`,
            severity: 'Critical',
            message: `Insurance expired for ${v.registrationNumber}`,
            source: 'Vehicle',
            timestamp: now.toISOString(),
            entityId: v.id
          });
        } else if (daysToExpiry <= 30) {
          alerts.push({
            id: `alert-ins-warn-${v.id}`,
            severity: 'Warning',
            message: `Insurance expiring soon for ${v.registrationNumber} (${Math.ceil(daysToExpiry)} days)`,
            source: 'Vehicle',
            timestamp: now.toISOString(),
            entityId: v.id
          });
        }
      }
    });

    activeTrips.forEach(t => {
      if (t.status === 'Paused') {
        alerts.push({
          id: `alert-trip-paused-${t.id}`,
          severity: 'Critical',
          message: `Trip ${t.title} has been paused unexpectedly.`,
          source: 'Trip',
          timestamp: now.toISOString(),
          entityId: t.id
        });
      }
    });

    // Sort by severity (Critical first, then Warning, then Info)
    const severityOrder = { Critical: 0, Warning: 1, Info: 2 };
    return alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  }
}
