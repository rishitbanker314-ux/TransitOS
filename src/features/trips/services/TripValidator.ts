import { Trip } from '../types/trip.types';
import { VehicleRepository } from '../../vehicles/repositories/vehicle.repository';

export class TripValidator {
  private vehicleRepo = new VehicleRepository();

  /**
   * Validates if a vehicle can be assigned to a trip.
   */
  async validateVehicleAssignment(vehicleId: string): Promise<void> {
    const vehicle = await this.vehicleRepo.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found.');
    }

    // Check Status
    if (['Retired', 'Disposed', 'UnderMaintenance', 'OnTrip'].includes(vehicle.status)) {
      throw new Error(`Cannot dispatch vehicle. Current status is ${vehicle.status}.`);
    }

    // Check Compliance
    if (vehicle.insuranceExpiry) {
      const expiry = new Date(vehicle.insuranceExpiry);
      if (expiry < new Date()) {
        throw new Error('Cannot dispatch: Vehicle insurance has expired.');
      }
    }
  }

  /**
   * Validates if a driver can be assigned.
   */
  async validateDriverAssignment(driverId: string, trip: Trip): Promise<void> {
    // In a real app, query the driver collection and active trips
    // For now, assume this always passes unless driver is missing
    if (!driverId) {
      throw new Error('Driver ID is required.');
    }
  }
}
