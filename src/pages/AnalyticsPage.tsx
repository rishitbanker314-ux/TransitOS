import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { Vehicle } from '../features/vehicles/types/vehicle.types';
import { Trip } from '../features/trips/types/trip.types';
import { MaintenanceJob } from '../features/maintenance/types/maintenance.types';

export function AnalyticsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [jobs, setJobs] = useState<MaintenanceJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let loaded = 0;
    const checkLoaded = () => { loaded++; if (loaded === 3) setLoading(false); };

    const u1 = onSnapshot(query(collection(db, 'vehicles')), (snap) => {
      setVehicles(snap.docs.map(d => ({ id: d.id, ...d.data() } as Vehicle)));
      checkLoaded();
    });
    const u2 = onSnapshot(query(collection(db, 'trips')), (snap) => {
      setTrips(snap.docs.map(d => ({ id: d.id, ...d.data() } as Trip)));
      checkLoaded();
    });
    const u3 = onSnapshot(query(collection(db, 'maintenance_jobs')), (snap) => {
      setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() } as MaintenanceJob)));
      checkLoaded();
    });

    return () => { u1(); u2(); u3(); };
  }, []);

  // Computed analytics
  const totalVehicles = vehicles.length;
  const onTrip = vehicles.filter(v => v.status === 'On Trip').length;
  const utilization = totalVehicles > 0 ? ((onTrip / totalVehicles) * 100).toFixed(1) : '0';

  const completedTrips = trips.filter(t => t.status === 'Completed').length;
  const totalTrips = trips.length;
  const completionRate = totalTrips > 0 ? ((completedTrips / totalTrips) * 100).toFixed(1) : '0';

  const activeJobs = jobs.filter(j => j.status !== 'Completed');

  // Group maintenance cost by vehicle
  const costByVehicle: Record<string, number> = {};
  jobs.forEach(job => {
    if (!costByVehicle[job.vehicleId]) costByVehicle[job.vehicleId] = 0;
    costByVehicle[job.vehicleId] += job.totalCost || 0;
  });
  const topCostVehicles = Object.entries(costByVehicle)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxCost = topCostVehicles[0]?.[1] || 1;

  // Trip volume per month (last 9 months)
  const now = new Date();
  const monthLabels = Array.from({ length: 9 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (8 - i), 1);
    return d.toLocaleString('default', { month: 'short' });
  });
  const monthCounts = Array.from({ length: 9 }, (_, i) => {
    const month = now.getMonth() - (8 - i);
    const year = now.getFullYear() + Math.floor(month / 12);
    const m = ((month % 12) + 12) % 12;
    return trips.filter(t => {
      const d = new Date(t.createdAt);
      return d.getMonth() === m && d.getFullYear() === year;
    }).length;
  });
  const maxCount = Math.max(...monthCounts, 1);

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 border-b border-[#333] pb-2">7. Reports & Analytics</h2>

      <div className="grid grid-cols-4 gap-6 mb-12">
        <div className="bg-[#1a1a1a] border border-[#333] p-6 rounded-sm">
          <div className="text-xs uppercase text-[#666] tracking-wider mb-2">FLEET UTILIZATION</div>
          <div className={`text-4xl font-bold ${loading ? 'text-[#444] animate-pulse' : 'text-white'}`}>
            {loading ? '—' : `${utilization}`}<span className="text-xl text-[#aaa]">%</span>
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#333] p-6 rounded-sm">
          <div className="text-xs uppercase text-[#666] tracking-wider mb-2">TRIP COMPLETION RATE</div>
          <div className={`text-4xl font-bold text-green-400 ${loading ? 'opacity-40 animate-pulse' : ''}`}>
            {loading ? '—' : `${completionRate}%`}
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-amber-500 p-6 rounded-sm">
          <div className="text-xs uppercase text-[#666] tracking-wider mb-2">TOTAL TRIPS</div>
          <div className={`text-4xl font-bold text-amber-500 ${loading ? 'opacity-40 animate-pulse' : ''}`}>
            {loading ? '—' : totalTrips}
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#333] p-6 rounded-sm">
          <div className="text-xs uppercase text-[#666] tracking-wider mb-2">OPEN MAINTENANCE JOBS</div>
          <div className={`text-4xl font-bold text-rose-400 ${loading ? 'opacity-40 animate-pulse' : ''}`}>
            {loading ? '—' : activeJobs.length}
          </div>
        </div>
      </div>

      <div className="flex gap-12">
        {/* Trip Volume Chart */}
        <div className="w-1/2">
          <h3 className="text-[#666] uppercase tracking-wider text-sm mb-4">TRIP VOLUME (LAST 9 MONTHS)</h3>
          {loading ? (
            <div className="h-48 flex items-end space-x-2 border-b border-[#333] pb-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="flex-1 bg-[#222] animate-pulse rounded-t-sm" style={{ height: `${20 + Math.random() * 60}%` }} />
              ))}
            </div>
          ) : (
            <>
              <div className="h-48 flex items-end space-x-2 border-b border-[#333] pb-2">
                {monthCounts.map((count, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center group">
                    <div className="relative w-full">
                      <div
                        className="w-full bg-blue-500 hover:bg-blue-400 transition-colors rounded-t-sm"
                        style={{ height: `${(count / maxCount) * 180}px` }}
                      />
                      {count > 0 && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#aaa] opacity-0 group-hover:opacity-100 transition-opacity">{count}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2 mt-1">
                {monthLabels.map((label, i) => (
                  <div key={i} className="flex-1 text-center text-[10px] text-[#555]">{label}</div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Top Costliest Vehicles */}
        <div className="w-1/2">
          <h3 className="text-[#666] uppercase tracking-wider text-sm mb-4">TOP MAINTENANCE COST BY VEHICLE</h3>
          {loading ? (
            <div className="space-y-6">
              {[1,2,3].map(i => (
                <div key={i} className="w-full bg-[#222] h-4 rounded animate-pulse" />
              ))}
            </div>
          ) : topCostVehicles.length === 0 ? (
            <div className="text-[#666] py-6 text-center border border-[#222] rounded-lg text-sm">No maintenance cost data yet.</div>
          ) : (
            <div className="space-y-5">
              {topCostVehicles.map(([vehicleId, cost], i) => {
                const colors = ['bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-purple-500', 'bg-green-500'];
                return (
                  <div key={vehicleId}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-mono text-[#aaa]">{vehicleId.slice(0, 10)}…</span>
                      <span className="text-[#666]">₹{cost.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-[#222] h-4 rounded overflow-hidden">
                      <div className={`${colors[i % colors.length]} h-full transition-all duration-700`} style={{ width: `${(cost / maxCost) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-[#555] text-xs font-mono border-t border-[#222] pt-4">
        All data pulled live from Firebase Firestore • Refreshes in real-time
      </div>
    </div>
  );
}
