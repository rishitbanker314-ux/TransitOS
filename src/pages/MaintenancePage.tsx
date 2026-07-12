import React from 'react';

export function MaintenancePage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 border-b border-[#333] pb-2">5. Maintenance</h2>

      <div className="flex gap-12">
        <div className="w-1/3">
          <h3 className="text-[#666] uppercase tracking-wider text-sm mb-6">LOG SERVICE RECORD</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Vehicle</label>
              <input type="text" value="VAN-05" readOnly className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-[#aaa]" />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Service Type</label>
              <input type="text" value="Oil Change" readOnly className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-[#aaa]" />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Cost</label>
              <input type="text" value="2500" readOnly className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-[#aaa]" />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Date</label>
              <input type="text" value="07/07/2026" readOnly className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-[#aaa]" />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Status</label>
              <input type="text" value="Active" readOnly className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-[#aaa]" />
            </div>
            <button type="button" className="w-full bg-amber-600 text-black py-2 rounded font-bold hover:bg-amber-500 mt-4">
              Save
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#666] text-sm uppercase tracking-wider">
                <th className="py-2">Vehicle</th>
                <th className="py-2">Service</th>
                <th className="py-2">Cost</th>
                <th className="py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#222]">
                <td className="py-4 font-semibold">VAN-05</td>
                <td className="py-4 text-[#aaa]">Oil Change</td>
                <td className="py-4">2,500</td>
                <td className="py-4 text-right">
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded text-sm">In Shop</span>
                </td>
              </tr>
              <tr className="border-t border-[#222]">
                <td className="py-4 font-semibold">TRUCK-11</td>
                <td className="py-4 text-[#aaa]">Engine Repair</td>
                <td className="py-4">18,000</td>
                <td className="py-4 text-right">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-sm">Completed</span>
                </td>
              </tr>
              <tr className="border-t border-[#222]">
                <td className="py-4 font-semibold">MINI-03</td>
                <td className="py-4 text-[#aaa]">Tyre Replace</td>
                <td className="py-4">6,200</td>
                <td className="py-4 text-right">
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded text-sm">In Shop</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
