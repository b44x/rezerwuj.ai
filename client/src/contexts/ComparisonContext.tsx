import React, { createContext, useContext, useState, useEffect } from 'react';

interface Offer {
  id: string;
  price: number;
  pricePerPerson: boolean;
  departureCity: string;
  departureDate: string;
  returnDate: string;
  durationDays: number;
  boardType: string;
  roomType: string;
  flightInfo: {
    airline: string;
    outbound: { departure: string; arrival: string };
    return: { departure: string; arrival: string };
    transferIncluded: boolean;
    transferDuration: string;
  };
  externalUrl: string;
  hotel: {
    id: number;
    slug: string;
    name: string;
    address: string;
    city: string;
    country: string;
    location: { lat: number; lng: number };
  };
  provider: {
    id: string;
    name: string;
    logoUrl: string;
    website: string;
  };
  aiScore?: {
    score: number;
    reasoning: string;
    breakdown: Record<string, number>;
  };
}

interface ComparisonContextType {
  comparedOffers: Offer[];
  addToComparison: (offer: Offer) => void;
  removeFromComparison: (offerId: string) => void;
  clearComparison: () => void;
  isInComparison: (offerId: string) => boolean;
  canAddMore: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const STORAGE_KEY = 'rezerwuj_comparison';
const MAX_COMPARISON = 4;

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comparedOffers, setComparedOffers] = useState<Offer[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setComparedOffers(parsed);
      } catch (error) {
        console.error('Failed to parse comparison data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comparedOffers));
  }, [comparedOffers]);

  const addToComparison = (offer: Offer) => {
    if (comparedOffers.length >= MAX_COMPARISON) {
      return; // Max 4 offers
    }

    if (!comparedOffers.find(o => o.id === offer.id)) {
      setComparedOffers([...comparedOffers, offer]);
    }
  };

  const removeFromComparison = (offerId: string) => {
    setComparedOffers(comparedOffers.filter(o => o.id !== offerId));
  };

  const clearComparison = () => {
    setComparedOffers([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isInComparison = (offerId: string): boolean => {
    return comparedOffers.some(o => o.id === offerId);
  };

  const canAddMore = comparedOffers.length < MAX_COMPARISON;

  return (
    <ComparisonContext.Provider
      value={{
        comparedOffers,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        canAddMore,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
