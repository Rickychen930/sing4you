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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-jazz-900/50 via-gold-900/40 to-musical-900/50 px-4 py-12 relative overflow-hidden">
          <Card className="max-w-md w-full">
            <CardHeader className="p-4 sm:p-6 text-center">
              <div className="text-6xl mb-4 opacity-60" aria-hidden="true">⚠️</div>
              <h1 className="text-2xl sm:text-3xl font-elegant font-bold text-center bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
                Oops! Something went wrong
              </h1>
            </CardHeader>
            <CardBody className="p-4 sm:p-6">
              <p className="text-gray-300 mb-4 text-center font-light leading-relaxed">
                We apologize for the inconvenience. Please try refreshing the page or returning to the homepage.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-4">
                  <summary className="text-sm text-jazz-600 cursor-pointer mb-2 font-medium">
                    Error Details (Development Only)
                  </summary>
                  <pre className="text-xs bg-gradient-to-br from-jazz-900/80 to-jazz-800/80 p-3 rounded-lg overflow-auto max-h-40 border border-gold-900/30 text-gray-300">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="primary" 
                  onClick={this.handleReset}
                  className="w-full sm:w-auto min-h-[44px]"
                >
                  Go to Homepage
                </Button>
                <Button 
                  variant="outline" 
                  onClick={this.handleReload}
                  className="w-full sm:w-auto min-h-[44px]"
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