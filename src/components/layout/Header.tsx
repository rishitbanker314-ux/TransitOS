import React from 'react';
import { useAuth } from '../../lib/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase/config';

export function Header() {
  const { currentUser } = useAuth();

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign out failed', err);
    }
  };

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
        <div className="text-right">
          <div className="text-[#ccc] text-sm font-semibold">{displayName}</div>
          <div className="text-[#666] text-xs">{currentUser?.email}</div>
        </div>
        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold border border-blue-500/30">Dispatcher</span>
        <button
          onClick={handleSignOut}
          className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full text-sm hover:bg-rose-500/20 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}

