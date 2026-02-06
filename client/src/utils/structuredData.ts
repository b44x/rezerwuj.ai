// Schema.org structured data generators for SEO

interface Hotel {
  id: number;
  slug: string;
  name: string;
  address: string;
  city: string;
  country: string;
  location: { lat: number; lng: number };
}

interface Offer {
  id: string;
  price: number | string;
  pricePerPerson: boolean;
  departureCity: string;
  departureDate: string;
  returnDate: string;
  durationDays: number;
  boardType: string;
  roomType: string;
  hotel: Hotel;
  provider: {
    id: string;
    name: string;
    website: string;
  };
}

/**
 * Generate Organization structured data
 */
export const getOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Rezerwuj.ai',
    url: 'https://rezerwuj.ai',
    logo: 'https://rezerwuj.ai/logo.png',
    description: 'Inteligentne wyszukiwanie wakacji z wykorzystaniem AI. Porównuj oferty last minute, all inclusive i hotele rodzinne.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'kontakt@rezerwuj.ai',
      availableLanguage: ['Polish'],
    },
    sameAs: [
      'https://www.facebook.com/rezerwujai',
      'https://twitter.com/rezerwujai',
      'https://www.instagram.com/rezerwujai',
    ],
  };
};

/**
 * Generate Hotel structured data
 */
export const getHotelSchema = (hotel: Hotel, averageRating?: number, reviewCount?: number) => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotel.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: hotel.address,
      addressLocality: hotel.city,
      addressCountry: hotel.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: hotel.location.lat,
      longitude: hotel.location.lng,
    },
    url: `https://rezerwuj.ai/hotels/${hotel.slug}`,
  };

  // Add rating if available
  if (averageRating && reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: averageRating,
      reviewCount: reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
};

/**
 * Generate Offer (Product) structured data
 */
export const getOfferSchema = (offer: Offer) => {
  const price = typeof offer.price === 'string' ? parseFloat(offer.price) : offer.price;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${offer.hotel.name} - ${offer.durationDays} dni ${offer.boardType}`,
    description: `Wakacje w ${offer.hotel.city}, ${offer.hotel.country}. Wylot z ${offer.departureCity}, ${offer.durationDays} dni, ${offer.boardType}, ${offer.roomType}. Termin: ${new Date(offer.departureDate).toLocaleDateString('pl-PL')} - ${new Date(offer.returnDate).toLocaleDateString('pl-PL')}.`,
    brand: {
      '@type': 'Brand',
      name: offer.provider.name,
    },
    offers: {
      '@type': 'Offer',
      price: price.toFixed(2),
      priceCurrency: 'PLN',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
      priceValidUntil: offer.departureDate,
      seller: {
        '@type': 'Organization',
        name: offer.provider.name,
        url: offer.provider.website,
      },
    },
    aggregateRating: offer.hotel ? {
      '@type': 'AggregateRating',
      ratingValue: 4.5, // Default (replace with real data when available)
      reviewCount: 10,
      bestRating: 5,
    } : undefined,
  };
};

/**
 * Generate BreadcrumbList structured data
 */
export const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

/**
 * Generate WebSite structured data with SearchAction
 */
export const getWebsiteSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Rezerwuj.ai',
    url: 'https://rezerwuj.ai',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://rezerwuj.ai/hotels?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
};

/**
 * Generate FAQ structured data (for future content pages)
 */
export const getFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};
