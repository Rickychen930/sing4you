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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-jazz-900/60 via-gold-900/50 to-musical-900/60 px-4 sm:px-6 py-10 sm:py-12 lg:py-16 relative overflow-hidden">
          {/* Enhanced decorative background elements */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.12] sm:opacity-10">
            <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-gold-500/25 rounded-full blur-2xl animate-musical-pulse shadow-[0_0_60px_rgba(255,194,51,0.3)]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] bg-musical-500/25 rounded-full blur-2xl animate-musical-pulse shadow-[0_0_60px_rgba(168,85,247,0.3)] error-boundary-pulse-1"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-56 sm:h-56 bg-gold-500/12 rounded-full blur-2xl animate-musical-pulse shadow-[0_0_40px_rgba(255,194,51,0.15)] error-boundary-pulse-2" aria-hidden />
          </div>
          <div className="absolute inset-0 pointer-events-none opacity-[0.08] sm:opacity-[0.06]" aria-hidden>
            <span className="absolute top-10 left-10 text-4xl sm:text-5xl lg:text-6xl text-gold-400/30 font-musical animate-float">♪</span>
            <span className="absolute bottom-10 right-10 text-3xl sm:text-4xl lg:text-5xl text-musical-400/30 font-musical animate-float error-boundary-musical-note">♫</span>
          </div>
          
          <Card className="max-w-lg w-full relative z-10 hover">
            <CardHeader className="text-center">
              <div className="relative inline-block mb-4 sm:mb-5 lg:mb-6">
                <div className="absolute -inset-4 bg-gold-500/20 rounded-full blur-2xl opacity-60 animate-pulse" aria-hidden />
                <div className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl relative opacity-80 sm:opacity-70 animate-float error-boundary-icon" aria-hidden>⚠️</div>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-elegant font-bold text-center bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight px-4 error-boundary-title">
                Oops! Something went wrong
              </h1>
            </CardHeader>
            <CardBody large>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-5 sm:mb-6 text-center font-light leading-relaxed error-boundary-message">
                We apologize for the inconvenience. Please try refreshing the page or returning to the homepage.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-5 sm:mb-6">
                  <summary className="text-xs sm:text-sm text-gold-400 cursor-pointer mb-2 sm:mb-3 font-semibold hover:text-gold-300 transition-colors min-h-[32px] sm:min-h-[36px] flex items-center">
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