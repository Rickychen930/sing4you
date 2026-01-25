import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import { ErrorBoundary } from './client/components/ui/ErrorBoundary';
import { ToastContainer } from './client/components/ui/Toast';
import { LoadingSpinner } from './client/components/ui/LoadingSpinner';
import { useToastStore } from './client/stores/toastStore';
import { Layout } from './client/components/layout/Layout';
import { useAuthStore } from './client/stores/authStore';
import { initScrollReveal } from './client/utils/scrollRevealInit';

// Lazy load public pages for better code splitting
const HomePage = lazy(() => import('./client/pages/public/HomePage'));
const AboutPage = lazy(() => import('./client/pages/public/AboutPage').then(m => ({ default: m.AboutPage })));
const PerformancesPage = lazy(() => import('./client/pages/public/PerformancesPage').then(m => ({ default: m.PerformancesPage })));
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-jazz-900/60 via-gold-900/50 to-musical-900/60">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-200 text-sm">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

// Component to handle scroll reveal initialization on route change
// Loading fallback component - declared outside render
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-jazz-900/60 via-gold-900/50 to-musical-900/60 px-4 sm:px-6 py-10 sm:py-12">
    <LoadingSpinner size="lg" />
  </div>
);

const ScrollRevealHandler: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize scroll reveal after route change - debounced
    const timer = setTimeout(() => {
      initScrollReveal();
    }, 200);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
};

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
    // Scroll reveal will be handled by ScrollRevealHandler and auto-init
    // No need to call again here to avoid duplicate calls
  }, [checkAuth]);

  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <ScrollRevealHandler />
          <ToastContainer toasts={toasts} onClose={removeToast} />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/about" element={<Layout><AboutPage /></Layout>} />
              <Route path="/performances" element={<Layout><PerformancesPage /></Layout>} />
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