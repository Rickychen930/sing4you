import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Layout } from '../../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { BackButton } from '../../components/ui/BackButton';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const hasRedirected = useRef(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Load saved email from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('admin_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Auto-focus email input on mount
  useEffect(() => {
    if (!isCheckingAuth && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [isCheckingAuth]);

  // Check authentication status on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        checkAuth();
        // Small delay to ensure state is updated
        await new Promise(resolve => setTimeout(resolve, 100));
      } finally {
        setIsCheckingAuth(false);
      }
    };
    verifyAuth();
  }, [checkAuth]);

  // Redirect if already authenticated (only once)
  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, isCheckingAuth, navigate]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Invalid email format');
      return;
    }

    setIsLoading(true);

    try {
      await login({ email: email.trim(), password });
      
      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem('admin_email', email.trim());
      } else {
        localStorage.removeItem('admin_email');
      }
      
      // Small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      // Navigate after successful login
      navigate('/admin/dashboard', { replace: true });
    } catch (err: unknown) {
      // Handle different error formats
      let errorMessage = 'Login failed. Please try again.';
      
      if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      } else if (err && typeof err === 'object') {
        const errorObj = err as { response?: { data?: { error?: string } }; message?: string };
        if (errorObj.response?.data?.error) {
          errorMessage = errorObj.response.data.error;
        } else if (errorObj.message) {
          errorMessage = errorObj.message;
        }
      }
      
      setError(errorMessage);
      // Clear password on error
      setPassword('');
      // Focus back on email input
      emailInputRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  }, [email, password, rememberMe, login, navigate]);

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <Layout isAdmin>
        <SEO title="Admin Login | Christina Sings4U" />
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-200 text-sm">Checking authentication...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isAdmin>
      <SEO title="Admin Login | Christina Sings4U" />
      <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <BackButton to="/" label="Back to Home" />
          </div>

          {/* Login Card */}
          <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
            <Card className="w-full max-w-md shadow-2xl relative">
              <CardHeader className="p-6 sm:p-8 text-center border-b border-gold-900/40">
                <h1 className="text-2xl sm:text-3xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
                  Admin Login
                </h1>
                <p className="mt-2 text-sm sm:text-base text-gray-300">
                  Access the administration panel
                </p>
              </CardHeader>
              <CardBody className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate>
                  {error && (
                    <div className="p-4 bg-red-900/50 border-2 border-red-700/50 text-red-100 rounded-xl text-sm sm:text-base flex items-start gap-3 backdrop-blur-sm animate-fade-in">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="flex-1">{error}</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Input
                      ref={emailInputRef}
                      label="Email"
                      type="email"
                      name="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@example.com"
                      disabled={isLoading}
                      autoComplete="email"
                      error={error && !password ? error : undefined}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={isLoading}
                        autoComplete="current-password"
                        error={error && password ? error : undefined}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isLoading) {
                            e.preventDefault();
                            const form = e.currentTarget.closest('form');
                            if (form) {
                              form.requestSubmit();
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-[2.75rem] text-gray-400 hover:text-gold-400 transition-colors duration-200 focus:outline-none focus:text-gold-500"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        tabIndex={0}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={isLoading}
                        className="w-4 h-4 rounded border-gold-900/50 bg-jazz-900/70 text-gold-500 focus:ring-gold-500 focus:ring-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">Remember me</span>
                    </label>
                  </div>
                  <Button 
                    type="submit" 
                    isLoading={isLoading} 
                    className="w-full" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Login'}
                  </Button>
                  <p className="text-xs text-center text-gray-400 mt-4">
                    Press <kbd className="px-2 py-1 bg-jazz-900/50 border border-gold-900/30 rounded text-gold-400">Enter</kbd> to login
                  </p>
                </form>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};