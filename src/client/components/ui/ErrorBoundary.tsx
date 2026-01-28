import React, { Component } from 'react';
import type { ReactNode } from 'react';
import { Card, CardBody, CardHeader } from './Card';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    // In production, you might want to send this to an error tracking service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
    // Use navigate instead of direct href for better UX
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-jazz-900/60 via-gold-900/50 to-musical-900/60 px-4 sm:px-6 py-10 sm:py-12 lg:py-16">
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center">
              <div className="text-5xl sm:text-6xl mb-4 sm:mb-5 lg:mb-6" aria-hidden>⚠️</div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-elegant font-bold text-center bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight px-4">
                Oops! Something went wrong
              </h1>
            </CardHeader>
            <CardBody large>
              <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-5 sm:mb-6 text-center leading-relaxed">
                We apologize for the inconvenience. Please try refreshing the page or returning to the homepage.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-5 sm:mb-6">
                  <summary 
                    className="text-xs sm:text-sm text-gold-400 cursor-pointer mb-2 sm:mb-3 font-semibold hover:text-gold-300 transition-colors min-h-[44px] sm:min-h-[48px] flex items-center focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded px-2 py-1"
                    aria-label="Toggle error details"
                  >
                    Error Details (Development Only)
                  </summary>
                  <pre className="text-xs sm:text-sm bg-gradient-to-br from-jazz-900/90 to-jazz-800/90 p-3 sm:p-4 rounded-lg sm:rounded-xl overflow-auto max-h-40 sm:max-h-48 border border-gold-900/40 text-gray-200 font-mono leading-relaxed">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button 
                  variant="primary" 
                  onClick={this.handleReset}
                  size="lg"
                  className="w-full sm:w-auto group/btn"
                >
                  <span className="flex items-center justify-center gap-2">
                    Go to Homepage
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={this.handleReload}
                  size="lg"
                  className="w-full sm:w-auto group/btn"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/btn:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Page
                  </span>
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}