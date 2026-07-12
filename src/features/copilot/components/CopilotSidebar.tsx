import React, { useState, useEffect } from 'react';
import { ConversationPanel } from './ConversationPanel';
import { PromptSuggestions } from './PromptSuggestions';
import { Message } from '../types/copilot.types';
import { X, Send, Settings, Key, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CopilotSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  loading: boolean;
  onSendMessage: (content: string) => void;
  onApproveProposal: (id: string, type: string, payload: any) => void;
  onRejectProposal: (id: string) => void;
}

export const CopilotSidebar: React.FC<CopilotSidebarProps> = ({
  isOpen,
  onClose,
  messages,
  loading,
  onSendMessage,
  onApproveProposal,
  onRejectProposal
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Hydrate local key on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = window.localStorage.getItem('TRANSITOPS_GEMINI_API_KEY') || '';
      setApiKey(savedKey);
    }
  }, []);

  const handleSaveKey = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('TRANSITOPS_GEMINI_API_KEY', apiKey.trim());
      setShowSettings(false);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || loading) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-350">
      
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
            Fleet Copilot
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Operations Assistant</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-lg text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${showSettings ? 'bg-slate-100 text-blue-500 dark:bg-slate-800' : ''}`}
            title="Configure API Keys"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Settings Drawer (expandable) */}
      {showSettings && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-blue-50/20 dark:bg-blue-950/10 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-350">
            <Key className="h-3.5 w-3.5 text-blue-500" />
            <span>Gemini API Key configuration</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Enter a key to query the live Gemini model. If left blank, Copilot falls back to local simulated telemetry.
          </p>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Paste key (AIzaSy...)"
              value={apiKey}
              onChange={(e: any) => setApiKey(e.target.value)}
              className="h-8 text-xs font-mono flex-1 bg-white dark:bg-slate-900 border"
            />
            <Button
              onClick={handleSaveKey}
              size="sm"
              className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
            >
              Save
            </Button>
          </div>
        </div>
      )}

      {/* Main Conversation viewport */}
      <ConversationPanel
        messages={messages}
        loading={loading}
        onApproveProposal={onApproveProposal}
        onRejectProposal={onRejectProposal}
      />

      {/* Interactive suggestions shortcuts */}
      <PromptSuggestions onSelect={onSendMessage} />

      {/* Message input panel */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
      >
        <Input
          type="text"
          placeholder="Ask Copilot something..."
          value={inputValue}
          onChange={(e: any) => setInputValue(e.target.value)}
          disabled={loading}
          className="flex-1 h-9 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 focus:outline-none"
        />
        <Button
          type="submit"
          disabled={!inputValue.trim() || loading}
          size="sm"
          className="h-9 w-9 p-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
