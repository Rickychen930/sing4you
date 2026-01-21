import React, { memo, useMemo } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  author?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export const SEO: React.FC<SEOProps> = memo(({
  title = 'Christina Sings4U | Professional Singer in Sydney',
  description = 'Professional singer offering elegant live vocals for weddings, corporate events, and private occasions in Sydney, NSW.',
  image,
  url,
  type = 'website',
  keywords,
  author = 'Christina Sings4U',
  noindex = false,
  nofollow = false,
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://christina-sings4you.com.au';
  const fullUrl = useMemo(() => url || siteUrl, [url, siteUrl]);
  const ogImage = useMemo(() => image || `${siteUrl}/og-image.jpg`, [image, siteUrl]);
  const fullTitle = useMemo(() => {
    if (title.includes('|')) return title;
    return `${title} | Christina Sings4U`;
  }, [title]);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      {(noindex || nofollow) && (
        <meta name="robots" content={`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`} />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Christina Sings4U" />
      <meta property="og:locale" content="en_AU" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Additional SEO */}
      <meta name="theme-color" content="#ffc233" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Additional meta tags for better SEO */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
    </Helmet>
  );
}, (prevProps, nextProps) => {
  // Only re-render if SEO props actually change
  return (
    prevProps.title === nextProps.title &&
    prevProps.description === nextProps.description &&
    prevProps.image === nextProps.image &&
    prevProps.url === nextProps.url &&
    prevProps.type === nextProps.type &&
    prevProps.keywords === nextProps.keywords
  );
});

SEO.displayName = 'SEO';

export const JSONLDSchema: React.FC<{ schema: object }> = memo(({ schema }) => {
  const schemaString = useMemo(() => JSON.stringify(schema), [schema]);
  
  return (
    <Helmet>
      <script type="application/ld+json">{schemaString}</script>
    </Helmet>
  );
}, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.schema) === JSON.stringify(nextProps.schema);
});

JSONLDSchema.displayName = 'JSONLDSchema';