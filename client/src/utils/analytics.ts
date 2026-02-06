// Analytics & Event Tracking System
// Supports Google Analytics 4, Google Tag Manager, and custom events

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Initialize Google Analytics 4
 * Add to index.html: <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
 */
export const initGA4 = (measurementId: string) => {
  if (typeof window === 'undefined') return;

  // Load gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_path: window.location.pathname,
    send_page_view: true,
  });

  console.log('✅ GA4 initialized:', measurementId);
};

/**
 * Initialize Google Tag Manager
 * Add to index.html:
 * <script>(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-XXXXXX');</script>
 */
export const initGTM = (containerId: string) => {
  if (typeof window === 'undefined') return;

  // GTM script
  (function (w: any, d: any, s: string, l: string, i: string) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    const f = d.getElementsByTagName(s)[0];
    const j = d.createElement(s);
    const dl = l !== 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', containerId);

  console.log('✅ GTM initialized:', containerId);
};

/**
 * Track page view
 */
export const trackPageView = (url: string, title?: string) => {
  if (typeof window.gtag === 'function') {
    window.gtag('config', import.meta.env.VITE_GA4_MEASUREMENT_ID, {
      page_path: url,
      page_title: title || document.title,
    });
  }

  // GTM dataLayer
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'page_view',
      page_path: url,
      page_title: title || document.title,
    });
  }

  console.log('📄 Page view:', url);
};

/**
 * Track custom event
 */
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, parameters);
  }

  // GTM dataLayer
  if (window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...parameters,
    });
  }

  console.log('📊 Event:', eventName, parameters);
};

// ============================================
// PREDEFINED EVENTS FOR REZERWUJ.AI
// ============================================

/**
 * User Registration
 */
export const trackRegistration = (method: 'email' | 'google' | 'facebook') => {
  trackEvent('sign_up', {
    method,
    category: 'User',
  });
};

/**
 * User Login
 */
export const trackLogin = (method: 'email' | 'google' | 'facebook') => {
  trackEvent('login', {
    method,
    category: 'User',
  });
};

/**
 * Search performed (filters applied)
 */
export const trackSearch = (params: {
  departureCity?: string;
  boardType?: string;
  priceMax?: string;
  groupId?: string;
  resultCount: number;
}) => {
  trackEvent('search', {
    search_term: JSON.stringify(params),
    category: 'Search',
    result_count: params.resultCount,
  });
};

/**
 * Offer viewed
 */
export const trackOfferView = (offer: {
  id: string;
  hotelName: string;
  price: number;
  city: string;
  provider: string;
}) => {
  trackEvent('view_item', {
    item_id: offer.id,
    item_name: offer.hotelName,
    item_category: 'Vacation Package',
    item_variant: offer.city,
    price: offer.price,
    currency: 'PLN',
    item_brand: offer.provider,
  });
};

/**
 * Offer added to comparison
 */
export const trackComparisonAdd = (offer: {
  id: string;
  hotelName: string;
  price: number;
}) => {
  trackEvent('add_to_cart', {
    item_id: offer.id,
    item_name: offer.hotelName,
    price: offer.price,
    currency: 'PLN',
    category: 'Comparison',
  });
};

/**
 * Offer removed from comparison
 */
export const trackComparisonRemove = (offerId: string) => {
  trackEvent('remove_from_cart', {
    item_id: offerId,
    category: 'Comparison',
  });
};

/**
 * Comparison viewed
 */
export const trackComparisonView = (offerCount: number) => {
  trackEvent('view_cart', {
    item_count: offerCount,
    category: 'Comparison',
  });
};

/**
 * Comparison saved (to backend)
 */
export const trackComparisonSave = (params: {
  comparisonId: string;
  name: string;
  offerCount: number;
}) => {
  trackEvent('comparison_saved', {
    comparison_id: params.comparisonId,
    comparison_name: params.name,
    offer_count: params.offerCount,
    category: 'Comparison',
  });
};

/**
 * Comparison shared (link generated)
 */
export const trackComparisonShare = (params: {
  comparisonId: string;
  shareToken: string;
  method: 'link' | 'email' | 'social';
}) => {
  trackEvent('share', {
    content_type: 'comparison',
    content_id: params.comparisonId,
    method: params.method,
    category: 'Comparison',
  });
};

/**
 * External booking click (CONVERSION!)
 */
export const trackBookingClick = (offer: {
  id: string;
  hotelName: string;
  price: number;
  provider: string;
  externalUrl: string;
}) => {
  // This is the main conversion event!
  trackEvent('begin_checkout', {
    item_id: offer.id,
    item_name: offer.hotelName,
    price: offer.price,
    currency: 'PLN',
    item_brand: offer.provider,
    category: 'Conversion',
  });

  // Custom conversion event
  trackEvent('external_booking_click', {
    offer_id: offer.id,
    hotel_name: offer.hotelName,
    price: offer.price,
    provider: offer.provider,
    external_url: offer.externalUrl,
    category: 'Conversion',
    value: offer.price, // Conversion value
  });
};

/**
 * Travel group created
 */
export const trackGroupCreate = (params: {
  groupId: number;
  groupName: string;
  peopleCount: number;
}) => {
  trackEvent('group_created', {
    group_id: params.groupId,
    group_name: params.groupName,
    people_count: params.peopleCount,
    category: 'Travel Group',
  });
};

/**
 * Hotel favorited/liked
 */
export const trackHotelFavorite = (params: {
  hotelId: number;
  hotelName: string;
  action: 'add' | 'remove';
}) => {
  trackEvent('favorite_hotel', {
    hotel_id: params.hotelId,
    hotel_name: params.hotelName,
    action: params.action,
    category: 'Engagement',
  });
};

/**
 * Filters applied
 */
export const trackFiltersApply = (filters: Record<string, any>) => {
  trackEvent('filters_applied', {
    filters: JSON.stringify(filters),
    category: 'Search',
  });
};

/**
 * AI scoring used
 */
export const trackAIScoring = (params: {
  groupId: string;
  offerCount: number;
}) => {
  trackEvent('ai_scoring_used', {
    group_id: params.groupId,
    offer_count: params.offerCount,
    category: 'AI Feature',
  });
};

/**
 * Newsletter signup
 */
export const trackNewsletterSignup = (email: string) => {
  trackEvent('newsletter_signup', {
    email_hash: btoa(email), // Hash email for privacy
    category: 'Marketing',
  });
};

/**
 * Error occurred
 */
export const trackError = (params: {
  errorMessage: string;
  errorCode?: string | number;
  page: string;
}) => {
  trackEvent('exception', {
    description: params.errorMessage,
    error_code: params.errorCode,
    page: params.page,
    fatal: false,
  });
};
