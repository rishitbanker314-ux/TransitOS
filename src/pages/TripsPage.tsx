import React from 'react';

export function TripsPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 border-b border-[#333] pb-2">4. Trip Dispatcher</h2>

      <div className="flex gap-12">
        {/* CREATE TRIP FORM */}
        <div className="w-1/3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[#666] uppercase tracking-wider text-sm">TRIP LIFECYCLE</h3>
          </div>
          <div className="flex space-x-2 mb-8 text-sm">
            <span className="text-green-500 font-bold">Draft</span>
            <span className="text-[#444]">→</span>
            <span className="text-blue-500">Dispatched</span>
            <span className="text-[#444]">→</span>
            <span className="text-green-500">Completed</span>
            <span className="text-[#444]">→</span>
            <span className="text-gray-500">Cancelled</span>
          </div>

          <h3 className="text-[#666] uppercase tracking-wider text-sm mb-4">CREATE TRIP</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Source</label>
              <input type="text" value="Gandhinagar Depot" readOnly className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-[#aaa]" />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Destination</label>
              <input type="text" value="Ahmedabad Hub" readOnly className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-[#aaa]" />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Vehicle (Available only)</label>
              <input type="text" value="VAN-05 - 500 kg capacity" readOnly className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-[#aaa]" />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Driver (Available only)</label>
              <input type="text" value="Alex" readOnly className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-[#aaa]" />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Cargo Weight (kg)</label>
              <input type="text" value="700" readOnly className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-[#aaa]" />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#666] mb-1">Planned Distance (km)</label>
              <input type="text" value="38" readOnly className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-[#aaa]" />
            </div>

            <div className="border border-rose-500/50 bg-rose-500/10 rounded p-3 text-sm text-rose-400">
              <p>Vehicle Capacity: 500 kg</p>
              <p>Cargo Weight: 700 kg</p>
              <p className="font-bold text-rose-500 mt-1">X Capacity exceeded by 200 kg - dispatch blocked</p>
            </div>

            <div className="flex space-x-4 pt-2">
              <button disabled className="flex-1 bg-[#333] text-[#666] py-2 rounded font-bold cursor-not-allowed">Dispatch (disabled)</button>
              <button type="button" className="flex-1 bg-[#2a2a2a] border border-[#444] text-[#ccc] py-2 rounded font-bold hover:bg-[#333]">Cancel</button>
            </div>
          </form>
        </div>

        {/* LIVE BOARD */}
        <div className="w-2/3">
          <h3 className="text-[#666] uppercase tracking-wider text-sm mb-6">LIVE BOARD</h3>
          <div className="space-y-6">
            
            <div className="border-b border-[#222] pb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-mono text-[#aaa]">TR001</div>
                  <div className="font-bold text-lg">Gandhinagar Depot -&gt; Ahmedabad Hub</div>
                </div>
                <div className="text-right">
                  <div className="text-amber-500 font-mono">VAN-05 / ALEX</div>
                  <div className="text-[#666] text-sm">45 min</div>
                </div>
              </div>
              <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-sm">Dispatched</span>
            </div>

            <div className="border-b border-[#222] pb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-mono text-[#aaa]">TR004</div>
                  <div className="font-bold text-lg">Vatva Industrial Area -&gt; Sanand Warehouse</div>
                </div>
                <div className="text-right">
                  <div className="text-amber-500 font-mono">TRUCK-04 / SURESH</div>
                  <div className="text-[#666] text-sm">Awaiting driver</div>
                </div>
              </div>
              <span className="inline-block px-3 py-1 bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded text-sm">Draft</span>
            </div>

            <div className="border-b border-[#222] pb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-mono text-[#aaa]">TR006</div>
                  <div className="font-bold text-lg text-[#666] line-through">Mansa -&gt; Kalol Depot</div>
                </div>
                <div className="text-right">
                  <div className="text-[#666] font-mono">Unassigned</div>
                  <div className="text-[#666] text-sm">Vehicle went to shop</div>
                </div>
              </div>
              <span className="inline-block px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-sm">Cancelled</span>
            </div>

          </div>

          <div className="mt-12 text-[#666] text-sm italic">
            On Complete: odometer -&gt; fuel log -&gt; expenses -&gt; Vehicle &amp; Driver Available
          </div>
        </div>
      </div>
    </div>
  );
}
