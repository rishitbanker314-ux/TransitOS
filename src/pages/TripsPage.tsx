import React, { useState, useEffect } from 'react';
import { TripRepository } from '../features/trips/repositories/TripRepository';
import { VehicleRepository } from '../features/vehicles/repositories/vehicle.repository';
import { Trip } from '../features/trips/types/trip.types';
import { Vehicle } from '../features/vehicles/types/vehicle.types';

const tripRepo = new TripRepository();
const vehicleRepo = new VehicleRepository();

export function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [source, setSource] = useState('Gandhinagar Depot');
  const [destination, setDestination] = useState('Ahmedabad Hub');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [cargoWeight, setCargoWeight] = useState('');
  const [plannedDistance, setPlannedDistance] = useState('');

  // Validate cargo weight
  const vehicle = availableVehicles.find(v => v.id === selectedVehicle);
  const vCapacity = vehicle?.capacity || 0;
  const isOverweight = cargoWeight ? Number(cargoWeight) > vCapacity : false;

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const vehicles = await vehicleRepo.listAvailable();
        setAvailableVehicles(vehicles);
      } catch (err) {
        console.error('Failed to fetch available vehicles', err);
      }
    };
    fetchVehicles();

    const unsubscribe = tripRepo.subscribeToActiveTrips((updatedTrips) => {
      setTrips(updatedTrips);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOverweight || !selectedVehicle) return;

    setSaving(true);
    try {
      const newTripData = {
        title: `${source} to ${destination}`,
        route: {
          origin: { lat: 0, lng: 0, address: source },
          destination: { lat: 0, lng: 0, address: destination },
          stops: [],
          estimatedDistanceKm: Number(plannedDistance)
        },
        schedule: {
          plannedStartTime: new Date().toISOString(),
          plannedEndTime: new Date(Date.now() + 3600000).toISOString()
        },
        createdBy: 'admin'
      };

      const createdTrip = await tripRepo.create(newTripData, 'admin');
      await tripRepo.assign(createdTrip.id, selectedVehicle, 'driver-alex');
      await vehicleRepo.updateStatus(selectedVehicle, 'On Trip');

      // Refresh available vehicles since one was dispatched
      const updatedVehicles = await vehicleRepo.listAvailable();
      setAvailableVehicles(updatedVehicles);
      
      setSelectedVehicle('');
      setCargoWeight('');
      setPlannedDistance('');
    } catch (err) {
      console.error('Failed to dispatch trip', err);
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async (tripId: string, vehicleId?: string) => {
    try {
      await tripRepo.updateStatus(tripId, 'Completed');
      if (vehicleId) {
        await vehicleRepo.updateStatus(vehicleId, 'Available');
        const updatedVehicles = await vehicleRepo.listAvailable();
        setAvailableVehicles(updatedVehicles);
      }
    } catch (err) {
      console.error('Failed to complete trip', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'Assigned': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'InProgress': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Cancelled': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 border-b border-[#333] pb-2">4. Trip Dispatcher</h2>

      <div className="flex gap-12">
        {/* CREATE TRIP FORM */}
        <div className="w-1/3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[#666] uppercase tracking-wider text-sm">TRIP LIFECYCLE</h3>
          </div>
          <div className="flex space-x-2 mb-8 text-sm">
            <span className="text-green-500 font-bold">Draft</span>
            <span className="text-[#444]">→</span>
            <span className="text-blue-500">Dispatched</span>
            <span className="text-[#444]">→</span>
            <span className="text-green-500">Completed</span>
            <span className="text-[#444]">→</span>
            <span className="text-gray-500">Cancelled</span>
          </div>

          <h3 className="text-[#666] uppercase tracking-wider text-sm mb-4">CREATE TRIP</h3>
          <form className="space-y-4" onSubmit={handleDispatch}>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Source</label>
              <input 
                type="text" 
                value={source} 
                onChange={(e) => setSource(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none transition-colors" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Destination</label>
              <input 
                type="text" 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none transition-colors" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Vehicle (Available only)</label>
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none transition-colors"
              >
                <option value="">Select a vehicle</option>
                {availableVehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.registrationNumber} - {v.capacity || 0} kg</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Cargo Weight (kg)</label>
              <input 
                type="number" 
                value={cargoWeight} 
                onChange={(e) => setCargoWeight(e.target.value)}
                required
                placeholder="e.g. 500"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none transition-colors" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Planned Distance (km)</label>
              <input 
                type="number" 
                value={plannedDistance} 
                onChange={(e) => setPlannedDistance(e.target.value)}
                required
                placeholder="e.g. 38"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none transition-colors" 
              />
            </div>

            {selectedVehicle && cargoWeight && (
              <div className={`border rounded p-3 text-sm ${isOverweight ? 'border-rose-500/50 bg-rose-500/10 text-rose-400' : 'border-green-500/50 bg-green-500/10 text-green-400'}`}>
                <p>Vehicle Capacity: {vCapacity} kg</p>
                <p>Cargo Weight: {cargoWeight} kg</p>
                {isOverweight ? (
                  <p className="font-bold text-rose-500 mt-1">X Capacity exceeded - dispatch blocked</p>
                ) : (
                  <p className="font-bold text-green-500 mt-1">✓ Weight within limits</p>
                )}
              </div>
            )}

            <div className="flex space-x-4 pt-2">
              <button 
                type="submit"
                disabled={saving || isOverweight || !selectedVehicle} 
                className="flex-1 bg-amber-600 text-black py-2 rounded font-bold hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Dispatching...' : 'Dispatch'}
              </button>
            </div>
          </form>
        </div>

        {/* LIVE BOARD */}
        <div className="w-2/3">
          <h3 className="text-[#666] uppercase tracking-wider text-sm mb-6">LIVE BOARD</h3>
          
          {loading ? (
            <div className="text-[#888] py-8 text-center animate-pulse">Loading live board...</div>
          ) : trips.length === 0 ? (
            <div className="text-[#888] py-8 text-center bg-[#111] rounded-lg border border-[#222]">No active trips found.</div>
          ) : (
            <div className="space-y-4">
              {trips.map(trip => (
                <div key={trip.id} className="bg-[#111] border border-[#222] rounded-lg p-4 hover:border-[#444] transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-mono text-[#aaa] text-xs mb-1">{trip.id}</div>
                      <div className={`font-bold text-lg ${trip.status === 'Cancelled' ? 'text-[#666] line-through' : 'text-white'}`}>
                        {trip.title}
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <div className="text-amber-500 font-mono text-sm">
                        {trip.vehicleId ? trip.vehicleId.slice(0,8) : 'Unassigned'} / {trip.driverId ? trip.driverId.split('-')[1].toUpperCase() : ''}
                      </div>
                      <div className="text-[#666] text-sm mt-1">{trip.route.estimatedDistanceKm} km</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <span className={`inline-block px-3 py-1 border rounded text-sm ${getStatusColor(trip.status)}`}>
                      {trip.status}
                    </span>
                    {(trip.status === 'Assigned' || trip.status === 'InProgress') && (
                      <button 
                        onClick={() => handleComplete(trip.id, trip.vehicleId)}
                        className="text-sm bg-green-600/20 text-green-400 hover:bg-green-600/30 px-3 py-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Complete Trip
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-[#666] text-sm italic border-t border-[#222] pt-4">
            On Complete: odometer -&gt; fuel log -&gt; expenses -&gt; Vehicle &amp; Driver Available
          </div>
        </div>
      </div>
    </div>
  );
}
