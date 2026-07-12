import { eventBus, BusinessEvent } from './BusinessEventBus';

export class WorkflowEngine {
  private static instance: WorkflowEngine;
  private initialized = false;

  private constructor() {}

  public static getInstance(): WorkflowEngine {
    if (!WorkflowEngine.instance) {
      WorkflowEngine.instance = new WorkflowEngine();
    }
    return WorkflowEngine.instance;
  }

  /**
   * Initializes all workflow subscriptions
   */
  public initialize() {
    if (this.initialized) return;

    // 1. Vehicle Lifecycle Workflows
    eventBus.subscribe('vehicle.created', this.handleVehicleCreated);
    eventBus.subscribe('vehicle.updated', this.handleVehicleUpdated);

    // 2. Trip Lifecycle Workflows
    eventBus.subscribe('trip.created', this.handleTripCreated);
    eventBus.subscribe('trip.completed', this.handleTripCompleted);
    eventBus.subscribe('trip.failed', this.handleTripFailed);

    // 3. Maintenance Lifecycle Workflows
    eventBus.subscribe('maintenance.requested', this.handleMaintenanceRequested);
    eventBus.subscribe('maintenance.finished', this.handleMaintenanceFinished);

    // 4. Driver Lifecycle Workflows
    eventBus.subscribe('driver.assigned', this.handleDriverAssigned);

    // 5. Document Lifecycle Workflows
    eventBus.subscribe('document.uploaded', this.handleDocumentUploaded);
    
    this.initialized = true;
    console.log('[WorkflowEngine] Initialized all enterprise workflows');
  }

  // --- Handlers ---

  private async handleVehicleCreated(event: BusinessEvent) {
    console.log('[WorkflowEngine] Vehicle Created Workflow triggered', event.payload);
    // Trigger Document Request, Initial Compliance Checks, etc.
  }

  private async handleVehicleUpdated(event: BusinessEvent) {
    console.log('[WorkflowEngine] Vehicle Updated Workflow triggered', event.payload);
    // Re-verify compliance
  }

  private async handleTripCreated(event: BusinessEvent) {
    console.log('[WorkflowEngine] Trip Created Workflow triggered', event.payload);
    // AI Validation, Dispatcher Alerts
  }

  private async handleTripCompleted(event: BusinessEvent) {
    console.log('[WorkflowEngine] Trip Completed Workflow triggered', event.payload);
    
    // Publish secondary events
    await eventBus.publish(
      eventBus.createEvent(
        'driver.available',
        'WorkflowEngine',
        'system',
        { driverId: event.payload.driverId },
        event.payload.driverId
      )
    );

    // Update vehicle mileage and potentially trigger maintenance
    const mileageLimitReached = event.payload.currentMileage > 10000; // Example metric
    if (mileageLimitReached) {
      await eventBus.publish(
        eventBus.createEvent(
          'maintenance.requested',
          'WorkflowEngine',
          'system',
          { vehicleId: event.payload.vehicleId, reason: 'Mileage threshold reached' },
          event.payload.vehicleId
        )
      );
    }
  }

  private async handleTripFailed(event: BusinessEvent) {
    console.log('[WorkflowEngine] Trip Failed Workflow triggered', event.payload);
    // Alerts to Fleet Manager, Driver Reassignment
  }

  private async handleMaintenanceRequested(event: BusinessEvent) {
    console.log('[WorkflowEngine] Maintenance Requested Workflow triggered', event.payload);
    // Lock vehicle, prevent trip assignments
    await eventBus.publish(
      eventBus.createEvent(
        'vehicle.status_changed',
        'WorkflowEngine',
        'system',
        { vehicleId: event.payload.vehicleId, status: 'maintenance' },
        event.payload.vehicleId
      )
    );
  }

  private async handleMaintenanceFinished(event: BusinessEvent) {
    console.log('[WorkflowEngine] Maintenance Finished Workflow triggered', event.payload);
    // Release vehicle to available
    await eventBus.publish(
      eventBus.createEvent(
        'vehicle.status_changed',
        'WorkflowEngine',
        'system',
        { vehicleId: event.payload.vehicleId, status: 'available' },
        event.payload.vehicleId
      )
    );
  }

  private async handleDriverAssigned(event: BusinessEvent) {
    console.log('[WorkflowEngine] Driver Assigned Workflow triggered', event.payload);
    // Update driver schedule, notify driver
  }

  private async handleDocumentUploaded(event: BusinessEvent) {
    console.log('[WorkflowEngine] Document Uploaded Workflow triggered', event.payload);
    // Trigger AI Extraction, update compliance status
  }
}

export const workflowEngine = WorkflowEngine.getInstance();
