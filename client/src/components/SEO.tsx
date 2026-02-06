import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Rezerwuj.ai - Inteligentne Wyszukiwanie Wakacji z AI',
  description = 'Znajdź idealne wakacje dla swojej rodziny. AI dopasowuje oferty last minute, all inclusive i wczasy z aquaparkiem do Twoich potrzeb. Grecja, Egipt, Turcja - porównaj ceny.',
  keywords = 'wakacje all inclusive, last minute, wczasy z dzieckiem, aquapark, hotel rodzinny, grecja egipt turcja, tanie wakacje, ai wyszukiwanie, porównywarka wakacji',
  image = 'https://rezerwuj.ai/og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : 'https://rezerwuj.ai',
  type = 'website',
  structuredData,
}) => {
  const siteTitle = 'Rezerwuj.ai';
  const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Open Graph (Facebook, LinkedIn) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="pl_PL" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="Polish" />
      <meta name="author" content="Rezerwuj.ai" />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
