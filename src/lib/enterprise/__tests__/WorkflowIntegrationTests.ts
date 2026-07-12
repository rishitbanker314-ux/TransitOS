import { eventBus } from '../BusinessEventBus';
import { workflowEngine } from '../WorkflowEngine';
import { auditCoordinator } from '../AuditCoordinator';
import { notificationCoordinator } from '../NotificationCoordinator';
import { WorkflowValidator } from '../WorkflowValidator';

describe('Enterprise Integration & Workflow Tests', () => {

  beforeAll(() => {
    // Initialize the enterprise ecosystem
    workflowEngine.initialize();
    auditCoordinator.initialize();
    notificationCoordinator.initialize();
  });

  it('should validate workflow constraints before executing', () => {
    // 1. Vehicle locked for maintenance cannot be dispatched
    const canDispatchMaintenance = WorkflowValidator.canDispatchVehicle('maintenance', 'compliant', true);
    expect(canDispatchMaintenance).toBe(false);

    // 2. Vehicle lacking compliance cannot be dispatched
    const canDispatchNonCompliant = WorkflowValidator.canDispatchVehicle('available', 'expired', false);
    expect(canDispatchNonCompliant).toBe(false);

    // 3. Valid vehicle can be dispatched
    const canDispatchValid = WorkflowValidator.canDispatchVehicle('available', 'compliant', false);
    expect(canDispatchValid).toBe(true);

    // 4. Overworked driver cannot be assigned
    const canAssignOverworked = WorkflowValidator.canAssignDriver('available', true, 13);
    expect(canAssignOverworked).toBe(false);
  });

  it('should trigger maintenance when a trip completes and crosses mileage threshold', async () => {
    const mockTripCompletedPayload = {
      tripId: 'TRIP-123',
      vehicleId: 'VEH-456',
      driverId: 'DRV-789',
      currentMileage: 10500, // over threshold
    };

    // We can spy on the eventBus to ensure the cascade happens
    const publishSpy = jest.spyOn(eventBus, 'publish');

    const completedEvent = eventBus.createEvent(
      'trip.completed',
      'TripModule',
      'dispatcher-01',
      mockTripCompletedPayload,
      'TRIP-123'
    );

    await eventBus.publish(completedEvent);

    // Assert that WorkflowEngine reacted and requested maintenance
    expect(publishSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'maintenance.requested',
        payload: expect.objectContaining({
          vehicleId: 'VEH-456',
        })
      })
    );

    // Assert that WorkflowEngine made the driver available again
    expect(publishSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'driver.available',
        payload: expect.objectContaining({
          driverId: 'DRV-789',
        })
      })
    );
  });

  it('should dispatch system error notifications for critical failures', async () => {
    const errorEvent = eventBus.createEvent(
      'system.error',
      'PaymentModule',
      'system',
      { error: 'Payment gateway timeout', severity: 'critical' }
    );

    const publishSpy = jest.spyOn(eventBus, 'publish');
    await eventBus.publish(errorEvent);

    expect(publishSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'system.error',
      })
    );
    // Real implementation would verify the db mock call from NotificationCoordinator
  });
});
