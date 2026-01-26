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
  contactEmail?: string;
  contactPhone?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
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
  contactEmail,
  contactPhone,
  socialMedia,
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
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      
      {/* Robots */}
      {(noindex || nofollow) ? (
        <meta name="robots" content={`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`} />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Open Graph / Facebook - Optimized for Google Search Results */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Christina Sings4U" />
      <meta property="og:locale" content="en_AU" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="article:author" content="Christina Sings4U" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {socialMedia?.twitter && <meta name="twitter:site" content={socialMedia.twitter} />}
      {socialMedia?.twitter && <meta name="twitter:creator" content={socialMedia.twitter} />}
      
      {/* Social Media Links */}
      {socialMedia?.facebook && <link rel="me" href={socialMedia.facebook} />}
      {socialMedia?.twitter && <link rel="me" href={socialMedia.twitter} />}
      {socialMedia?.instagram && <link rel="me" href={socialMedia.instagram} />}
      {socialMedia?.youtube && <link rel="me" href={socialMedia.youtube} />}
      
      {/* Contact Information Meta Tags */}
      {contactEmail && <meta name="contact" content={contactEmail} />}
      {contactPhone && <meta name="telephone" content={contactPhone} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#ffc233" />
      <meta name="msapplication-TileColor" content="#ffc233" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Christina Sings4U" />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Geographic Meta Tags */}
      <meta name="geo.region" content="AU-NSW" />
      <meta name="geo.placename" content="Sydney" />
      <meta name="geo.position" content="-33.8688;151.2093" />
      <meta name="ICBM" content="-33.8688, 151.2093" />
      
      {/* Language and Content */}
      <meta httpEquiv="content-language" content="en-AU" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Professional Business Meta Tags */}
      <meta name="classification" content="Entertainment, Music, Professional Services" />
      <meta name="category" content="Professional Singer, Live Music Entertainment, Wedding Entertainment" />
      <meta name="coverage" content="Sydney, NSW, Australia" />
      <meta name="target" content="all" />
      <meta name="audience" content="all" />
      <meta name="copyright" content="Christina Sings4U" />
      
      {/* Verification Tags (add your verification codes) */}
      {/* <meta name="google-site-verification" content="your-verification-code" /> */}
      {/* <meta name="msvalidate.01" content="your-bing-verification-code" /> */}
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