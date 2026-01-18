import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { IBlogPost } from '../../../shared/interfaces';
import { blogService } from '../../services/blogService';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Button } from '../../components/ui/Button';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { BackButton } from '../../components/ui/BackButton';
import { formatAustralianDate } from '../../../shared/utils/date';
import { truncate } from '../../utils/helpers';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<IBlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;

      try {
        const data = await blogService.getBySlug(slug);
        setPost(data);
      } catch (error) {
        console.error('Error loading blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <SectionWrapper className="pt-8 bg-gradient-to-br from-jazz-900/20 via-gold-900/15 to-jazz-900/20">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </SectionWrapper>
    );
  }

  if (!post) {
    return (
      <SectionWrapper className="pt-8 sm:pt-12 bg-gradient-to-br from-jazz-900/20 via-gold-900/15 to-jazz-900/20">
        <div className="text-center py-12 sm:py-16">
          <div className="text-6xl sm:text-7xl mb-4 opacity-50">📄</div>
          <h2 className="text-2xl sm:text-3xl font-elegant font-bold text-gray-200 mb-3">Blog post not found</h2>
          <p className="text-base sm:text-lg text-gray-400 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog" className="inline-block">
            <Button variant="primary" size="lg">
              Back to Blog
            </Button>
          </Link>
        </div>
      </SectionWrapper>
    );
  }

  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://christinasings4u.com.au';

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Blog', path: '/blog' },
    { label: post.title },
  ];

  return (
    <>
      <SEO
        title={`${post.title} | Christina Sings4U Blog`}
        description={truncate(post.content, 160)}
        image={post.coverImage}
        url={`${siteUrl}/blog/${post.slug}`}
        type="article"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <Breadcrumb items={breadcrumbItems} />
          <BackButton to="/blog" />
        </div>
      </div>
      <SectionWrapper className="bg-gradient-to-br from-jazz-900/20 via-gold-900/15 to-jazz-900/20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6">
          {post.coverImage && (
            <div className="mb-8 sm:mb-10 rounded-2xl overflow-hidden shadow-2xl border-2 border-gold-900/40">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover image-fade-in"
                loading="eager"
                onLoad={(e) => {
                  e.currentTarget.classList.add('opacity-100');
                  e.currentTarget.classList.remove('opacity-0');
                }}
                style={{ opacity: 0 }}
              />
            </div>
          )}
          <header className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-elegant font-bold mb-5 sm:mb-6 leading-tight bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-300 pb-6 sm:pb-8 border-b-2 border-gold-900/40">
              <span className="px-4 py-2 bg-gradient-to-r from-gold-900/50 to-gold-800/50 text-gold-300 rounded-full text-sm sm:text-base font-semibold border border-gold-900/60">
                {post.category}
              </span>
              {post.publishedAt && (
                <span className="text-gray-400 font-medium flex items-center gap-2">
                  <span>📅</span>
                  <span>{formatAustralianDate(post.publishedAt)}</span>
                </span>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-gradient-to-r from-musical-900/50 to-musical-800/50 text-musical-300 rounded-full text-xs sm:text-sm font-medium border border-musical-900/60 hover:border-musical-700/80 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>
          <div
            className="prose prose-lg max-w-none text-gray-200 prose-headings:text-gold-200 prose-a:text-gold-400 prose-strong:text-gold-300 prose-code:text-gold-400"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </SectionWrapper>
    </>
  );
};