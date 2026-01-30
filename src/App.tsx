import React, { useEffect, useState, Suspense, lazy, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import { ErrorBoundary } from './client/components/ui/ErrorBoundary';
import { ToastContainer } from './client/components/ui/Toast';
import { LoadingSpinner } from './client/components/ui/LoadingSpinner';
import { useToastStore } from './client/stores/toastStore';
import { Layout } from './client/components/layout/Layout';
import { useAuthStore } from './client/stores/authStore';
import { initScrollRevealWithFallback } from './client/utils/scrollRevealInit';

// Lazy load public pages for better code splitting
const HomePage = lazy(() => import('./client/pages/public/HomePage'));
const AboutPage = lazy(() => import('./client/pages/public/AboutPage').then(m => ({ default: m.AboutPage })));
const PerformancesPage = lazy(() => 
  import('./client/pages/public/PerformancesPage')
    .then(m => ({ default: m.PerformancesPage }))
    .catch((error) => {
      console.error('Failed to load PerformancesPage:', error);
      return { default: () => <div>Failed to load page. Please refresh.</div> };
    })
);
const PerformanceDetailPage = lazy(() => import('./client/pages/public/PerformanceDetailPage').then(m => ({ default: m.PerformanceDetailPage })));
const ContactPage = lazy(() => import('./client/pages/public/ContactPage').then(m => ({ default: m.ContactPage })));
const FAQPage = lazy(() => import('./client/pages/public/FAQPage').then(m => ({ default: m.FAQPage })));
const PrivacyPolicyPage = lazy(() => import('./client/pages/public/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import('./client/pages/public/TermsOfServicePage').then(m => ({ default: m.TermsOfServicePage })));
const CategoriesPage = lazy(() => import('./client/pages/public/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const VariationsPage = lazy(() => 
  import('./client/pages/public/VariationsPage')
    .then(m => ({ default: m.VariationsPage }))
    .catch((error) => {
      console.error('Failed to load VariationsPage:', error);
      // Return a fallback component
      return { default: () => <div>Failed to load page. Please refresh.</div> };
    })
);
const VariationDetailPage = lazy(() => import('./client/pages/public/VariationDetailPage').then(m => ({ default: m.VariationDetailPage })));
const NotFoundPage = lazy(() => import('./client/pages/public/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Lazy load admin pages (separate chunk)
const LoginPage = lazy(() => import('./client/pages/admin/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('./client/pages/admin/DashboardPage').then(m => ({ default: m.DashboardPage })));
const HeroManagementPage = lazy(() => import('./client/pages/admin/HeroManagementPage').then(m => ({ default: m.HeroManagementPage })));
const AboutManagementPage = lazy(() => import('./client/pages/admin/AboutManagementPage').then(m => ({ default: m.AboutManagementPage })));
const PerformancesManagementPage = lazy(() => import('./client/pages/admin/PerformancesManagementPage').then(m => ({ default: m.PerformancesManagementPage })));
const TestimonialsManagementPage = lazy(() => import('./client/pages/admin/TestimonialsManagementPage').then(m => ({ default: m.TestimonialsManagementPage })));
const FAQManagementPage = lazy(() => import('./client/pages/admin/FAQManagementPage').then(m => ({ default: m.FAQManagementPage })));
const SEOManagementPage = lazy(() => import('./client/pages/admin/SEOManagementPage').then(m => ({ default: m.SEOManagementPage })));
const CategoriesAndVariationsManagementPage = lazy(() => import('./client/pages/admin/CategoriesAndVariationsManagementPage').then(m => ({ default: m.CategoriesAndVariationsManagementPage })));
const ClientsManagementPage = lazy(() => import('./client/pages/admin/ClientsManagementPage').then(m => ({ default: m.ClientsManagementPage })));
const ClientDetailPage = lazy(() => import('./client/pages/admin/ClientDetailPage').then(m => ({ default: m.ClientDetailPage })));
const InvoicesManagementPage = lazy(() => import('./client/pages/admin/InvoicesManagementPage').then(m => ({ default: m.InvoicesManagementPage })));

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [isChecking, setIsChecking] = useState(true);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    // OPTIMIZED: Only check auth once - no need to re-check repeatedly for portfolio
    if (!hasCheckedRef.current) {
      const verifyAuth = async () => {
        try {
          checkAuth();
          // Small delay to ensure token is checked
          await new Promise(resolve => setTimeout(resolve, 100));
        } finally {
          setIsChecking(false);
          hasCheckedRef.current = true;
        }
      };
      verifyAuth();
    } else {
      setIsChecking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only check once on mount

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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear any existing timer to prevent accumulation
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      initScrollRevealWithFallback();
      timerRef.current = null;
    }, 100); // Reduced from 200ms to 100ms

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [location.pathname]);

  return null;
};

function App() {
  // OPTIMIZED: Use selector to get stable reference - checkAuth is stable from Zustand
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const hasCheckedAuthRef = useRef(false);

  useEffect(() => {
    // OPTIMIZED: Only check auth once on mount for portfolio (no need to check repeatedly)
    if (!hasCheckedAuthRef.current) {
      checkAuth();
      hasCheckedAuthRef.current = true;
    }
    // Scroll reveal will be handled by ScrollRevealHandler and auto-init
    // No need to call again here to avoid duplicate calls
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

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
              {/* Public routes – Layout stays mounted (no remount/refresh on nav) */}
              <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="performances" element={<PerformancesPage />} />
                <Route path="performances/:performanceId" element={<PerformanceDetailPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="categories/:categoryId" element={<VariationsPage />} />
                <Route path="variations/:variationId" element={<VariationDetailPage />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="privacy" element={<PrivacyPolicyPage />} />
                <Route path="terms" element={<TermsOfServicePage />} />
                <Route path="contact" element={<ContactPage />} />
              </Route>

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
                path="/admin/about"
                element={
                  <PrivateRoute>
                    <AboutManagementPage />
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
                path="/admin/faq"
                element={
                  <PrivateRoute>
                    <FAQManagementPage />
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
                    <CategoriesAndVariationsManagementPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/clients"
                element={
                  <PrivateRoute>
                    <ClientsManagementPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/clients/:id"
                element={
                  <PrivateRoute>
                    <ClientDetailPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/invoices"
                element={
                  <PrivateRoute>
                    <InvoicesManagementPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/variations"
                element={
                  <PrivateRoute>
                    <Navigate to="/admin/categories" replace />
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