import React from 'react';
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

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  if (items.length === 0) return null;

  return (
    <nav 
      className={cn('flex items-center space-x-2 text-sm sm:text-base mb-4 sm:mb-6', className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 text-gold-600/60 mx-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {isLast ? (
                <span className="text-gold-300 font-semibold" aria-current="page">
                  {item.label}
                </span>
              ) : item.path ? (
                <Link
                  to={item.path}
                  className="text-gray-400 hover:text-gold-400 transition-colors duration-300 hover:underline"
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
};
