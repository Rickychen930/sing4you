import React, { memo, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/helpers';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = memo(({ items, className }) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://christina-sings4you.com.au';
  const location = useLocation();

  const breadcrumbSchema = useMemo(() => {
    if (items.length === 0) return null;
    const currentPath = location.pathname;
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => {
        const itemUrl = item.path
          ? `${siteUrl}${item.path}`
          : index === items.length - 1
            ? `${siteUrl}${currentPath}`
            : undefined;
        return {
          '@type': 'ListItem',
          position: index + 1,
          name: item.label,
          ...(itemUrl && { item: itemUrl }),
        };
      }),
    };
  }, [items, siteUrl, location.pathname]);

  if (items.length === 0) return null;

  return (
    <>
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <nav
        className={cn('flex items-center space-x-2 text-sm sm:text-base lg:text-lg mb-5 sm:mb-7 lg:mb-9 relative', className)}
        aria-label="Breadcrumb"
      >
        {/* Subtle decorative accent */}
        <div className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 w-1 h-6 sm:h-8 bg-gradient-to-b from-gold-500/40 via-gold-400/30 to-transparent rounded-full opacity-60" aria-hidden="true" />
        <ol className="flex items-center space-x-1.5 sm:space-x-2 lg:space-x-3 relative z-10">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gold-600/80 sm:text-gold-600/70 mx-1.5 sm:mx-2 lg:mx-3 transition-colors duration-300 flex-shrink-0 drop-shadow-[0_0_8px_rgba(255,194,51,0.4)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {isLast ? (
                <span className="text-gold-200 font-semibold text-base sm:text-lg lg:text-xl drop-shadow-[0_0_8px_rgba(255,194,51,0.4)] leading-relaxed breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              ) : item.path ? (
                <Link
                  to={item.path}
                  className="text-gray-200 hover:text-gold-200 transition-all duration-300 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded px-2 sm:px-2.5 py-1.5 font-medium min-h-[44px] sm:min-h-[48px] flex items-center hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.35)] leading-relaxed touch-manipulation"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-200 text-base sm:text-lg font-sans leading-relaxed">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
    </>
  );
}, (prevProps, nextProps) => {
  if (prevProps.items.length !== nextProps.items.length) return false;
  return prevProps.items.every((item, index) => 
    item.label === nextProps.items[index]?.label &&
    item.path === nextProps.items[index]?.path
  ) && prevProps.className === nextProps.className;
});

Breadcrumb.displayName = 'Breadcrumb';
