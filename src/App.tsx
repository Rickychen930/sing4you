import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from './client/components/ui/ErrorBoundary';
import { ToastContainer } from './client/components/ui/Toast';
import { LoadingSpinner } from './client/components/ui/LoadingSpinner';
import { useToastStore } from './client/stores/toastStore';
import { Layout } from './client/components/layout/Layout';
import { useAuthStore } from './client/stores/authStore';

// Lazy load public pages for better code splitting
const HomePage = lazy(() => import('./client/pages/public/HomePage').then(m => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('./client/pages/public/AboutPage').then(m => ({ default: m.AboutPage })));
const PerformancesPage = lazy(() => import('./client/pages/public/PerformancesPage').then(m => ({ default: m.PerformancesPage })));
const BlogPage = lazy(() => import('./client/pages/public/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogDetailPage = lazy(() => import('./client/pages/public/BlogDetailPage').then(m => ({ default: m.BlogDetailPage })));
const ContactPage = lazy(() => import('./client/pages/public/ContactPage').then(m => ({ default: m.ContactPage })));
const CategoriesPage = lazy(() => import('./client/pages/public/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const VariationsPage = lazy(() => import('./client/pages/public/VariationsPage').then(m => ({ default: m.VariationsPage })));
const VariationDetailPage = lazy(() => import('./client/pages/public/VariationDetailPage').then(m => ({ default: m.VariationDetailPage })));
const NotFoundPage = lazy(() => import('./client/pages/public/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Lazy load admin pages (separate chunk)
const LoginPage = lazy(() => import('./client/pages/admin/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('./client/pages/admin/DashboardPage').then(m => ({ default: m.DashboardPage })));
const HeroManagementPage = lazy(() => import('./client/pages/admin/HeroManagementPage').then(m => ({ default: m.HeroManagementPage })));
const SectionsManagementPage = lazy(() => import('./client/pages/admin/SectionsManagementPage').then(m => ({ default: m.SectionsManagementPage })));
const PerformancesManagementPage = lazy(() => import('./client/pages/admin/PerformancesManagementPage').then(m => ({ default: m.PerformancesManagementPage })));
const TestimonialsManagementPage = lazy(() => import('./client/pages/admin/TestimonialsManagementPage').then(m => ({ default: m.TestimonialsManagementPage })));
const BlogManagementPage = lazy(() => import('./client/pages/admin/BlogManagementPage').then(m => ({ default: m.BlogManagementPage })));
const SEOManagementPage = lazy(() => import('./client/pages/admin/SEOManagementPage').then(m => ({ default: m.SEOManagementPage })));
const CategoriesManagementPage = lazy(() => import('./client/pages/admin/CategoriesManagementPage').then(m => ({ default: m.CategoriesManagementPage })));
const VariationsManagementPage = lazy(() => import('./client/pages/admin/VariationsManagementPage').then(m => ({ default: m.VariationsManagementPage })));

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        checkAuth();
        // Small delay to ensure token is checked
        await new Promise(resolve => setTimeout(resolve, 100));
      } finally {
        setIsChecking(false);
      }
    };
    verifyAuth();
  }, [checkAuth]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  // Loading fallback for Suspense - memoized to prevent re-creation
  const LoadingFallback = React.useMemo(() => () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <LoadingSpinner size="lg" />
    </div>
  ), []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <ToastContainer toasts={toasts} onClose={removeToast} />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/about" element={<Layout><AboutPage /></Layout>} />
              <Route path="/performances" element={<Layout><PerformancesPage /></Layout>} />
              <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
              <Route path="/blog/:slug" element={<Layout><BlogDetailPage /></Layout>} />
              <Route path="/categories" element={<Layout><CategoriesPage /></Layout>} />
              <Route path="/categories/:categoryId" element={<Layout><VariationsPage /></Layout>} />
              <Route path="/variations/:variationId" element={<Layout><VariationDetailPage /></Layout>} />
              <Route path="/contact" element={<Layout><ContactPage /></Layout>} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/hero"
                element={
                  <PrivateRoute>
                    <HeroManagementPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/sections"
                element={
                  <PrivateRoute>
                    <SectionsManagementPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/performances"
                element={
                  <PrivateRoute>
                    <PerformancesManagementPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/testimonials"
                element={
                  <PrivateRoute>
                    <TestimonialsManagementPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/blog"
                element={
                  <PrivateRoute>
                    <BlogManagementPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/seo"
                element={
                  <PrivateRoute>
                    <SEOManagementPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <PrivateRoute>
                    <CategoriesManagementPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/variations"
                element={
                  <PrivateRoute>
                    <VariationsManagementPage />
                  </PrivateRoute>
                }
              />

              {/* Redirect unknown admin routes to dashboard */}
              <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;