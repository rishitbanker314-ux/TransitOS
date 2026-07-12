import React from 'react';
import { useDemo } from '../context/DemoContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function JudgeDashboard() {
  const { seedData, playScenario, resetDemo } = useDemo();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            TransitOps Hackathon Demo
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Welcome judges! This dashboard provides one-click scenarios to evaluate the core architecture, AI copilot, and realtime state engine without manual data entry.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={resetDemo}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset State
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Sparkles className="mr-2 h-4 w-4" /> Start Full Guided Tour
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {seedData.scenarios.map(scenario => (
          <Card key={scenario.id} className="group hover:shadow-lg transition-all border-indigo-100 hover:border-indigo-300">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{scenario.title}</span>
                <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600" onClick={() => playScenario(scenario.id)}>
                  <Play className="h-4 w-4 mr-1" /> Play
                </Button>
              </CardTitle>
              <div className="text-sm leading-relaxed text-slate-600">
                {scenario.description}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 pt-8 border-t">
        <div className="text-center p-6 bg-slate-50 rounded-xl border">
          <div className="text-3xl font-bold text-slate-900">{seedData.vehicles.length}</div>
          <div className="text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">Mock Vehicles</div>
        </div>
        <div className="text-center p-6 bg-slate-50 rounded-xl border">
          <div className="text-3xl font-bold text-slate-900">2,000+</div>
          <div className="text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">Historical Trips</div>
        </div>
        <div className="text-center p-6 bg-slate-50 rounded-xl border">
          <div className="text-3xl font-bold text-slate-900">0ms</div>
          <div className="text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">Firestore Latency</div>
        </div>
      </div>
    </div>
  );
}
