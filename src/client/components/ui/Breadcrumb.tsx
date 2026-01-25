import React, { memo } from 'react';
import { Link } from 'react-router-dom';
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
  
  if (items.length === 0) return null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.path && { item: `${siteUrl}${item.path}` }),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav 
        className={cn('flex items-center space-x-2 text-sm sm:text-base lg:text-lg mb-5 sm:mb-7 lg:mb-9', className)}
        aria-label="Breadcrumb"
      >
      <ol className="flex items-center space-x-1.5 sm:space-x-2 lg:space-x-3">
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
                <span className="text-gold-200 font-semibold text-base sm:text-lg lg:text-xl drop-shadow-[0_0_8px_rgba(255,194,51,0.4)] leading-relaxed" aria-current="page" style={{ textShadow: '0 2px 8px rgba(255, 194, 51, 0.3)' }}>
                  {item.label}
                </span>
              ) : item.path ? (
                <Link
                  to={item.path}
                  className="text-gray-50 hover:text-gold-200 transition-all duration-300 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded px-2 sm:px-2.5 py-1.5 font-medium min-h-[36px] sm:min-h-[40px] flex items-center hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.4)] leading-relaxed"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-300/90 sm:text-gray-300 text-base sm:text-lg leading-relaxed">{item.label}</span>
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
