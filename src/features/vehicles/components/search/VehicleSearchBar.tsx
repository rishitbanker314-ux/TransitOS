import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, Loader2, X } from 'lucide-react';
import { convertNaturalLanguageToFilters } from '../../actions/VehicleSearchAI.actions';
import { VehicleFilterOptions } from '../../types/search.types';

interface VehicleSearchBarProps {
  onSearch: (term: string) => void;
  onAIFilterApply: (filters: VehicleFilterOptions) => void;
  initialValue?: string;
}

export function VehicleSearchBar({ onSearch, onAIFilterApply, initialValue = '' }: VehicleSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  // Simple debounce for standard typing
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleAISearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsAIProcessing(true);
    try {
      const structuredFilters = await convertNaturalLanguageToFilters(searchTerm);
      onAIFilterApply(structuredFilters);
      // Clear the text bar since it's now converted to structured filters
      setSearchTerm(''); 
    } catch (error) {
      console.error('AI Search failed:', error);
    } finally {
      setIsAIProcessing(false);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="relative flex-1 max-w-2xl flex items-center shadow-sm">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Registration, Name, or ask AI (e.g. 'Idle diesel trucks')"
          className="pl-10 pr-10 border-r-0 rounded-r-none focus-visible:ring-1"
          onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
        />
        {searchTerm && (
          <button 
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button 
        variant="secondary" 
        className="rounded-l-none border-l border-input bg-muted/50 hover:bg-muted"
        onClick={handleAISearch}
        disabled={isAIProcessing || !searchTerm.trim()}
        title="Extract Smart Filters"
      >
        {isAIProcessing ? <Loader2 className="h-4 w-4 animate-spin text-blue-500" /> : <Sparkles className="h-4 w-4 text-blue-500 mr-2" />}
        <span className="hidden sm:inline">{isAIProcessing ? 'Thinking...' : 'AI Search'}</span>
      </Button>
    </div>
  );
}
