import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Layout } from '../../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/ui/SEO';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { categoryService } from '../../services/categoryService';
import { performanceService } from '../../services/performanceService';
import { testimonialService } from '../../services/testimonialService';
import { variationService } from '../../services/variationService';
import { sectionService } from '../../services/sectionService';

interface DashboardItem {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: string;
  category: 'content' | 'settings' | 'management';
  count?: number;
}

interface DashboardStats {
  categories: number;
  performances: number;
  testimonials: number;
  variations: number;
  sections: number;
}

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'content' | 'settings' | 'management'>('all');
  const [stats, setStats] = useState<DashboardStats>({
    categories: 0,
    performances: 0,
    testimonials: 0,
    variations: 0,
    sections: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  // Load statistics
  useEffect(() => {
    const loadStats = async () => {
      try {
        const [categories, performances, testimonials, variations, sections] = await Promise.allSettled([
          categoryService.getAll().catch((error) => {
            if (process.env.NODE_ENV === 'development') {
              console.error('Error loading categories:', error);
            }
            return [];
          }),
          performanceService.getAll().catch((error) => {
            if (process.env.NODE_ENV === 'development') {
              console.error('Error loading performances:', error);
            }
            return [];
          }),
          testimonialService.getAll().catch((error) => {
            if (process.env.NODE_ENV === 'development') {
              console.error('Error loading testimonials:', error);
            }
            return [];
          }),
          variationService.getAll().catch((error) => {
            if (process.env.NODE_ENV === 'development') {
              console.error('Error loading variations:', error);
            }
            return [];
          }),
          sectionService.getAll().catch((error) => {
            if (process.env.NODE_ENV === 'development') {
              console.error('Error loading sections:', error);
            }
            return [];
          }),
        ]);

        setStats({
          categories: categories.status === 'fulfilled' ? categories.value.length : 0,
          performances: performances.status === 'fulfilled' ? performances.value.length : 0,
          testimonials: testimonials.status === 'fulfilled' ? testimonials.value.length : 0,
          variations: variations.status === 'fulfilled' ? variations.value.length : 0,
          sections: sections.status === 'fulfilled' ? sections.value.length : 0,
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading dashboard stats:', error);
        }
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, []);

  const dashboardItems: DashboardItem[] = useMemo(() => [
    { id: 'hero', title: 'Hero Settings', description: 'Manage hero section content and CTA buttons', path: '/admin/hero', icon: '🏠', category: 'content' },
    { id: 'sections', title: 'Sections', description: 'Manage performance sections (Solo, Duo, etc.)', path: '/admin/sections', icon: '📋', category: 'content', count: stats.sections },
    { id: 'performances', title: 'Performances', description: 'Manage upcoming performances and events', path: '/admin/performances', icon: '🎭', category: 'content', count: stats.performances },
    { id: 'testimonials', title: 'Testimonials', description: 'Manage client testimonials', path: '/admin/testimonials', icon: '💬', category: 'content', count: stats.testimonials },
    { id: 'categories', title: 'Categories', description: 'Manage performance categories', path: '/admin/categories', icon: '📂', category: 'management', count: stats.categories },
    { id: 'variations', title: 'Variations', description: 'Manage variations/personas within categories', path: '/admin/variations', icon: '🎨', category: 'management', count: stats.variations },
    { id: 'seo', title: 'SEO Settings', description: 'Manage SEO metadata and settings', path: '/admin/seo', icon: '🔍', category: 'settings' },
  ], [stats]);

  const filteredItems = useMemo(() => {
    return dashboardItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [dashboardItems, searchQuery, selectedCategory]);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        searchInput?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogoutClick = () => {
    setLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    await logout();
    navigate('/admin/login');
    setLogoutConfirm(false);
  };

  const handleLogoutCancel = () => {
    setLogoutConfirm(false);
  };

  return (
    <Layout isAdmin>
      <SEO title="Admin Dashboard | Christina Sings4U" />
      <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-300 mt-1 sm:mt-2">
                Welcome back, <span className="text-gold-400 font-semibold">{user?.name || user?.email}</span>!
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Link to="/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="w-full sm:w-auto group">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Site
                  </span>
                </Button>
              </Link>
              <Button variant="secondary" onClick={handleLogoutClick} size="sm" className="w-full sm:w-auto">
                Logout
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          {loadingStats ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="bg-gradient-to-br from-jazz-800/85 via-jazz-900/90 to-musical-900/85 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden p-4 sm:p-6 border border-gold-900/50 backdrop-blur-md">
                    <div className="h-6 sm:h-8 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-3 w-2/3 mx-auto animate-pulse-soft skeleton-shimmer"></div>
                    <div className="h-8 sm:h-12 bg-gradient-to-r from-gold-800/50 via-gold-900/50 to-gold-800/50 rounded-lg w-1/2 mx-auto animate-pulse-soft skeleton-shimmer"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Card hover className="text-center transition-all duration-300 hover:scale-105">
                <CardBody className="p-4">
                  <div className="text-2xl sm:text-3xl mb-2 transition-transform duration-300 hover:scale-110">🎭</div>
                  <div className="text-lg sm:text-xl font-bold text-gold-400">{stats.performances}</div>
                  <div className="text-xs sm:text-sm text-gray-400 mt-1">Performances</div>
                </CardBody>
              </Card>
              <Card hover className="text-center transition-all duration-300 hover:scale-105">
                <CardBody className="p-4">
                  <div className="text-2xl sm:text-3xl mb-2 transition-transform duration-300 hover:scale-110">💬</div>
                  <div className="text-lg sm:text-xl font-bold text-gold-400">{stats.testimonials}</div>
                  <div className="text-xs sm:text-sm text-gray-400 mt-1">Testimonials</div>
                </CardBody>
              </Card>
              <Card hover className="text-center transition-all duration-300 hover:scale-105">
                <CardBody className="p-4">
                  <div className="text-2xl sm:text-3xl mb-2 transition-transform duration-300 hover:scale-110">📂</div>
                  <div className="text-lg sm:text-xl font-bold text-gold-400">{stats.categories}</div>
                  <div className="text-xs sm:text-sm text-gray-400 mt-1">Categories</div>
                </CardBody>
              </Card>
              <Card hover className="text-center transition-all duration-300 hover:scale-105">
                <CardBody className="p-4">
                  <div className="text-2xl sm:text-3xl mb-2 transition-transform duration-300 hover:scale-110">🎨</div>
                  <div className="text-lg sm:text-xl font-bold text-gold-400">{stats.variations}</div>
                  <div className="text-xs sm:text-sm text-gray-400 mt-1">Variations</div>
                </CardBody>
              </Card>
              <Card hover className="text-center transition-all duration-300 hover:scale-105">
                <CardBody className="p-4">
                  <div className="text-2xl sm:text-3xl mb-2 transition-transform duration-300 hover:scale-110">📋</div>
                  <div className="text-lg sm:text-xl font-bold text-gold-400">{stats.sections}</div>
                  <div className="text-xs sm:text-sm text-gray-400 mt-1">Sections</div>
                </CardBody>
              </Card>
            </div>
          )}

          {/* Search and Filter Section */}
          <div className="mb-6 sm:mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Input
                  type="search"
                  placeholder="Search dashboard items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10"
                />
                <div className="absolute right-3 top-[2.75rem] flex items-center gap-1 text-xs text-gray-400 pointer-events-none">
                  <kbd className="px-1.5 py-0.5 bg-jazz-900/50 border border-gold-900/30 rounded text-gold-400 font-mono">
                    {typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
                  </kbd>
                  <span className="text-gray-400">+</span>
                  <kbd className="px-1.5 py-0.5 bg-jazz-900/50 border border-gold-900/30 rounded text-gold-400 font-mono">K</kbd>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'content', 'management', 'settings'] as const).map((cat) => {
                  const categoryCount = cat === 'all' 
                    ? dashboardItems.length 
                    : dashboardItems.filter(item => item.category === cat).length;
                  return (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                      className="capitalize transition-all duration-200"
                    >
                      <span className="flex items-center gap-1.5">
                        {cat === 'all' ? 'All' : cat}
                        {selectedCategory === cat && (
                          <span className="px-1.5 py-0.5 bg-gold-500/20 rounded text-xs font-semibold">
                            {categoryCount}
                          </span>
                        )}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
            {searchQuery && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Found <span className="text-gold-400 font-semibold">{filteredItems.length}</span> item{filteredItems.length !== 1 ? 's' : ''}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSearchQuery('')}
                  className="text-xs"
                >
                  Clear
                </Button>
              </div>
            )}
          </div>

          {/* Dashboard Grid */}
          {filteredItems.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12 sm:py-16">
                <div className="text-6xl sm:text-7xl mb-4 opacity-50 animate-pulse-soft">🔍</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-200 mb-2">No items found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search or filter</p>
                <Button 
                  variant="outline" 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="group"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Clear Filters
                  </span>
                </Button>
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredItems.map((item, index) => (
                <Card 
                  key={item.id} 
                  hover
                  className="card-entrance"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-3xl sm:text-4xl" role="img" aria-label={item.title}>
                          {item.icon}
                        </span>
                        <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
                          {item.title}
                        </h2>
                      </div>
                      {item.count !== undefined && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gold-900/30 border border-gold-700/50 rounded-full">
                          <span className="text-xs sm:text-sm font-bold text-gold-300">{item.count}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardBody className="p-4 sm:p-6">
                    <p className="text-sm sm:text-base text-gray-300 mb-4 min-h-[3rem]">
                      {item.description}
                    </p>
                    <Link to={item.path} className="block group/link">
                      <Button variant="primary" size="sm" className="w-full group">
                        <span className="flex items-center justify-center gap-2">
                          <span>Manage</span>
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </Button>
                    </Link>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
          
          {/* Quick Actions Section */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gold-900/40">
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <span className="text-gold-400">⚡</span>
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <Link to="/admin/performances" className="block">
                  <Card hover className="h-full">
                    <CardBody className="p-4 text-center">
                      <div className="text-2xl mb-2">🎭</div>
                      <div className="text-sm font-medium text-gray-200">Add Performance</div>
                    </CardBody>
                  </Card>
                </Link>
                <Link to="/admin/testimonials" className="block">
                  <Card hover className="h-full">
                    <CardBody className="p-4 text-center">
                      <div className="text-2xl mb-2">💬</div>
                      <div className="text-sm font-medium text-gray-200">Add Testimonial</div>
                    </CardBody>
                  </Card>
                </Link>
                <Link to="/admin/categories" className="block">
                  <Card hover className="h-full">
                    <CardBody className="p-4 text-center">
                      <div className="text-2xl mb-2">📂</div>
                      <div className="text-sm font-medium text-gray-200">New Category</div>
                    </CardBody>
                  </Card>
                </Link>
              </div>
            </div>

            {/* Footer Tips */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gold-900/30">
              <div className="text-sm text-gray-400">
                <p className="flex items-center gap-2">
                  <span className="text-gold-400">💡</span>
                  Quick tip: Use search to quickly find what you need
                </p>
              </div>
              <div className="flex gap-2 text-sm items-center">
                <span className="text-gray-400">Press</span>
                <kbd className="px-2 py-1 bg-jazz-900/50 border border-gold-900/30 rounded text-gold-400 font-mono text-xs">
                  {typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
                </kbd>
                <span className="text-gray-400">+</span>
                <kbd className="px-2 py-1 bg-jazz-900/50 border border-gold-900/30 rounded text-gold-400 font-mono text-xs">K</kbd>
                <span className="text-gray-400">to search</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={logoutConfirm}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        variant="info"
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </Layout>
  );
};