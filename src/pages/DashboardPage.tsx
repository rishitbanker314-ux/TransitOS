import React from 'react';

export function DashboardPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 border-b border-[#333] pb-2">1. Dashboard</h2>
      
      {/* Filters */}
      <div className="flex space-x-4 mb-6 text-xl text-[#aaa]">
        <span>FILTERS</span>
        <select className="bg-[#1a1a1a] border border-[#333] px-3 py-1 rounded">
          <option>Vehicle Type: All</option>
        </select>
        <select className="bg-[#1a1a1a] border border-[#333] px-3 py-1 rounded">
          <option>Status: All</option>
        </select>
        <select className="bg-[#1a1a1a] border border-[#333] px-3 py-1 rounded">
          <option>Region: All</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        {[
          { title: 'ACTIVE VEHICLES', val: '53' },
          { title: 'AVAILABLE VEHICLES', val: '42' },
          { title: 'VEHICLES IN MAINTENANCE', val: '05', border: 'border-amber-500' },
          { title: 'ACTIVE TRIPS', val: '18', border: 'border-blue-500' },
          { title: 'PENDING TRIPS', val: '09' },
          { title: 'DRIVERS ON DUTY', val: '26' },
          { title: 'FLEET UTILIZATION', val: '81%', border: 'border-green-500' },
        ].map((kpi, i) => (
          <div key={i} className={`bg-[#1a1a1a] border ${kpi.border || 'border-[#333]'} p-4 rounded-sm flex flex-col justify-center`}>
            <div className="text-[10px] uppercase text-[#666] tracking-wider mb-1">{kpi.title}</div>
            <div className="text-3xl font-bold text-white">{kpi.val}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-8">
        <div className="flex-1">
          <h3 className="text-xl text-[#aaa] mb-4 uppercase tracking-wider">Recent Trips</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#666] text-sm uppercase">
                <th className="py-2">Trip</th>
                <th className="py-2">Vehicle</th>
                <th className="py-2">Driver</th>
                <th className="py-2">Status</th>
                <th className="py-2">ETA</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'TR001', v: 'VAN-05', d: 'Alex', s: 'On Trip', color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30', eta: '45 min' },
                { id: 'TR002', v: 'TRK-12', d: 'John', s: 'Completed', color: 'bg-green-500/20 text-green-400 border border-green-500/30', eta: '-' },
                { id: 'TR003', v: 'MINI-08', d: 'Priya', s: 'Dispatched', color: 'bg-blue-400/20 text-blue-300 border border-blue-400/30', eta: 'In 10m' },
                { id: 'TR004', v: '-', d: '-', s: 'Draft', color: 'bg-gray-500/20 text-gray-400 border border-gray-500/30', eta: 'Awaiting vehicle' },
              ].map(t => (
                <tr key={t.id} className="border-t border-[#222]">
                  <td className="py-3 font-semibold">{t.id}</td>
                  <td className="py-3">{t.v}</td>
                  <td className="py-3">{t.d}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded text-sm ${t.color}`}>{t.s}</span>
                  </td>
                  <td className="py-3 text-[#aaa]">{t.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-1/3">
          <h3 className="text-xl text-[#aaa] mb-4 uppercase tracking-wider">Vehicle Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="w-24">Available</span>
              <div className="flex-1 bg-[#222] h-4 mx-4 rounded overflow-hidden">
                <div className="bg-green-500 h-full w-[80%]"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="w-24">On Trip</span>
              <div className="flex-1 bg-[#222] h-4 mx-4 rounded overflow-hidden">
                <div className="bg-blue-500 h-full w-[35%]"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="w-24">In Shop</span>
              <div className="flex-1 bg-[#222] h-4 mx-4 rounded overflow-hidden">
                <div className="bg-amber-500 h-full w-[10%]"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="w-24">Retired</span>
              <div className="flex-1 bg-[#222] h-4 mx-4 rounded overflow-hidden">
                <div className="bg-rose-500 h-full w-[5%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
