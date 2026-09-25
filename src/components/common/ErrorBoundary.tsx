import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled React ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    if (this.props.onReset) {
      this.props.onReset();
      this.setState({ hasError: false, error: null, errorInfo: null });
    } else {
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  public render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error?.message || 'অপ্রত্যাশিত ত্রুটি ঘটেছে';
      const title = this.props.fallbackTitle || 'এই বিভাগটি লোড করতে সাময়িক সমস্যা হয়েছে';

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-red-200 dark:border-red-900/40 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-500">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                মোবাইল ব্রাউজার বা নেটওয়ার্ক সংযোগের কারণে সাময়িক ব্যর্থতা হতে পারে। নিচের বোতাম চেপে পুনরায় চেষ্টা করুন।
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>পুনরায় চেষ্টা করুন</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
              >
                <Home size={14} />
                <span>হোম পেইজ</span>
              </button>
            </div>

            <div className="pt-2 text-left border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={this.toggleDetails}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center justify-between w-full"
              >
                <span>কারিগরী বিবরণ (Error Details)</span>
                {this.state.showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>

              {this.state.showDetails && (
                <div className="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-[10px] text-red-600 dark:text-red-400 overflow-x-auto max-h-36">
                  <p className="font-bold">{errorMsg}</p>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="mt-1 text-slate-400 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
