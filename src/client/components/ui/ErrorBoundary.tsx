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
          {/* Decorative background elements */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-gold-500/20 rounded-full blur-3xl animate-musical-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] bg-musical-500/20 rounded-full blur-3xl animate-musical-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <Card className="max-w-lg w-full relative z-10">
            <CardHeader className="p-5 sm:p-6 lg:p-8 text-center">
              <div className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-4 sm:mb-5 lg:mb-6 opacity-70 animate-float" aria-hidden="true">⚠️</div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-elegant font-bold text-center bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight px-4">
                Oops! Something went wrong
              </h1>
            </CardHeader>
            <CardBody className="p-5 sm:p-6 lg:p-8">
              <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-5 sm:mb-6 text-center font-light leading-relaxed">
                We apologize for the inconvenience. Please try refreshing the page or returning to the homepage.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-5 sm:mb-6">
                  <summary className="text-xs sm:text-sm text-gold-400 cursor-pointer mb-2 sm:mb-3 font-semibold hover:text-gold-300 transition-colors min-h-[32px] sm:min-h-[36px] flex items-center">
                    Error Details (Development Only)
                  </summary>
                  <pre className="text-xs sm:text-sm bg-gradient-to-br from-jazz-900/90 to-jazz-800/90 p-3 sm:p-4 rounded-lg sm:rounded-xl overflow-auto max-h-40 sm:max-h-48 border border-gold-900/40 text-gray-300 font-mono leading-relaxed">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button 
                  variant="primary" 
                  onClick={this.handleReset}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Go to Homepage
                </Button>
                <Button 
                  variant="outline" 
                  onClick={this.handleReload}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Refresh Page
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