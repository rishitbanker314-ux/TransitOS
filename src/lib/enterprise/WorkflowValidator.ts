export class WorkflowValidator {
  
  /**
   * Validates if a vehicle can be dispatched on a trip.
   */
  public static canDispatchVehicle(vehicleStatus: string, complianceStatus: string, maintenanceLock: boolean): boolean {
    if (maintenanceLock) {
      console.warn('[WorkflowValidator] Cannot dispatch: Vehicle is locked for maintenance');
      return false;
    }
    
    if (vehicleStatus !== 'available') {
      console.warn(`[WorkflowValidator] Cannot dispatch: Vehicle status is ${vehicleStatus}`);
      return false;
    }

    if (complianceStatus !== 'compliant') {
      console.warn(`[WorkflowValidator] Cannot dispatch: Vehicle compliance is ${complianceStatus}`);
      return false;
    }

    return true;
  }

  /**
   * Validates if a driver can be assigned to a trip.
   */
  public static canAssignDriver(driverStatus: string, hasValidLicense: boolean, currentHoursWorked: number): boolean {
    if (driverStatus !== 'available') {
      console.warn(`[WorkflowValidator] Cannot assign: Driver status is ${driverStatus}`);
      return false;
    }

    if (!hasValidLicense) {
      console.warn('[WorkflowValidator] Cannot assign: Driver has invalid or expired license');
      return false;
    }

    if (currentHoursWorked > 12) { // Example DOT compliance limit
      console.warn(`[WorkflowValidator] Cannot assign: Driver exceeds daily hours limit (${currentHoursWorked}h)`);
      return false;
    }

    return true;
  }

  /**
   * Validates if maintenance can be started.
   */
  public static canStartMaintenance(vehicleStatus: string): boolean {
    // Cannot start maintenance if the vehicle is currently on a trip
    if (vehicleStatus === 'in_trip' || vehicleStatus === 'dispatched') {
      console.warn(`[WorkflowValidator] Cannot start maintenance: Vehicle is currently ${vehicleStatus}`);
      return false;
    }
    return true;
  }
}
