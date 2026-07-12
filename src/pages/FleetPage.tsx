import React from 'react';

export function FleetPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 border-b border-[#333] pb-2">2. Vehicle Registry</h2>
      
      <div className="flex justify-between items-center mb-6 text-[#aaa]">
        <div className="flex space-x-4">
          <select className="bg-[#1a1a1a] border border-[#333] px-3 py-1 rounded">
            <option>Type: All</option>
          </select>
          <select className="bg-[#1a1a1a] border border-[#333] px-3 py-1 rounded">
            <option>Status: All</option>
          </select>
          <input type="text" placeholder="Search reg no..." className="bg-[#1a1a1a] border border-[#333] px-3 py-1 rounded focus:outline-none focus:border-amber-500" />
        </div>
        <button className="bg-amber-600 text-black px-4 py-1.5 rounded font-bold hover:bg-amber-500 transition-colors">
          + Add Vehicle
        </button>
      </div>

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
          {[
            { r: 'GJ01AB4521', n: 'VAN-05', t: 'Van', c: '500 kg', o: '74,000', cost: '6,20,000', s: 'Available', color: 'bg-green-500/20 text-green-400 border border-green-500/30' },
            { r: 'GJ01AB9981', n: 'TRUCK-11', t: 'Truck', c: '5 Ton', o: '182,000', cost: '24,50,000', s: 'On Trip', color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
            { r: 'GJ01AB1120', n: 'MINI-03', t: 'Mini', c: '1 Ton', o: '66,000', cost: '4,10,000', s: 'In Shop', color: 'bg-amber-500/20 text-amber-500 border border-amber-500/30' },
            { r: 'GJ01AB008', n: 'VAN-04', t: 'Van', c: '750 kg', o: '241,900', cost: '5,90,000', s: 'Retired', color: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' },
          ].map((v, i) => (
            <tr key={i} className="border-t border-[#222]">
              <td className="py-4 font-mono">{v.r}</td>
              <td className="py-4 font-semibold">{v.n}</td>
              <td className="py-4">{v.t}</td>
              <td className="py-4">{v.c}</td>
              <td className="py-4">{v.o}</td>
              <td className="py-4 text-[#aaa]">{v.cost}</td>
              <td className="py-4">
                <span className={`px-3 py-1 rounded text-sm ${v.color}`}>{v.s}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8 text-amber-600 text-sm">
        Rule: Registration No. must be unique · Retired/In Shop vehicles are hidden from Trip Dispatcher
      </div>
    </div>
  );
}
