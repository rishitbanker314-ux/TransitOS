import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from './button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-900 m-8">
          <AlertTriangle className="h-12 w-12 text-rose-500 mb-4" />
          <h2 className="text-2xl font-bold text-rose-700 dark:text-rose-400 mb-2">Something went wrong</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            The application encountered an unexpected error. Our engineering team has been notified.
          </p>
          <div className="bg-white dark:bg-black/50 p-4 rounded-md border text-left text-sm text-rose-600 dark:text-rose-400 font-mono overflow-auto max-w-full w-[600px] mb-6">
            {this.state.error?.message}
          </div>
          <Button onClick={() => window.location.reload()} variant="default" className="gap-2">
            <RefreshCcw className="h-4 w-4" /> Reload Application
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
