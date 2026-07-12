import { VehicleState } from '../../vehicles/services/status-engine/statusTypes';

export const generateSeedData = () => {
  // Generate 150 vehicles
  const vehicles = Array.from({ length: 150 }).map((_, i) => ({
    id: `VH-${1000 + i}`,
    name: `Transit Van ${i + 1}`,
    vin: `1FDXE4FPOHK${80000 + i}`,
    manufacturer: i % 3 === 0 ? 'Ford' : i % 3 === 1 ? 'Mercedes' : 'RAM',
    model: 'Transit 250',
    type: 'Cargo Van',
    fuelType: i % 5 === 0 ? 'Electric' : 'Gasoline',
    status: (i === 12 ? 'UnderMaintenance' : i === 42 ? 'OnTrip' : 'Available') as VehicleState,
    odometer: 15000 + (i * 1234) % 80000,
  }));

  // Target specific vehicles for our scenarios
  const problemVehicle = vehicles[12];
  const agingVehicle = vehicles[88]; // High odometer
  agingVehicle.odometer = 98500;

  // Active trips
  const activeTrips = [
    {
      id: 'TRP-991',
      vehicleId: 'VH-1042',
      driverId: 'DRV-102',
      status: 'InProgress',
      route: 'Downtown -> Warehouse B',
      progress: 45,
      eta: new Date(Date.now() + 25 * 60000).toISOString()
    }
  ];

  // Scenarios
  const scenarios = [
    {
      id: 's1',
      title: 'Scenario 1: Vehicle breakdown during active trip',
      description: 'A vehicle currently on a trip experiences a critical engine fault. The AI instantly recommends a replacement vehicle nearby.',
    },
    {
      id: 's2',
      title: 'Scenario 2: Insurance expires tomorrow',
      description: 'A high-priority compliance alert triggers, preventing dispatch of a specific vehicle.',
    },
    {
      id: 's3',
      title: 'Scenario 4: Maintenance Blocks Dispatch',
      description: 'An approved maintenance schedule immediately pulls a vehicle from the Available pool.',
    },
    {
      id: 's4',
      title: 'Scenario 5: AI recommends replacing aging vehicle',
      description: 'The Predictive AI highlights an aging vehicle with a 92% failure probability in the next 14 days.',
    }
  ];

  return { vehicles, activeTrips, scenarios, problemVehicle, agingVehicle };
};

export const DEMO_DATA = generateSeedData();
