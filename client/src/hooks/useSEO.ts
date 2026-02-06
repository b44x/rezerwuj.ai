import { useEffect } from 'react';

interface SEOOptions {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  canonical?: string;
  robots?: string; // e.g., "index, follow" or "noindex, nofollow"
}

export const useSEO = ({
  title = 'Rezerwuj.ai - Inteligentne Wyszukiwanie Wakacji z AI',
  description = 'Znajdź idealne wakacje dla swojej rodziny. AI dopasowuje oferty last minute, all inclusive i wczasy z aquaparkiem do Twoich potrzeb. Grecja, Egipt, Turcja - porównaj ceny.',
  keywords = 'wakacje all inclusive, last minute, wczasy z dzieckiem, aquapark, hotel rodzinny, grecja egipt turcja, tanie wakacje, ai wyszukiwanie, porównywarka wakacji',
  image = 'https://rezerwuj.ai/og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : 'https://rezerwuj.ai',
  type = 'website',
  canonical,
  robots = 'index, follow',
}: SEOOptions = {}) => {
  useEffect(() => {
    const siteTitle = 'Rezerwuj.ai';
    const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;

    // Set document title
    document.title = fullTitle;

    // Helper to update or create meta tag
    const setMetaTag = (property: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${property}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    // Helper for link tags
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }

      element.href = href;
    };

    // Basic Meta Tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);

    // Canonical URL
    if (canonical || url) {
      setLinkTag('canonical', canonical || url);
    }

    // Open Graph
    setMetaTag('og:type', type, true);
    setMetaTag('og:title', fullTitle, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', image, true);
    setMetaTag('og:url', url, true);
    setMetaTag('og:site_name', siteTitle, true);
    setMetaTag('og:locale', 'pl_PL', true);

    // Twitter Card
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', fullTitle);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);

    // Additional SEO
    setMetaTag('robots', robots);
    setMetaTag('googlebot', robots);
    setMetaTag('language', 'Polish');

  }, [title, description, keywords, image, url, type, canonical, robots]);
};

// Helper to inject structured data (JSON-LD)
export const useStructuredData = (data: object) => {
  useEffect(() => {
    const scriptId = 'structured-data';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(data);

    return () => {
      // Cleanup on unmount
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [data]);
};
