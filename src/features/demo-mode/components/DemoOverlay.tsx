import React from 'react';
import { useDemo } from '../context/DemoContext';
import { Badge } from '@/components/ui/badge';
import { Activity, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DemoOverlay() {
  const { isDemoMode, activeScenarioId, resetDemo } = useDemo();

  if (!isDemoMode) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 border border-slate-700 animate-in slide-in-from-bottom-10">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
        <span className="font-semibold text-sm tracking-wide uppercase">Demo Mode Active</span>
      </div>
      
      {activeScenarioId && (
        <>
          <div className="w-px h-4 bg-slate-700" />
          <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30">
            Playing: {activeScenarioId}
          </Badge>
          <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full hover:bg-slate-800" onClick={resetDemo}>
            <X className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
