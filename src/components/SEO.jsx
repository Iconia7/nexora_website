import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useCompany } from '../context/CompanyContext';

export default function SEO({
  title,
  description,
  url = '/',
  image,
  type = 'website',
  keywords = 'Nexora Creative Solutions Ltd, Nexora Creative Solutions, Nexora, web design Kenya, mobile app development Nairobi, software company Thika, M-Pesa Daraja API integration, custom software Kenya',
  author,
  publishedTime,
  modifiedTime,
  noindex = false,
  breadcrumbs = null,
  schema = null,
}) {
  const { company } = useCompany();
  const SITE_URL = company.siteUrl;
  const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
  const SITE_NAME = company.legalName;

  const resolvedTitle = title || `${SITE_NAME} | Web, App & Software Development Company in Kenya`;
  const resolvedDescription = description || company.description;
  const resolvedAuthor = author || SITE_NAME;
  const resolvedImage = !image || image === '/ncs.png' ? DEFAULT_IMAGE : image;

  const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`;
  const fullImageUrl = resolvedImage.startsWith('http')
    ? resolvedImage
    : `${SITE_URL}${resolvedImage.startsWith('/') ? resolvedImage : `/${resolvedImage}`}`;
  const isDefaultOg = fullImageUrl === DEFAULT_IMAGE;

  let breadcrumbsSchema = null;
  if (breadcrumbs && Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
    breadcrumbsSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.item.startsWith('http')
          ? crumb.item
          : `${SITE_URL}${crumb.item.startsWith('/') ? crumb.item : `/${crumb.item}`}`,
      })),
    };
  }

  const schemasToRender = [];
  if (breadcrumbsSchema) {
    schemasToRender.push(breadcrumbsSchema);
  }
  if (schema) {
    if (Array.isArray(schema)) {
      schemasToRender.push(...schema.filter(Boolean));
    } else {
      schemasToRender.push(schema);
    }
  }

  const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords;

  return (
    <Helmet>
      {/* 1. Standard Metadata & Site Name */}
      <title>{resolvedTitle}</title>
      <meta name="title" content={resolvedTitle} />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
      <meta name="description" content={resolvedDescription} />
      {keywordsString && <meta name="keywords" content={keywordsString} />}
      <meta name="author" content={resolvedAuthor} />
      <meta name="publisher" content={SITE_NAME} />
      <meta
        name="robots"
        content={
          noindex
            ? 'noindex, nofollow'
            : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        }
      />

      {/* 2. Canonical & AI Discovery */}
      <link rel="canonical" href={fullUrl} />
      <link rel="alternate" type="text/plain" title="LLMs.txt" href={`${SITE_URL}/llms.txt`} />

      {/* 3. Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:image" content={fullImageUrl} />
      {isDefaultOg && <meta property="og:image:type" content="image/png" />}
      {isDefaultOg && <meta property="og:image:width" content="1200" />}
      {isDefaultOg && <meta property="og:image:height" content="630" />}
      <meta property="og:image:alt" content={resolvedTitle} />
      <meta property="og:locale" content="en_KE" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {resolvedAuthor && type === 'article' && <meta property="article:author" content={resolvedAuthor} />}

      {/* 4. X / Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:site" content="@newtondesigns_" />
      <meta name="twitter:creator" content="@newtondesigns_" />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={resolvedTitle} />

      {/* 5. Dynamic JSON-LD Structured Data */}
      {schemasToRender.map((s, idx) => (
        <script key={`schema-${idx}`} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
