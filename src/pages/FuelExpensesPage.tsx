import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, addDoc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { VehicleRepository } from '../features/vehicles/repositories/vehicle.repository';
import { Vehicle } from '../features/vehicles/types/vehicle.types';

const vehicleRepo = new VehicleRepository();

interface FuelLog {
  id: string;
  vehicleId: string;
  vehicleName: string;
  date: string;
  liters: number;
  costPerLiter: number;
  totalCost: number;
  createdAt: string;
}

export function FuelExpensesPage() {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [liters, setLiters] = useState('');
  const [costPerLiter, setCostPerLiter] = useState('75');

  const totalCostPreview = liters && costPerLiter ? (Number(liters) * Number(costPerLiter)).toFixed(0) : '0';

  useEffect(() => {
    vehicleRepo.getAll().then(setVehicles);

    const unsubscribe = onSnapshot(
      query(collection(db, 'fuel_logs'), orderBy('createdAt', 'desc')),
      (snap) => {
        setFuelLogs(snap.docs.map(d => ({ id: d.id, ...d.data() } as FuelLog)));
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle || !liters) return;

    setSaving(true);
    try {
      const vehicle = vehicles.find(v => v.id === selectedVehicle);
      const vName = vehicle?.registrationNumber || selectedVehicle;

      await addDoc(collection(db, 'fuel_logs'), {
        vehicleId: selectedVehicle,
        vehicleName: vName,
        date,
        liters: Number(liters),
        costPerLiter: Number(costPerLiter),
        totalCost: Number(liters) * Number(costPerLiter),
        createdAt: new Date().toISOString(),
      });

      setShowForm(false);
      setSelectedVehicle('');
      setLiters('');
    } catch (err) {
      console.error('Failed to log fuel', err);
    } finally {
      setSaving(false);
    }
  };

  const totalFuelCost = fuelLogs.reduce((sum, log) => sum + (log.totalCost || 0), 0);

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 border-b border-[#333] pb-2">6. Fuel & Expense Management</h2>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[#666] uppercase tracking-wider text-sm">FUEL LOGS</h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-amber-600 text-black px-4 py-1.5 rounded font-bold hover:bg-amber-500 transition-colors"
          >
            {showForm ? 'Cancel' : '+ Log Fuel'}
          </button>
        </div>

        {/* Fuel Log Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-[#111] border border-[#333] rounded-lg p-6 mb-6">
            <h4 className="text-[#aaa] uppercase tracking-wider text-xs mb-4">Log Fuel Fill-Up</h4>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-xs uppercase text-[#666] mb-1">Vehicle</label>
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  required
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="">Select vehicle</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.registrationNumber}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase text-[#666] mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-[#666] mb-1">Liters</label>
                <input
                  type="number"
                  value={liters}
                  onChange={(e) => setLiters(e.target.value)}
                  required
                  placeholder="e.g. 42"
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-[#666] mb-1">Cost / Liter (₹)</label>
                <input
                  type="number"
                  value={costPerLiter}
                  onChange={(e) => setCostPerLiter(e.target.value)}
                  required
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-[#aaa] text-sm">
                Total: <span className="text-amber-500 font-bold text-lg">₹{Number(totalCostPreview).toLocaleString()}</span>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="bg-amber-600 text-black px-6 py-2 rounded font-bold hover:bg-amber-500 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : 'Save Fuel Log'}
              </button>
            </div>
          </form>
        )}

        {/* Fuel Logs Table */}
        {loading ? (
          <div className="text-[#888] animate-pulse py-4">Loading fuel logs...</div>
        ) : fuelLogs.length === 0 ? (
          <div className="text-[#666] py-6 text-center border border-[#222] rounded-lg">No fuel logs yet. Log your first fill-up!</div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-[#222]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#111]">
                <tr className="text-[#666] text-sm uppercase tracking-wider">
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Liters</th>
                  <th className="py-3 px-4">Rate/L</th>
                  <th className="py-3 px-4 text-right">Total Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {fuelLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="py-3 px-4 font-semibold">{log.vehicleName || log.vehicleId}</td>
                    <td className="py-3 px-4 text-[#aaa]">{new Date(log.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="py-3 px-4">{log.liters} L</td>
                    <td className="py-3 px-4 text-[#aaa]">₹{log.costPerLiter}</td>
                    <td className="py-3 px-4 text-right font-semibold">₹{(log.totalCost || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#555]">
                  <td colSpan={4} className="py-4 px-4 uppercase text-[#aaa] tracking-widest text-sm font-bold">Total Fuel Cost</td>
                  <td className="py-4 px-4 text-right text-rose-400 font-bold text-lg">₹{totalFuelCost.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
