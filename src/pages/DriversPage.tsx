import React from 'react';

export function DriversPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 border-b border-[#333] pb-2">3. Drivers &amp; Safety Profiles</h2>
      
      <div className="flex justify-between items-center mb-6 text-[#aaa]">
        <input type="text" placeholder="Search..." className="bg-[#1a1a1a] border border-[#333] px-3 py-1 rounded focus:outline-none focus:border-amber-500 w-64" />
        <button className="bg-amber-600 text-black px-4 py-1.5 rounded font-bold hover:bg-amber-500 transition-colors">
          + Add Driver
        </button>
      </div>

      <table className="w-full text-left border-collapse mb-8">
        <thead>
          <tr className="text-[#666] text-sm uppercase tracking-wider">
            <th className="py-2">Driver</th>
            <th className="py-2">License No.</th>
            <th className="py-2">Category</th>
            <th className="py-2">Expiry</th>
            <th className="py-2">Contact</th>
            <th className="py-2">Trip Compl.</th>
            <th className="py-2">Safety</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {[
            { d: 'Alex', l: 'DL-88213', c: 'LMV', e: '12/2028', p: '98765xxxxx', t: '96%', saf: 'Available', s: 'Available', color: 'bg-green-500/20 text-green-400 border border-green-500/30' },
            { d: 'John', l: 'DL-44120', c: 'HMV', e: '03/2025 EXPIRE', p: '98220xxxxx', t: '81%', saf: 'Suspended', s: 'Suspended', color: 'bg-rose-500/20 text-rose-400 border border-rose-500/30', safColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' },
            { d: 'Priya', l: 'DL-77031', c: 'LMV', e: '08/2021', p: '99110xxxxx', t: '99%', saf: 'On Trip', s: 'On Trip', color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30', safColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
            { d: 'Suresh', l: 'DL-90045', c: 'HMV', e: '01/2027', p: '97440xxxxx', t: '88%', saf: 'Available', s: 'OFF Duty', color: 'bg-gray-500/20 text-gray-400 border border-gray-500/30', safColor: 'bg-green-500/20 text-green-400 border border-green-500/30' },
          ].map((v, i) => (
            <tr key={i} className="border-t border-[#222]">
              <td className="py-4 font-semibold">{v.d}</td>
              <td className="py-4 font-mono">{v.l}</td>
              <td className="py-4">{v.c}</td>
              <td className={`py-4 ${v.e.includes('EXPIRE') ? 'text-rose-500 font-bold' : ''}`}>{v.e}</td>
              <td className="py-4 font-mono text-[#aaa]">{v.p}</td>
              <td className="py-4">{v.t}</td>
              <td className="py-4">
                <span className={`px-3 py-1 rounded text-sm ${v.safColor || v.color}`}>{v.saf}</span>
              </td>
              <td className="py-4">
                <span className={`px-3 py-1 rounded text-sm ${v.color}`}>{v.s}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <h3 className="text-[#666] uppercase tracking-wider text-sm mb-2">TOGGLE STAT</h3>
        <div className="flex space-x-2">
          <button className="bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-1 rounded text-sm">Available</button>
          <button className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-1 rounded text-sm">On Trip</button>
          <button className="bg-gray-500/20 text-gray-400 border border-gray-500/30 px-4 py-1 rounded text-sm">Off Duty</button>
          <button className="bg-rose-500 text-white border border-rose-600 px-4 py-1 rounded text-sm">Suspended</button>
        </div>
      </div>

      <div className="mt-6 text-amber-600 text-sm">
        Rule: Expired license or Suspended status -&gt; blocked from trip assignment
      </div>
    </div>
  );
}
