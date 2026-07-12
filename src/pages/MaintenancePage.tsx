import React, { useState, useEffect } from 'react';
import { MaintenanceRepository } from '../features/maintenance/repositories/MaintenanceRepository';
import { VehicleRepository } from '../features/vehicles/repositories/vehicle.repository';
import { MaintenanceJob } from '../features/maintenance/types/maintenance.types';
import { Vehicle } from '../features/vehicles/types/vehicle.types';

const maintenanceRepo = new MaintenanceRepository();
const vehicleRepo = new VehicleRepository();

export function MaintenancePage() {
  const [jobs, setJobs] = useState<MaintenanceJob[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [serviceType, setServiceType] = useState('Oil Change');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const available = await vehicleRepo.getAll();
        // Just show all vehicles so they can be serviced
        setVehicles(available);
      } catch (err) {
        console.error('Failed to fetch vehicles', err);
      }
    };
    fetchVehicles();

    const unsubscribe = maintenanceRepo.subscribeToJobs((updatedJobs) => {
      setJobs(updatedJobs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle || !cost) return;

    setSaving(true);
    try {
      const jobId = crypto.randomUUID();
      const job: MaintenanceJob = {
        id: jobId,
        title: `Service - ${serviceType}`,
        vehicleId: selectedVehicle,
        type: serviceType as any,
        description: `Regular ${serviceType}`,
        status: 'InProgress',
        priority: 'Medium',
        scheduledDate: date,
        estimatedDurationHours: 4,
        partsUsed: [],
        createdAt: new Date().toISOString(),
        createdBy: 'admin',
      };
      
      await maintenanceRepo.createJob(job);
      await vehicleRepo.updateStatus(selectedVehicle, 'In Shop');

      setSelectedVehicle('');
      setCost('');
    } catch (err) {
      console.error('Failed to save maintenance record', err);
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async (jobId: string, vehicleId: string) => {
    try {
      await maintenanceRepo.updateStatus(jobId, 'Completed');
      await vehicleRepo.updateStatus(vehicleId, 'Available');
    } catch (err) {
      console.error('Failed to complete job', err);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 border-b border-[#333] pb-2">5. Maintenance</h2>

      <div className="flex gap-12">
        <div className="w-1/3">
          <h3 className="text-[#666] uppercase tracking-wider text-sm mb-6">LOG SERVICE RECORD</h3>
          <form className="space-y-4" onSubmit={handleSave}>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Vehicle</label>
              <select 
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none transition-colors"
              >
                <option value="">Select a vehicle</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.registrationNumber} - {v.type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Service Type</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none transition-colors"
              >
                <option value="Inspection">Inspection</option>
                <option value="Repair">Repair</option>
                <option value="Routine">Routine</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Estimated Cost</label>
              <input 
                type="number" 
                value={cost} 
                onChange={(e) => setCost(e.target.value)}
                required
                placeholder="e.g. 2500"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none transition-colors" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none transition-colors" 
              />
            </div>
            <button 
              type="submit" 
              disabled={saving}
              className="w-full bg-amber-600 text-black py-2 rounded font-bold hover:bg-amber-500 mt-4 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save & Send to Shop'}
            </button>
          </form>

          <div className="mt-8 flex justify-between items-center text-sm">
            <span className="text-green-500">Available</span>
            <span className="text-[#666]">------routing active board------&gt;</span>
            <span className="text-amber-500">In Shop</span>
          </div>
          <div className="mt-2 flex justify-between items-center text-sm">
            <span className="text-amber-500">In Shop</span>
            <span className="text-[#666]">------closing record set returns------&gt;</span>
            <span className="text-green-500">Available</span>
          </div>
          <div className="mt-4 text-amber-600 text-sm">
            Note: In Shop vehicles are removed from the dispatch pool.
          </div>
        </div>

        <div className="w-2/3">
          <h3 className="text-[#666] uppercase tracking-wider text-sm mb-6">SERVICE LOG</h3>
          {loading ? (
            <div className="text-[#888] py-8 text-center animate-pulse">Loading service logs...</div>
          ) : jobs.length === 0 ? (
            <div className="text-[#888] py-8 text-center bg-[#111] rounded-lg border border-[#222]">No service records found.</div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-[#222]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#111]">
                  <tr className="text-[#666] text-sm uppercase tracking-wider">
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222]">
                  {jobs.map(job => {
                    const vehicle = vehicles.find(v => v.id === job.vehicleId);
                    const vName = vehicle ? vehicle.registrationNumber : job.vehicleId;
                    return (
                      <tr key={job.id} className="hover:bg-[#1a1a1a] transition-colors group">
                        <td className="py-4 px-4 font-semibold">{vName}</td>
                        <td className="py-4 px-4 text-[#aaa]">{job.type}</td>
                        <td className="py-4 px-4 text-[#888]">{job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString() : 'N/A'}</td>
                        <td className="py-4 px-4 text-right">
                          {job.status === 'Completed' ? (
                            <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded text-sm">Completed</span>
                          ) : (
                            <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded text-sm">In Shop</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          {job.status !== 'Completed' && (
                            <button 
                              onClick={() => handleComplete(job.id, job.vehicleId)}
                              className="text-sm bg-green-600/20 text-green-400 hover:bg-green-600/30 px-3 py-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                            >
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

