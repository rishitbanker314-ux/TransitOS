import React from 'react';
import { ActionCardData } from '../types/copilot.types';
import { Check, X, ShieldAlert, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionCardsProps {
  card: ActionCardData;
  onApprove: (id: string, type: string, payload: any) => void;
  onReject: (id: string) => void;
}

export const ActionCards: React.FC<ActionCardsProps> = ({ card, onApprove, onReject }) => {
  const getHeaderColor = () => {
    switch (card.type) {
      case 'dispatch':
        return 'border-purple-200 bg-purple-50/50 text-purple-900 dark:border-purple-900/30 dark:bg-purple-950/20';
      case 'maintenance':
        return 'border-orange-200 bg-orange-50/50 text-orange-900 dark:border-orange-900/30 dark:bg-orange-950/20';
      case 'driver_assignment':
        return 'border-blue-200 bg-blue-50/50 text-blue-900 dark:border-blue-900/30 dark:bg-blue-950/20';
    }
  };

  const getBadgeTitle = () => {
    switch (card.type) {
      case 'dispatch':
        return 'Propose Dispatch';
      case 'maintenance':
        return 'Propose Maintenance';
      case 'driver_assignment':
        return 'Propose Driver Match';
    }
  };

  return (
    <div className={`mt-3 border rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${getHeaderColor()}`}>
      {/* Header */}
      <div className="p-3 border-b flex justify-between items-center bg-white/40 dark:bg-slate-900/40">
        <div className="flex items-center gap-1.5 font-semibold text-xs">
          <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
          <span>{getBadgeTitle()}</span>
        </div>
        <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/60 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          Confidence: {Math.round(card.confidenceScore * 100)}%
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-3 bg-white/80 dark:bg-slate-900/80">
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {card.reasoning}
        </p>

        {/* Payload attributes */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 text-xs space-y-1.5 border border-slate-100 dark:border-slate-800">
          {card.payload.tripId && (
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Trip:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{card.payload.tripId}</span>
            </div>
          )}
          {card.payload.vehicleId && (
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Vehicle:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{card.payload.vehicleId}</span>
            </div>
          )}
          {card.payload.driverId && (
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Driver:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{card.payload.driverId}</span>
            </div>
          )}
          {card.payload.scheduleDate && (
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Scheduled Date:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{card.payload.scheduleDate}</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
          {card.status === 'pending' ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject(card.id)}
                className="h-8 px-3 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Reject
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => onApprove(card.id, card.type, card.payload)}
                className="h-8 px-3 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center shadow-sm"
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Approve & Execute
              </Button>
            </>
          ) : card.status === 'approved' ? (
            <span className="inline-flex items-center text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-2 py-1 rounded border border-green-200/50">
              <Check className="h-3.5 w-3.5 mr-1" /> Approved & Executed
            </span>
          ) : (
            <span className="inline-flex items-center text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 py-1 rounded border border-red-200/50">
              <X className="h-3.5 w-3.5 mr-1" /> Proposal Rejected
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
