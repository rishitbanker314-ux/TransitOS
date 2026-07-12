import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { Trip } from '../features/trips/types/trip.types';
import { Vehicle } from '../features/vehicles/types/vehicle.types';

export function DashboardPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingTrips, setLoadingTrips] = useState(true);

  useEffect(() => {
    const unsubVehicles = onSnapshot(query(collection(db, 'vehicles')), (snap) => {
      setVehicles(snap.docs.map(d => ({ id: d.id, ...d.data() } as Vehicle)));
      setLoadingVehicles(false);
    });

    const unsubTrips = onSnapshot(query(collection(db, 'trips')), (snap) => {
      setTrips(snap.docs.map(d => ({ id: d.id, ...d.data() } as Trip)));
      setLoadingTrips(false);
    });

    return () => {
      unsubVehicles();
      unsubTrips();
    };
  }, []);

  // Computed KPIs
  const available = vehicles.filter(v => v.status === 'Available').length;
  const onTrip = vehicles.filter(v => v.status === 'On Trip').length;
  const inShop = vehicles.filter(v => v.status === 'In Shop').length;
  const totalVehicles = vehicles.length;

  const activeTrips = trips.filter(t => t.status === 'InProgress' || t.status === 'Assigned').length;
  const pendingTrips = trips.filter(t => t.status === 'Draft').length;

  const utilization = totalVehicles > 0 ? Math.round((onTrip / totalVehicles) * 100) : 0;

  const recentTrips = [...trips]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  function getStatusStyle(status: string) {
    switch (status) {
      case 'InProgress': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'Assigned': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'Completed': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'Draft': return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
      case 'Cancelled': return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  }

  const isLoading = loadingVehicles || loadingTrips;

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 border-b border-[#333] pb-2">1. Dashboard</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        {[
          { title: 'TOTAL VEHICLES', val: isLoading ? '—' : String(totalVehicles) },
          { title: 'AVAILABLE VEHICLES', val: isLoading ? '—' : String(available) },
          { title: 'VEHICLES IN SHOP', val: isLoading ? '—' : String(inShop), border: 'border-amber-500' },
          { title: 'ACTIVE TRIPS', val: isLoading ? '—' : String(activeTrips), border: 'border-blue-500' },
          { title: 'PENDING TRIPS', val: isLoading ? '—' : String(pendingTrips) },
          { title: 'FLEET UTILIZATION', val: isLoading ? '—' : `${utilization}%`, border: utilization > 50 ? 'border-green-500' : 'border-[#333]' },
        ].map((kpi, i) => (
          <div key={i} className={`bg-[#1a1a1a] border ${kpi.border || 'border-[#333]'} p-4 rounded-sm flex flex-col justify-center`}>
            <div className="text-[10px] uppercase text-[#666] tracking-wider mb-1">{kpi.title}</div>
            <div className={`text-3xl font-bold ${isLoading ? 'text-[#444] animate-pulse' : 'text-white'}`}>{kpi.val}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-8">
        {/* Recent Trips */}
        <div className="flex-1">
          <h3 className="text-xl text-[#aaa] mb-4 uppercase tracking-wider">Recent Trips</h3>
          {loadingTrips ? (
            <div className="text-[#888] animate-pulse">Loading trips...</div>
          ) : recentTrips.length === 0 ? (
            <div className="text-[#666] py-6 text-center border border-[#222] rounded-lg">No trips yet.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[#666] text-sm uppercase">
                  <th className="py-2">Trip</th>
                  <th className="py-2">Route</th>
                  <th className="py-2">Vehicle</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTrips.map(t => (
                  <tr key={t.id} className="border-t border-[#222]">
                    <td className="py-3 font-mono text-[#888] text-xs">{t.id.slice(0, 8)}</td>
                    <td className="py-3 font-semibold text-sm">{t.title}</td>
                    <td className="py-3 text-[#aaa] text-sm">{t.vehicleId ? t.vehicleId.slice(0, 8) : '—'}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${getStatusStyle(t.status)}`}>{t.status}</span>
                    </td>
                    <td className="py-3 text-[#666] text-xs">{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Vehicle Status Chart */}
        <div className="w-1/3">
          <h3 className="text-xl text-[#aaa] mb-4 uppercase tracking-wider">Vehicle Status</h3>
          {loadingVehicles ? (
            <div className="text-[#888] animate-pulse">Loading...</div>
          ) : (
            <div className="space-y-4">
              {[
                { label: 'Available', count: available, total: totalVehicles, color: 'bg-green-500' },
                { label: 'On Trip', count: onTrip, total: totalVehicles, color: 'bg-blue-500' },
                { label: 'In Shop', count: inShop, total: totalVehicles, color: 'bg-amber-500' },
              ].map(({ label, count, total, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="w-24 text-sm">{label}</span>
                  <div className="flex-1 bg-[#222] h-4 mx-4 rounded overflow-hidden">
                    <div
                      className={`${color} h-full transition-all duration-700`}
                      style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-[#666] text-sm w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
