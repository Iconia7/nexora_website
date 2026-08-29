import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://nexoracreatives.co.ke';
const DEFAULT_IMAGE = `${SITE_URL}/ncs.png`;
const SITE_NAME = 'Nexora Creative Solutions';

export default function SEO({
  title = 'Nexora Creative Solutions | Best Web Design & App Development in Kenya',
  description = 'Nexora Creative Solutions is a premier technology and digital agency in Kenya specializing in Custom Mobile Apps, Responsive Web Design, and Digital Branding.',
  url = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  keywords = 'Nexora, Nexora Creative Solutions, web design Kenya, mobile app development Nairobi, software company Thika, tech agency Kenya',
  author = 'Nexora Creative Solutions',
  publishedTime,
  modifiedTime,
  noindex = false,
  breadcrumbs = null,
  schema = null,
}) {
  const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`;
  const fullImageUrl = image.startsWith('http') ? image : `${SITE_URL}${image.startsWith('/') ? image : `/${image}`}`;

  // Formulate BreadcrumbList schema if provided
  let breadcrumbsSchema = null;
  if (breadcrumbs && Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
    breadcrumbsSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.item.startsWith('http') ? crumb.item : `${SITE_URL}${crumb.item.startsWith('/') ? crumb.item : `/${crumb.item}`}`,
      })),
    };
  }

  // Combine schemas
  const schemasToRender = [];
  if (breadcrumbsSchema) {
    schemasToRender.push(breadcrumbsSchema);
  }
  if (schema) {
    if (Array.isArray(schema)) {
      schemasToRender.push(...schema);
    } else {
      schemasToRender.push(schema);
    }
  }

  const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords;

  return (
    <Helmet>
      {/* 1. Standard Metadata */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywordsString && <meta name="keywords" content={keywordsString} />}
      <meta name="author" content={author} />
      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}
      />

      {/* 2. Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* 3. Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && type === 'article' && <meta property="article:author" content={author} />}

      {/* 4. Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:site" content="@newtondesigns_" />
      <meta name="twitter:creator" content="@newtondesigns_" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={title} />

      {/* 5. Dynamic JSON-LD Structured Data */}
      {schemasToRender.map((s, idx) => (
        <script key={`schema-${idx}`} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}