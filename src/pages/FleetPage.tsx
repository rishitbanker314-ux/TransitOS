import React, { useEffect, useState } from 'react';
import { VehicleRepository } from '../features/vehicles/repositories/vehicle.repository';
import { Vehicle } from '../features/vehicles/types/vehicle.types';

export function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [regNo, setRegNo] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<'Truck' | 'Van' | 'Mini'>('Van');
  const [capacity, setCapacity] = useState(0);
  const [acquisitionCost, setAcquisitionCost] = useState(0);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const repository = new VehicleRepository();

  useEffect(() => {
    const unsubscribe = repository.subscribeToAll((data) => {
      setVehicles(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormError('');
      setFormLoading(true);
      
      await repository.add({
        registrationNumber: regNo,
        name,
        type,
        capacity,
        odometerReading: 0,
        currentOdometer: 0,
        acquisitionCost,
        status: 'Available',
        isArchived: false,
        version: 1,
        specifications: {
          fuelType: 'Diesel',
          transmission: 'Manual',
          year: new Date().getFullYear()
        }
      });
      
      setIsModalOpen(false);
      // Reset form
      setRegNo('');
      setName('');
      setCapacity(0);
      setAcquisitionCost(0);
    } catch (err: any) {
      setFormError(err.message || 'Failed to add vehicle');
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'On Trip': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'In Shop': return 'bg-amber-500/20 text-amber-500 border border-amber-500/30';
      case 'Retired': return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
    }
  };

  return (
    <div className="relative h-full w-full">
      <h2 className="text-3xl font-bold text-white mb-6 border-b border-[#333] pb-2">2. Vehicle Registry</h2>
      
      <div className="flex justify-between items-center mb-6 text-[#aaa]">
        <div className="flex space-x-4">
          <select className="bg-[#1a1a1a] border border-[#333] px-3 py-1 rounded focus:outline-none focus:border-amber-500">
            <option>Type: All</option>
          </select>
          <select className="bg-[#1a1a1a] border border-[#333] px-3 py-1 rounded focus:outline-none focus:border-amber-500">
            <option>Status: All</option>
          </select>
          <input type="text" placeholder="Search reg no..." className="bg-[#1a1a1a] border border-[#333] px-3 py-1 rounded focus:outline-none focus:border-amber-500" />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-600 text-black px-4 py-1.5 rounded font-bold hover:bg-amber-500 transition-colors"
        >
          + Add Vehicle
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#888]">Loading vehicles from Firebase...</div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-12 text-[#888]">No vehicles found. Add one to get started!</div>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[#666] text-sm uppercase tracking-wider">
              <th className="py-2">Reg. No. (Unique)</th>
              <th className="py-2">Name/Model</th>
              <th className="py-2">Type</th>
              <th className="py-2">Capacity</th>
              <th className="py-2">Odometer</th>
              <th className="py-2">Acq. Cost</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id} className="border-t border-[#222]">
                <td className="py-4 font-mono">{v.registrationNumber}</td>
                <td className="py-4 font-semibold">{v.name}</td>
                <td className="py-4">{v.type}</td>
                <td className="py-4">{v.capacity} kg</td>
                <td className="py-4">{v.odometerReading?.toLocaleString() || 0}</td>
                <td className="py-4 text-[#aaa]">₹{v.acquisitionCost?.toLocaleString() || 0}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded text-sm ${getStatusColor(v.status)}`}>{v.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-[#333] p-8 rounded-lg max-w-md w-full text-[#ccc]">
            <h3 className="text-2xl font-bold text-white mb-6">Add New Vehicle</h3>
            
            {formError && <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-sm border border-red-500/50">{formError}</div>}
            
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 uppercase tracking-wider text-[#888]">Registration Number</label>
                <input required value={regNo} onChange={(e) => setRegNo(e.target.value.toUpperCase())} type="text" placeholder="GJ01AB1234" className="w-full bg-[#1a1a1a] border border-[#333] rounded-md p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              
              <div>
                <label className="block text-sm mb-1 uppercase tracking-wider text-[#888]">Vehicle Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="TRUCK-01" className="w-full bg-[#1a1a1a] border border-[#333] rounded-md p-2 focus:border-amber-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm mb-1 uppercase tracking-wider text-[#888]">Type</label>
                <select required value={type} onChange={(e) => setType(e.target.value as any)} className="w-full bg-[#1a1a1a] border border-[#333] rounded-md p-2 focus:border-amber-500 focus:outline-none text-[#ccc]">
                  <option value="Van">Van</option>
                  <option value="Mini">Mini Truck</option>
                  <option value="Truck">Heavy Truck</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-sm mb-1 uppercase tracking-wider text-[#888]">Capacity (kg)</label>
                  <input required value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} type="number" min="0" className="w-full bg-[#1a1a1a] border border-[#333] rounded-md p-2 focus:border-amber-500 focus:outline-none" />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm mb-1 uppercase tracking-wider text-[#888]">Acq. Cost (₹)</label>
                  <input required value={acquisitionCost} onChange={(e) => setAcquisitionCost(Number(e.target.value))} type="number" min="0" className="w-full bg-[#1a1a1a] border border-[#333] rounded-md p-2 focus:border-amber-500 focus:outline-none" />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/2 bg-transparent border border-[#333] text-white py-2 rounded hover:bg-[#222] transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={formLoading} className="w-1/2 bg-amber-600 text-black font-bold py-2 rounded hover:bg-amber-500 transition-colors disabled:opacity-50">
                  {formLoading ? 'Saving...' : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
