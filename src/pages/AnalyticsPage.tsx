import React from 'react';

export function AnalyticsPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 border-b border-[#333] pb-2">7. Reports &amp; Analytics</h2>

      <div className="grid grid-cols-4 gap-6 mb-12">
        <div className="bg-[#1a1a1a] border border-[#333] p-6 rounded-sm">
          <div className="text-xs uppercase text-[#666] tracking-wider mb-2">FUEL EFFICIENCY</div>
          <div className="text-4xl font-bold text-white">8.4 <span className="text-xl text-[#aaa]">km/l</span></div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#333] p-6 rounded-sm">
          <div className="text-xs uppercase text-[#666] tracking-wider mb-2">FLEET UTILIZATION</div>
          <div className="text-4xl font-bold text-white">81%</div>
        </div>
        <div className="bg-[#1a1a1a] border border-amber-500 p-6 rounded-sm">
          <div className="text-xs uppercase text-[#666] tracking-wider mb-2">OPERATIONAL COST</div>
          <div className="text-4xl font-bold text-amber-500">34,070</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#333] p-6 rounded-sm">
          <div className="text-xs uppercase text-[#666] tracking-wider mb-2">VEHICLE ROI</div>
          <div className="text-4xl font-bold text-green-400">14.2%</div>
        </div>
      </div>
      
      <div className="text-[#666] text-sm mb-8 font-mono">
        ROI = (Revenue - Maintenance - Fuel) / Acquisition Cost
      </div>

      <div className="flex gap-12">
        <div className="w-1/2">
          <h3 className="text-[#666] uppercase tracking-wider text-sm mb-6">MONTHLY REVENUE</h3>
          <div className="h-48 flex items-end space-x-2 border-b border-[#333] pb-2">
            {[40, 55, 45, 60, 50, 70, 85, 75, 70].map((h, i) => (
              <div key={i} className="flex-1 bg-blue-500 hover:bg-blue-400 transition-colors rounded-t-sm" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </div>

        <div className="w-1/2">
          <h3 className="text-[#666] uppercase tracking-wider text-sm mb-6">TOP COSTLIEST VEHICLES</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>TRUCK-11</span>
              </div>
              <div className="w-full bg-[#222] h-4 rounded overflow-hidden">
                <div className="bg-rose-500 h-full w-[85%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>MINI-03</span>
              </div>
              <div className="w-full bg-[#222] h-4 rounded overflow-hidden">
                <div className="bg-amber-500 h-full w-[45%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>VAN-05</span>
              </div>
              <div className="w-full bg-[#222] h-4 rounded overflow-hidden">
                <div className="bg-blue-500 h-full w-[25%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
