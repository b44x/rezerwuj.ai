import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useSEO, useStructuredData } from '../hooks/useSEO';
import { getOfferSchema, getBreadcrumbSchema } from '../utils/structuredData';
import {
  MapPin,
  Calendar,
  Clock,
  Plane,
  Utensils,
  Users,
  ExternalLink,
  TrendingDown,
  TrendingUp,
  Minus,
  AlertCircle,
  Star,
  Wifi,
  Waves,
  Wind
} from 'lucide-react';

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
  priceHistory?: Array<{
    price: number;
    checkedAt: string;
  }>;
  priceChange?: {
    amount: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  };
}

const OfferDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/offers/${id}`);
        if (!response.ok) {
          throw new Error('Offer not found');
        }
        const result = await response.json();
        setOffer(result.data);
      } catch (error: any) {
        setError(error.message);
        console.error('Error fetching offer:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOffer();
    }
  }, [id]);

  // SEO: Dynamic meta tags and structured data
  useSEO({
    title: offer
      ? `${offer.hotel.name} - ${offer.durationDays} dni ${offer.boardType} od ${offer.price} zł | Wylot ${offer.departureCity}`
      : 'Oferta wakacyjna',
    description: offer
      ? `Wakacje w ${offer.hotel.city}, ${offer.hotel.country}. ${offer.durationDays} dni, ${offer.boardType}, ${offer.roomType}. Wylot z ${offer.departureCity} w dniu ${new Date(offer.departureDate).toLocaleDateString('pl-PL')}. ${offer.provider.name}. All inclusive, last minute, hotel rodzinny z aquaparkiem.`
      : 'Szczegóły oferty wakacyjnej - sprawdź cenę, termin i dostępność',
    keywords: offer
      ? `wakacje ${offer.hotel.country}, ${offer.boardType.toLowerCase()}, ${offer.hotel.city}, wylot ${offer.departureCity}, ${offer.provider.name}, hotel rodzinny, last minute ${offer.hotel.country}, ${offer.hotel.city} aquapark, wczasy z dzieckiem`
      : 'wakacje, oferta, all inclusive, last minute',
    url: `https://rezerwuj.ai/offers/${id}`,
  });

  useStructuredData(
    offer
      ? {
          ...getOfferSchema(offer),
          ...getBreadcrumbSchema([
            { name: 'Home', url: 'https://rezerwuj.ai' },
            { name: 'Oferty', url: 'https://rezerwuj.ai/hotels' },
            { name: offer.hotel.name, url: `https://rezerwuj.ai/hotels/${offer.hotel.slug}` },
            { name: `${offer.durationDays} dni ${offer.boardType}`, url: `https://rezerwuj.ai/offers/${offer.id}` },
          ]),
        }
      : {}
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPriceTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    if (trend === 'down') return <TrendingDown className="w-5 h-5 text-green-400" />;
    if (trend === 'up') return <TrendingUp className="w-5 h-5 text-red-400" />;
    return <Minus className="w-5 h-5 text-slate-600 dark:text-slate-400" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
        <Navbar variant="dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-slate-900 dark:text-white text-sm animate-pulse">Ładowanie oferty...</div>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
        <Navbar variant="dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Oferta nie znaleziona</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
            <Link
              to="/hotels"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition"
            >
              Wróć do wyszukiwania
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar variant="dashboard" />

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          <Link to="/hotels" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Wyszukiwanie</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-white">{offer.hotel.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hotel Header */}
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden">
              <div className="h-96 bg-gradient-to-br from-blue-600/20 to-purple-600/20 relative">
                {/* Provider Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-lg">
                  <span className="text-sm font-bold text-slate-900">{offer.provider.name}</span>
                </div>
              </div>

              <div className="p-8">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">{offer.hotel.name}</h1>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-6">
                  <MapPin className="w-5 h-5" />
                  <span>{offer.hotel.address}, {offer.hotel.city}, {offer.hotel.country}</span>
                </div>

                {/* Hotel Features */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                    <span className="text-sm text-slate-900 dark:text-white">4.5/5 ocena</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-lg">
                    <Waves className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-slate-900 dark:text-white">Basen</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-lg">
                    <Wifi className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm text-slate-900 dark:text-white">WiFi</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-lg">
                    <Wind className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span className="text-sm text-slate-900 dark:text-white">Klimatyzacja</span>
                  </div>
                </div>

                <Link
                  to={`/hotels/${offer.hotel.slug}`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-bold transition"
                >
                  Zobacz szczegóły hotelu →
                </Link>
              </div>
            </div>

            {/* Trip Details */}
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Szczegóły wyjazdu</h2>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Data wyjazdu</span>
                  </div>
                  <div className="text-slate-900 dark:text-white font-bold">{formatDate(offer.departureDate)}</div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Data powrotu</span>
                  </div>
                  <div className="text-slate-900 dark:text-white font-bold">{formatDate(offer.returnDate)}</div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mb-2">
                    <Clock className="w-4 h-4" />
                    <span>Długość pobytu</span>
                  </div>
                  <div className="text-slate-900 dark:text-white font-bold">{offer.durationDays} dni</div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mb-2">
                    <Plane className="w-4 h-4" />
                    <span>Wylot z</span>
                  </div>
                  <div className="text-slate-900 dark:text-white font-bold">{offer.departureCity}</div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mb-2">
                    <Utensils className="w-4 h-4" />
                    <span>Wyżywienie</span>
                  </div>
                  <div className="text-slate-900 dark:text-white font-bold">{offer.boardType}</div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mb-2">
                    <Users className="w-4 h-4" />
                    <span>Typ pokoju</span>
                  </div>
                  <div className="text-slate-900 dark:text-white font-bold">{offer.roomType}</div>
                </div>
              </div>
            </div>

            {/* Flight Info */}
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Informacje o locie</h2>

              <div className="space-y-6">
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">Linie lotnicze</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">{offer.flightInfo.airline}</div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">Lot tam</div>
                    <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-lg p-4">
                      <div className="text-slate-900 dark:text-white font-bold">
                        {offer.flightInfo.outbound.departure} → {offer.flightInfo.outbound.arrival}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">Lot powrotny</div>
                    <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-lg p-4">
                      <div className="text-slate-900 dark:text-white font-bold">
                        {offer.flightInfo.return.departure} → {offer.flightInfo.return.arrival}
                      </div>
                    </div>
                  </div>
                </div>

                {offer.flightInfo.transferIncluded && (
                  <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-400">
                      <span className="font-bold">✓ Transfer wliczony</span>
                      <span className="text-sm">({offer.flightInfo.transferDuration})</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Price & Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Price Card */}
              <div className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 rounded-2xl p-6">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Cena od</div>
                <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">
                  {offer.price.toFixed(0)} zł
                </div>
                {offer.pricePerPerson && (
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">za osobę</div>
                )}

                {/* Price Change Indicator */}
                {offer.priceChange && (
                  <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg ${
                    offer.priceChange.trend === 'down'
                      ? 'bg-green-900/20 border border-green-500/20'
                      : offer.priceChange.trend === 'up'
                      ? 'bg-red-900/20 border border-red-500/20'
                      : 'bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10'
                  }`}>
                    {getPriceTrendIcon(offer.priceChange.trend)}
                    <div>
                      <div className={`text-sm font-bold ${
                        offer.priceChange.trend === 'down' ? 'text-green-600 dark:text-green-400' :
                        offer.priceChange.trend === 'up' ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {offer.priceChange.trend === 'down' ? 'Cena spadła' :
                         offer.priceChange.trend === 'up' ? 'Cena wzrosła' : 'Cena stabilna'}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {Math.abs(offer.priceChange.amount).toFixed(0)} zł ({Math.abs(offer.priceChange.percentage).toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                )}

                <a
                  href={offer.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-xl font-bold transition"
                >
                  Rezerwuj na {offer.provider.name}
                  <ExternalLink className="w-5 h-5" />
                </a>

                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5" />
                    <span>
                      Zostaniesz przekierowany na stronę {offer.provider.name} w celu finalizacji rezerwacji
                    </span>
                  </div>
                </div>
              </div>

              {/* Price History */}
              {offer.priceHistory && offer.priceHistory.length > 0 && (
                <div className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Historia cen</h3>
                  <div className="space-y-3">
                    {offer.priceHistory.slice(0, 5).map((record, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                          {new Date(record.checkedAt).toLocaleDateString('pl-PL', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                        <span className="text-slate-900 dark:text-white font-bold">{record.price.toFixed(0)} zł</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfferDetails;
