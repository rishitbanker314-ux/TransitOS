import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DEMO_DATA } from '../data/DemoSeedData';

interface DemoContextType {
  isDemoMode: boolean;
  activeScenarioId: string | null;
  toggleDemoMode: () => void;
  playScenario: (id: string) => void;
  resetDemo: () => void;
  seedData: typeof DEMO_DATA;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(true); // Default ON for hackathon
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  const toggleDemoMode = () => setIsDemoMode(prev => !prev);
  const playScenario = (id: string) => setActiveScenarioId(id);
  const resetDemo = () => setActiveScenarioId(null);

  return (
    <DemoContext.Provider value={{
      isDemoMode,
      activeScenarioId,
      toggleDemoMode,
      playScenario,
      resetDemo,
      seedData: DEMO_DATA
    }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
