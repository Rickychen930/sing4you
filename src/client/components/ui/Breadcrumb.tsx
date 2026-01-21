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
  if (items.length === 0) return null;

  return (
    <nav 
      className={cn('flex items-center space-x-2 text-sm sm:text-base mb-6 sm:mb-8', className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2 sm:space-x-3">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gold-600/70 mx-2 sm:mx-3 transition-colors duration-300"
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
                <span className="text-gold-300 font-semibold text-base sm:text-lg" aria-current="page">
                  {item.label}
                </span>
              ) : item.path ? (
                <Link
                  to={item.path}
                  className="text-gray-300 hover:text-gold-400 transition-all duration-300 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded px-2 py-1 font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-400">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}, (prevProps, nextProps) => {
  if (prevProps.items.length !== nextProps.items.length) return false;
  return prevProps.items.every((item, index) => 
    item.label === nextProps.items[index]?.label &&
    item.path === nextProps.items[index]?.path
  ) && prevProps.className === nextProps.className;
});

Breadcrumb.displayName = 'Breadcrumb';
