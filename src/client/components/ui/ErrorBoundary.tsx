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
    console.error('ErrorBoundary caught an error:', error, errorInfo);
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-jazz-900/60 via-gold-900/50 to-musical-900/60 px-4 py-12 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold-500/20 rounded-full blur-3xl animate-musical-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-musical-500/20 rounded-full blur-3xl animate-musical-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <Card className="max-w-lg w-full relative z-10">
            <CardHeader className="p-6 sm:p-8 text-center">
              <div className="text-7xl sm:text-8xl mb-6 opacity-70 animate-float" aria-hidden="true">⚠️</div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-elegant font-bold text-center bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight">
                Oops! Something went wrong
              </h1>
            </CardHeader>
            <CardBody className="p-6 sm:p-8">
              <p className="text-base sm:text-lg text-gray-200 mb-6 text-center font-light leading-relaxed">
                We apologize for the inconvenience. Please try refreshing the page or returning to the homepage.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6">
                  <summary className="text-sm text-gold-400 cursor-pointer mb-3 font-semibold hover:text-gold-300 transition-colors">
                    Error Details (Development Only)
                  </summary>
                  <pre className="text-xs bg-gradient-to-br from-jazz-900/90 to-jazz-800/90 p-4 rounded-xl overflow-auto max-h-48 border border-gold-900/40 text-gray-300 font-mono leading-relaxed">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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