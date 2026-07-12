import React from 'react';
import { Clock } from 'lucide-react';

interface VehicleSearchHistoryProps {
  recentSearches: string[];
  onSelect: (term: string) => void;
}

export function VehicleSearchHistory({ recentSearches, onSelect }: VehicleSearchHistoryProps) {
  if (recentSearches.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-popover border shadow-md rounded-md overflow-hidden z-50">
      <div className="p-2 text-xs font-semibold text-muted-foreground bg-muted/20">
        Recent Searches
      </div>
      <ul className="py-1">
        {recentSearches.map((term, i) => (
          <li key={i}>
            <button 
              className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"
              onClick={() => onSelect(term)}
            >
              <Clock className="h-3 w-3 text-muted-foreground" />
              {term}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
