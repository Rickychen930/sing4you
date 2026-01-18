import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { IBlogPost } from '../../../shared/interfaces';
import { blogService } from '../../services/blogService';
import { Card, CardBody } from '../../components/ui/Card';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { SkeletonList } from '../../components/ui/Skeleton';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { formatAustralianDate } from '../../../shared/utils/date';
import { truncate } from '../../utils/helpers';

export const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await blogService.getPublished();
        setPosts(data);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Blog' },
  ];

  return (
    <>
      <SEO
        title="Blog | Christina Sings4U"
        description="Read about music, performances, and insights from Christina Sings4U."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <SectionWrapper
        title="Blog"
        subtitle="Stories, insights, and updates"
        className="bg-gradient-to-br from-jazz-900/20 via-musical-900/15 to-jazz-800/20"
      >
        {loading ? (
          <SkeletonList count={6} />
        ) : posts.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-5xl sm:text-6xl mb-4 opacity-50">📝</div>
            <p className="text-lg sm:text-xl font-semibold text-gray-200 mb-2">No blog posts available at the moment.</p>
            <p className="text-base sm:text-lg text-gray-400">Check back soon for updates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {posts.map((post, index) => (
              <Link 
                key={post._id} 
                to={`/blog/${post.slug}`}
                className="h-full animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card hover className="h-full flex flex-col overflow-hidden">
                  {post.coverImage && (
                    <div className="relative overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-48 sm:h-56 lg:h-64 object-cover transition-all duration-500 group-hover:scale-110 border-b-2 border-gold-900/40 image-fade-in"
                        loading="lazy"
                        onLoad={(e) => {
                          e.currentTarget.classList.add('opacity-100');
                          e.currentTarget.classList.remove('opacity-0');
                        }}
                        style={{ opacity: 0 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  )}
                  <CardBody className="flex-grow p-5 sm:p-6 lg:p-7 flex flex-col">
                    <h3 className="text-xl sm:text-2xl font-elegant font-bold mb-3 line-clamp-2 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-300 bg-clip-text text-transparent">
                      {post.title}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-200 mb-5 sm:mb-6 line-clamp-3 font-normal leading-relaxed flex-grow">
                      {truncate(post.content || '', 150)}
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-auto pt-5 border-t-2 border-gold-900/50">
                      <span className="text-sm sm:text-base font-semibold bg-gradient-to-r from-gold-400 to-gold-300 bg-clip-text text-transparent">{post.category}</span>
                      {post.publishedAt && (
                        <span className="text-xs sm:text-sm text-gray-400 font-medium">{formatAustralianDate(post.publishedAt)}</span>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </SectionWrapper>
    </>
  );
};