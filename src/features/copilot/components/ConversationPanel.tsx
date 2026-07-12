import React, { useRef, useEffect } from 'react';
import { Message, ActionCardData } from '../types/copilot.types';
import { ActionCards } from './ActionCards';
import { Bot, User, Loader2 } from 'lucide-react';

interface ConversationPanelProps {
  messages: Message[];
  loading: boolean;
  onApproveProposal: (id: string, type: string, payload: any) => void;
  onRejectProposal: (id: string) => void;
}

export const ConversationPanel: React.FC<ConversationPanelProps> = ({
  messages,
  loading,
  onApproveProposal,
  onRejectProposal
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Utility to parse basic markdown elements: headers, bullet lists, bolding, and markdown tables.
  const renderMessageContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];
    let tableRows: string[][] = [];
    let isTable = false;

    const flushList = (key: string) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${key}`} className="list-disc pl-5 mb-3 space-y-1 text-xs text-slate-700 dark:text-slate-300">
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    const flushTable = (key: string) => {
      if (tableRows.length > 0) {
        // Find headers and rows
        const headers = tableRows[0];
        const dataRows = tableRows.slice(1).filter(row => {
          // Filter out divider rows like |---|---|
          return !row.every(cell => cell.trim().startsWith('-') || cell.trim() === '');
        });

        elements.push(
          <div key={`table-${key}`} className="my-3 overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      {h.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-850">
                {dataRows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-3 py-2 text-slate-650 dark:text-slate-350 whitespace-nowrap">
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        isTable = false;
      }
    };

    const formatInlineMarkdown = (text: string): string => {
      // Parse bold **text**
      let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Parse inline code `code`
      formatted = formatted.replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-800 dark:text-slate-200 font-mono text-[10px]">$1</code>');
      return formatted;
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Skip proposal code blocks in direct text output
      if (trimmed.startsWith('```json-proposal') || trimmed.startsWith('```')) {
        return;
      }

      // Check if inside markdown table
      if (trimmed.startsWith('|')) {
        flushList(`before-table-${index}`);
        isTable = true;
        // Parse cells split by | (filtering out leading/trailing empty values)
        const cells = line.split('|').slice(1, -1);
        tableRows.push(cells);
        return;
      } else if (isTable) {
        flushTable(`table-${index}`);
      }

      // Headers
      if (trimmed.startsWith('# ')) {
        flushList(index.toString());
        elements.push(
          <h1 key={index} className="text-sm font-bold text-slate-900 dark:text-white mt-3 mb-1.5 border-b pb-1">
            {trimmed.replace('# ', '')}
          </h1>
        );
      } else if (trimmed.startsWith('## ')) {
        flushList(index.toString());
        elements.push(
          <h2 key={index} className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2.5 mb-1">
            {trimmed.replace('## ', '')}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        flushList(index.toString());
        elements.push(
          <h3 key={index} className="text-xs font-semibold text-slate-700 dark:text-slate-350 mt-2 mb-1">
            {trimmed.replace('### ', '')}
          </h3>
        );
      } 
      // Lists
      else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        listItems.push(trimmed.substring(2));
      } 
      // Empty paragraph / newline
      else if (trimmed === '') {
        flushList(index.toString());
        elements.push(<div key={`spacer-${index}`} className="h-2" />);
      } 
      // Standard paragraph text
      else {
        flushList(index.toString());
        elements.push(
          <p
            key={index}
            className="text-xs leading-relaxed mb-1.5 text-slate-700 dark:text-slate-300"
            dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
          />
        );
      }
    });

    // Final flushes
    flushList('final');
    flushTable('final');

    return elements;
  };

  return (
    <div
      ref={panelRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800"
    >
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
          <Bot className="h-10 w-10 text-blue-500 animate-bounce" />
          <h4 className="font-semibold text-sm text-slate-800 dark:text-white">AI Fleet Operations Copilot</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[240px]">
            Query driver schedules, review vehicle alerts, or request dispatcher mutations using natural language.
          </p>
        </div>
      )}

      {messages.map((message) => {
        const isUser = message.role === 'user';
        const isSystem = message.role === 'system';

        if (isSystem) return null; // Hide system messages

        return (
          <div key={message.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {/* Avatar */}
            {!isUser && (
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Bot className="h-4 w-4" />
              </div>
            )}

            {/* Bubble */}
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs shadow-sm ${
              isUser
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-tl-none'
            }`}>
              {/* Text Render */}
              <div className="space-y-1">
                {isUser ? (
                  <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                ) : (
                  renderMessageContent(message.content)
                )}
              </div>

              {/* Action Card Render */}
              {message.actionCard && (
                <ActionCards
                  card={message.actionCard}
                  onApprove={onApproveProposal}
                  onReject={onRejectProposal}
                />
              )}
            </div>

            {/* User Avatar */}
            {isUser && (
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-650 dark:text-slate-350">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        );
      })}

      {/* Generating/Typing State indicator */}
      {loading && (
        <div className="flex gap-3 justify-start">
          <div className="flex-shrink-0 h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Bot className="h-4 w-4" />
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-2 text-slate-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
            <span>Copilot is writing...</span>
          </div>
        </div>
      )}
    </div>
  );
};
