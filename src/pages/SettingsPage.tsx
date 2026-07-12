import React from 'react';

export function SettingsPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 border-b border-[#333] pb-2">8. Settings &amp; RBAC</h2>

      <div className="flex gap-16">
        <div className="w-1/3">
          <h3 className="text-[#666] uppercase tracking-wider text-sm mb-6">GENERAL</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Depot Name</label>
              <input type="text" value="Gandhinagar Depot GJ4" readOnly className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-[#aaa]" />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Currency</label>
              <input type="text" value="INR (Rs)" readOnly className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-[#aaa]" />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Distance Unit</label>
              <input type="text" value="Kilometers" readOnly className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-[#aaa]" />
            </div>
            <button type="button" className="bg-blue-500/20 text-blue-400 border border-blue-500/50 px-6 py-2 rounded font-bold hover:bg-blue-500/30 transition-colors mt-4">
              Save changes
            </button>
          </form>
        </div>

        <div className="w-2/3">
          <h3 className="text-[#666] uppercase tracking-wider text-sm mb-6">ROLE-BASED ACCESS (RBAC)</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#666] text-xs uppercase tracking-wider border-b border-[#333]">
                <th className="py-2">Role</th>
                <th className="py-2 text-center">Fleet</th>
                <th className="py-2 text-center">Drivers</th>
                <th className="py-2 text-center">Trips</th>
                <th className="py-2 text-center">Fuel/Exp.</th>
                <th className="py-2 text-center">Analytics</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-[#222]">
                <td className="py-4 font-bold text-white">Fleet Manager</td>
                <td className="py-4 text-center">✓</td>
                <td className="py-4 text-center">✓</td>
                <td className="py-4 text-center text-[#444]">-</td>
                <td className="py-4 text-center text-[#444]">-</td>
                <td className="py-4 text-center">✓</td>
              </tr>
              <tr className="border-b border-[#222]">
                <td className="py-4 font-bold text-white">Dispatcher</td>
                <td className="py-4 text-center text-[#888]">View</td>
                <td className="py-4 text-center text-[#444]">-</td>
                <td className="py-4 text-center">✓</td>
                <td className="py-4 text-center text-[#444]">-</td>
                <td className="py-4 text-center text-[#444]">-</td>
              </tr>
              <tr className="border-b border-[#222]">
                <td className="py-4 font-bold text-white">Safety Officer</td>
                <td className="py-4 text-center text-[#444]">-</td>
                <td className="py-4 text-center">✓</td>
                <td className="py-4 text-center text-[#888]">View</td>
                <td className="py-4 text-center text-[#444]">-</td>
                <td className="py-4 text-center text-[#444]">-</td>
              </tr>
              <tr className="border-b border-[#222]">
                <td className="py-4 font-bold text-white">Financial Analyst</td>
                <td className="py-4 text-center text-[#888]">View</td>
                <td className="py-4 text-center text-[#444]">-</td>
                <td className="py-4 text-center text-[#444]">-</td>
                <td className="py-4 text-center">✓</td>
                <td className="py-4 text-center">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
