import React from 'react';

export function Header() {
  return (
    <header className="h-16 bg-[#1a1a1a] border-b border-[#333] flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-[#2a2a2a] border border-[#444] rounded-full py-1.5 px-4 text-[#ccc] placeholder:text-[#666] focus:outline-none focus:border-amber-500 font-sans"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-[#ccc] text-lg">Raven K.</span>
        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold border border-blue-500/30">Dispatcher</span>
      </div>
    </header>
  );
}
