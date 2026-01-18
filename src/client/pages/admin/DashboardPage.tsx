import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Layout } from '../../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/ui/SEO';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <Layout isAdmin>
      <SEO title="Admin Dashboard | Christina Sings4U" />
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-elegant font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Welcome, {user?.name || user?.email}!</p>
            </div>
            <Button variant="secondary" onClick={handleLogout} className="w-full sm:w-auto">
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card hover>
              <CardHeader className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Hero Settings</h2>
              </CardHeader>
              <CardBody className="p-4 sm:p-6">
                <p className="text-sm sm:text-base text-gray-600 mb-4">Manage hero section content and CTA buttons.</p>
                <Link to="/admin/hero">
                  <Button variant="primary" size="sm" className="w-full">
                    Manage Hero
                  </Button>
                </Link>
              </CardBody>
            </Card>

            <Card hover>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Sections</h2>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600 mb-4">Manage performance sections (Solo, Duo, etc.).</p>
                <Link to="/admin/sections">
                  <Button variant="primary" size="sm" className="w-full">
                    Manage Sections
                  </Button>
                </Link>
              </CardBody>
            </Card>

            <Card hover>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Performances</h2>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600 mb-4">Manage upcoming performances and events.</p>
                <Link to="/admin/performances">
                  <Button variant="primary" size="sm" className="w-full">
                    Manage Performances
                  </Button>
                </Link>
              </CardBody>
            </Card>

            <Card hover>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Testimonials</h2>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600 mb-4">Manage client testimonials.</p>
                <Link to="/admin/testimonials">
                  <Button variant="primary" size="sm" className="w-full">
                    Manage Testimonials
                  </Button>
                </Link>
              </CardBody>
            </Card>

            <Card hover>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Blog</h2>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600 mb-4">Manage blog posts and articles.</p>
                <Link to="/admin/blog">
                  <Button variant="primary" size="sm" className="w-full">
                    Manage Blog
                  </Button>
                </Link>
              </CardBody>
            </Card>

            <Card hover>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">SEO Settings</h2>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600 mb-4">Manage SEO metadata and settings.</p>
                <Link to="/admin/seo">
                  <Button variant="primary" size="sm" className="w-full">
                    Manage SEO
                  </Button>
                </Link>
              </CardBody>
            </Card>

            <Card hover>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600 mb-4">Manage performance categories (Solo, Duo, PocketRocker, etc.).</p>
                <Link to="/admin/categories">
                  <Button variant="primary" size="sm" className="w-full">
                    Manage Categories
                  </Button>
                </Link>
              </CardBody>
            </Card>

            <Card hover>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Variations</h2>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600 mb-4">Manage variations/personas within categories.</p>
                <Link to="/admin/variations">
                  <Button variant="primary" size="sm" className="w-full">
                    Manage Variations
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};