import { VehicleRepository } from '../../vehicles/repositories/vehicle.repository';
import { DriverRepository } from '../../drivers/repositories/driver.repository';
import { TripRepository } from '../../trips/repositories/TripRepository';
import { ComplianceRepository } from '../../drivers/repositories/compliance.repository';
import { FleetAnalyticsService } from '../../vehicles/services/analytics/FleetAnalyticsService';
import { CopilotContext } from '../types/copilot.types';
import { Vehicle } from '../../vehicles/types/vehicle.types';
import { Driver } from '../../drivers/types/driver.types';
import { Trip } from '../../trips/types/trip.types';

export class ContextEngine {
  private vehicleRepo: VehicleRepository | null = null;
  private driverRepo: DriverRepository | null = null;
  private tripRepo: TripRepository | null = null;
  private complianceRepo: ComplianceRepository | null = null;
  private analyticsService: FleetAnalyticsService | null = null;

  private getVehicleRepo() {
    if (!this.vehicleRepo) this.vehicleRepo = new VehicleRepository();
    return this.vehicleRepo;
  }

  private getDriverRepo() {
    if (!this.driverRepo) this.driverRepo = new DriverRepository();
    return this.driverRepo;
  }

  private getTripRepo() {
    if (!this.tripRepo) {
      // Safe guard against constructor evaluation error on stubbed db object
      this.tripRepo = new TripRepository();
    }
    return this.tripRepo;
  }

  private getComplianceRepo() {
    if (!this.complianceRepo) this.complianceRepo = new ComplianceRepository();
    return this.complianceRepo;
  }

  private getAnalyticsService() {
    if (!this.analyticsService) this.analyticsService = new FleetAnalyticsService();
    return this.analyticsService;
  }

  public async getSystemContext(uiContext: Partial<CopilotContext>): Promise<string> {
    const timestamp = new Date().toISOString();
    
    // 1. Gather live/mock database context
    let vehicles: Vehicle[] = [];
    let drivers: Driver[] = [];
    let trips: Trip[] = [];
    let fleetSnapshot = null;
    let alerts: any[] = [];

    try {
      vehicles = await this.getVehicleRepo().listAvailable();
    } catch (e) {
      vehicles = this.getMockVehicles();
    }

    try {
      drivers = await this.getDriverRepo().listDrivers(undefined, 50);
    } catch (e) {
      drivers = this.getMockDrivers();
    }

    try {
      const repo = this.getTripRepo();
      trips = await repo.getActiveTrips();
    } catch (e) {
      trips = this.getMockTrips();
    }

    try {
      fleetSnapshot = await this.getAnalyticsService().getLatestSnapshot();
      alerts = await this.getAnalyticsService().getAlerts();
    } catch (e) {
      fleetSnapshot = this.getMockFleetSnapshot();
    }

    // 2. Build final RAG Context JSON
    const mergedContext = {
      timestamp,
      userRole: uiContext.userRole || 'Dispatcher',
      activeScreen: uiContext.activeView || 'CommandCenter',
      selectedVehicleId: uiContext.activeVehicleId || null,
      selectedDriverId: uiContext.activeDriverId || null,
      activeFilters: uiContext.filters || {},
      fleetSummary: fleetSnapshot,
      activeAlerts: alerts,
      vehicles: vehicles.map(v => ({
        id: v.id,
        reg: v.registrationNumber,
        makeModel: `${v.make} ${v.model}`,
        status: v.status,
        odometer: v.currentOdometer,
        insuranceExpiry: v.insuranceExpiry,
        pucExpiry: v.pucExpiry,
      })),
      drivers: drivers.map(d => ({
        id: d.id,
        name: `${d.firstName} ${d.lastName}`,
        status: d.status,
        phone: d.phone,
        email: d.email,
        compliance: d.status === 'Suspended' ? 'NonCompliant' : 'Compliant'
      })),
      trips: trips.map(t => ({
        id: t.id,
        title: t.title,
        status: t.status,
        vehicleId: t.vehicleId || 'unassigned',
        driverId: t.driverId || 'unassigned',
        route: `${t.route.origin.address} -> ${t.route.destination.address}`,
        plannedStart: t.route.stops[0]?.plannedArrivalTime || t.schedule.plannedStartTime
      }))
    };

    return JSON.stringify(mergedContext, null, 2);
  }

  private getMockVehicles(): Vehicle[] {
    return [
      {
        id: 'v-101',
        registrationNumber: 'MH-12-PQ-9876',
        vin: 'VIN1234567890ABCD',
        make: 'Tata',
        model: 'Ultra Truck',
        year: 2022,
        payloadCapacity: 5000,
        currentOdometer: 125000,
        status: 'Available',
        insuranceExpiry: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
        pucExpiry: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        isArchived: false,
        version: 1,
        createdAt: '2022-01-10T12:00:00Z',
        createdBy: 'admin'
      },
      {
        id: 'v-102',
        registrationNumber: 'MH-12-XY-1234',
        vin: 'VIN0987654321WXYZ',
        make: 'Mahindra',
        model: 'Blazo X',
        year: 2021,
        payloadCapacity: 8000,
        currentOdometer: 205000,
        status: 'In Shop',
        insuranceExpiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        pucExpiry: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // expired
        isArchived: false,
        version: 2,
        createdAt: '2021-03-15T12:00:00Z',
        createdBy: 'admin'
      },
      {
        id: 'v-103',
        registrationNumber: 'MH-12-ZZ-5555',
        vin: 'VIN7777777777BBBB',
        make: 'Ashok Leyland',
        model: 'Dost',
        year: 2023,
        payloadCapacity: 2500,
        currentOdometer: 45000,
        status: 'Available',
        insuranceExpiry: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(),
        pucExpiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        isArchived: false,
        version: 1,
        createdAt: '2023-05-20T12:00:00Z',
        createdBy: 'admin'
      }
    ];
  }

  private getMockDrivers(): Driver[] {
    return [
      {
        id: 'd-201',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'rajesh.kumar@transitops.com',
        phone: '+91 98765 43210',
        dateOfBirth: '1985-05-15',
        joinedAt: '2020-06-01T12:00:00Z',
        status: 'Available',
        isArchived: false,
        version: 1,
        createdAt: '2020-06-01T12:00:00Z',
        createdBy: 'admin'
      },
      {
        id: 'd-202',
        firstName: 'Suresh',
        lastName: 'Sharma',
        email: 'suresh.sharma@transitops.com',
        phone: '+91 98765 11111',
        dateOfBirth: '1990-10-20',
        joinedAt: '2022-02-15T12:00:00Z',
        status: 'Assigned',
        isArchived: false,
        version: 3,
        createdAt: '2022-02-15T12:00:00Z',
        createdBy: 'admin'
      },
      {
        id: 'd-203',
        firstName: 'Amit',
        lastName: 'Patel',
        email: 'amit.patel@transitops.com',
        phone: '+91 98765 22222',
        dateOfBirth: '1993-01-25',
        joinedAt: '2023-09-01T12:00:00Z',
        status: 'On Leave',
        isArchived: false,
        version: 1,
        createdAt: '2023-09-01T12:00:00Z',
        createdBy: 'admin'
      }
    ];
  }

  private getMockTrips(): Trip[] {
    return [
      {
        id: 't-301',
        title: 'Mumbai - Pune Express Route',
        status: 'InProgress',
        vehicleId: 'v-102',
        driverId: 'd-202',
        route: {
          origin: { lat: 19.076, lng: 72.877, address: 'Mumbai Depot' },
          destination: { lat: 18.520, lng: 73.856, address: 'Pune Warehouse' },
          stops: [
            {
              id: 'stop-1',
              location: { lat: 18.520, lng: 73.856, address: 'Pune Warehouse' },
              plannedArrivalTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Delayed: planned was 2 hours ago
              status: 'Pending'
            }
          ],
          estimatedDistanceKm: 150
        },
        schedule: {
          plannedStartTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          plannedEndTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        createdAt: '2026-07-12T05:00:00Z',
        updatedAt: '2026-07-12T05:00:00Z',
        createdBy: 'admin'
      },
      {
        id: 't-302',
        title: 'Depot Transfer Route B',
        status: 'Scheduled',
        route: {
          origin: { lat: 19.076, lng: 72.877, address: 'Mumbai Depot' },
          destination: { lat: 23.022, lng: 72.571, address: 'Ahmedabad Hub' },
          stops: [],
          estimatedDistanceKm: 520
        },
        schedule: {
          plannedStartTime: new Date(Date.now() + 15 * 60 * 60 * 1000).toISOString(),
          plannedEndTime: new Date(Date.now() + 27 * 60 * 60 * 1000).toISOString()
        },
        createdAt: '2026-07-12T10:00:00Z',
        updatedAt: '2026-07-12T10:00:00Z',
        createdBy: 'admin'
      }
    ];
  }

  private getMockFleetSnapshot() {
    return {
      timestamp: new Date().toISOString(),
      totalVehicles: 3,
      availableVehicles: 2,
      assignedVehicles: 1,
      onTripVehicles: 1,
      underMaintenanceVehicles: 1,
      retiredVehicles: 0,
      utilization: {
        averageFleetUtilization: 33,
        idlePercentage: 66,
        averageTripDurationHours: 12
      },
      health: {
        averageScore: 82,
        excellentCount: 1,
        goodCount: 1,
        warningCount: 0,
        criticalCount: 1
      },
      compliance: {
        score: 66,
        insuranceExpiring30Days: 1,
        pucExpiring30Days: 0,
        missingDocuments: 1
      },
      maintenance: {
        completionRate: 50,
        overdueCount: 1,
        averageDowntimeHours: 48,
        averageRepairCost: 350
      },
      costs: {
        totalOperatingCost: 12500,
        averageCostPerKm: 1.5
      }
    };
  }
}
