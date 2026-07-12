import React from 'react';
import { HelpCircle } from 'lucide-react';

interface PromptSuggestionsProps {
  onSelect: (prompt: string) => void;
}

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onSelect }) => {
  const suggestions = [
    { text: 'Which driver is overworked?', category: 'Drivers' },
    { text: 'Which trips are delayed?', category: 'Trips' },
    { text: 'Assign best vehicle/driver tomorrow', category: 'Dispatch' },
    { text: 'Show vehicles needing maintenance', category: 'Maintenance' },
    { text: 'Which insurance expires this week?', category: 'Compliance' },
    { text: 'Why is fleet utilization low?', category: 'Analytics' },
    { text: 'Generate executive summary', category: 'Reporting' },
  ];

  return (
    <div className="space-y-2 p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
        <HelpCircle className="h-3.5 w-3.5" />
        <span>Suggested Operations Queries</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion.text)}
            className="text-[11px] font-medium px-2.5 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            {suggestion.text}
          </button>
        ))}
      </div>
    </div>
  );
};
