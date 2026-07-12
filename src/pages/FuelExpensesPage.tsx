import React from 'react';

export function FuelExpensesPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 border-b border-[#333] pb-2">6. Fuel &amp; Expense Management</h2>

      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[#666] uppercase tracking-wider text-sm">FUEL LOGS</h3>
          <div className="flex space-x-4">
            <button className="bg-amber-600/20 text-amber-500 border border-amber-500/50 px-4 py-1.5 rounded hover:bg-amber-600/30 transition-colors">
              + Log Fuel
            </button>
            <button className="bg-amber-600 text-black px-4 py-1.5 rounded font-bold hover:bg-amber-500 transition-colors">
              + Add Expense
            </button>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[#666] text-sm uppercase tracking-wider">
              <th className="py-2">Vehicle</th>
              <th className="py-2">Date</th>
              <th className="py-2">Liters</th>
              <th className="py-2 text-right">Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-[#222]">
              <td className="py-3 font-semibold">VAN-05</td>
              <td className="py-3 text-[#aaa]">05 Jul 2026</td>
              <td className="py-3">42 L</td>
              <td className="py-3 text-right">3,150</td>
            </tr>
            <tr className="border-t border-[#222]">
              <td className="py-3 font-semibold">TRUCK-11</td>
              <td className="py-3 text-[#aaa]">06 Jul 2026</td>
              <td className="py-3">110 L</td>
              <td className="py-3 text-right">8,400</td>
            </tr>
            <tr className="border-t border-[#222]">
              <td className="py-3 font-semibold">MINI-03</td>
              <td className="py-3 text-[#aaa]">06 Jul 2026</td>
              <td className="py-3">28 L</td>
              <td className="py-3 text-right">2,050</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-[#666] uppercase tracking-wider text-sm mb-6">OTHER EXPENSES (TOLL / MISC)</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[#666] text-sm uppercase tracking-wider">
              <th className="py-2">Trip</th>
              <th className="py-2">Vehicle</th>
              <th className="py-2">Toll</th>
              <th className="py-2">Other</th>
              <th className="py-2">Maint. (Linked)</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-[#222]">
              <td className="py-3 font-mono text-[#aaa]">TR001</td>
              <td className="py-3 font-semibold">VAN-05</td>
              <td className="py-3">120</td>
              <td className="py-3">0</td>
              <td className="py-3">0</td>
              <td className="py-3 text-right">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-sm inline-block w-24 text-center">Available</span>
              </td>
            </tr>
            <tr className="border-t border-[#222]">
              <td className="py-3 font-mono text-[#aaa]">TR002</td>
              <td className="py-3 font-semibold">TRK-12</td>
              <td className="py-3">340</td>
              <td className="py-3">150</td>
              <td className="py-3">18,000</td>
              <td className="py-3 text-right">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-sm inline-block w-24 text-center">Completed</span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[#555] font-bold text-lg">
              <td colSpan={5} className="py-4 uppercase text-[#aaa] tracking-widest">TOTAL OPERATIONAL COST (AUTO) = FUEL + MAINT</td>
              <td className="py-4 text-right text-rose-400">34,070</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
