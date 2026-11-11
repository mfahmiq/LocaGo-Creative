import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="pt-32 pb-24 px-6 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
            {this.props.fallbackTitle || 'Halaman Sedang Memuat Ulang'}
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
            Terjadi kendala sesaat saat merender data. Silakan klik tombol di bawah untuk memuat ulang data terbaru.
          </p>
          <button
            onClick={this.handleReload}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Muat Ulang Halaman</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
