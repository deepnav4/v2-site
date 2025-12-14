import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  type?: 'website' | 'article';
  image?: string;
  url?: string;
  article?: {
    publishedTime?: string;
    author?: string;
    tags?: string[];
  };
}

export default function SEO({
  title = 'Navdeep Singh - Software Developer & Student',
  description = 'Information Technology student at NIT Jalandhar. Building web applications, exploring algorithms, and sharing knowledge through code.',
  type = 'website',
  image = 'https://navdeep.dev/og-image.png',
  url = 'https://navdeep.dev',
  article,
}: SEOProps) {
  const fullTitle = title.includes('Navdeep Singh') ? title : `${title} | Navdeep Singh`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Article Meta Tags */}
      {type === 'article' && article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.tags?.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
