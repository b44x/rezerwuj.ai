import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useSEO, useStructuredData } from '../hooks/useSEO';
import { getBreadcrumbSchema } from '../utils/structuredData';
import {
  ArrowLeft,
  Check,
  X,
  MapPin,
  Calendar,
  Clock,
  Plane,
  Utensils,
  Users,
  ExternalLink,
  TrendingDown,
  Crown,
  Sparkles,
  Loader
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
  aiScore?: {
    score: number;
    reasoning: string;
    breakdown: Record<string, number>;
  };
}

interface SharedComparisonData {
  id: string;
  name: string;
  offers: Offer[];
  createdAt: string;
}

const SharedComparison: React.FC = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [data, setData] = useState<SharedComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchSharedComparison = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/saved-comparisons/shared/${shareToken}`);

        if (!response.ok) {
          throw new Error('Comparison not found');
        }

        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (shareToken) {
      fetchSharedComparison();
    }
  }, [shareToken]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
        <Navbar variant="dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-600 dark:text-slate-400">Ładowanie porównania...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
        <Navbar variant="dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Porównanie nie znalezione</h2>
            <p className="text-slate-400 mb-6">
              Link może być nieprawidłowy lub porównanie zostało usunięte
            </p>
            <Link
              to="/hotels"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Wróć do wyszukiwania
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { offers, name, createdAt } = data;

  // SEO: Shared comparison page
  const hotelNames = offers.map(o => o.hotel.name).join(', ');
  const cities = [...new Set(offers.map(o => o.hotel.city))].join(', ');
  useSEO({
    title: `${name} - Porównanie ${offers.length} Ofert Wakacyjnych | Rezerwuj.ai`,
    description: `Porównanie wakacji: ${hotelNames}. Miasta: ${cities}. Sprawdź ceny, terminy, wyżywienie i wybierz najlepszą ofertę. Udostępniono ${formatDate(createdAt)}.`,
    keywords: `porównanie wakacji, ${cities}, hotele ${cities.split(',')[0]}, all inclusive last minute, wakacje z dziećmi`,
    type: 'article',
  });

  useStructuredData(
    getBreadcrumbSchema([
      { name: 'Home', url: 'https://rezerwuj.ai' },
      { name: 'Porównania', url: 'https://rezerwuj.ai/hotels' },
      { name: name, url: `https://rezerwuj.ai/compare/shared/${shareToken}` },
    ])
  );

  // Find best values for highlighting
  const prices = offers.map(o => parseFloat(o.price));
  const lowestPrice = Math.min(...prices);
  const durations = offers.map(o => o.durationDays);
  const longestDuration = Math.max(...durations);
  const aiScores = offers
    .map(o => o.aiScore?.score || 0)
    .filter(score => score > 0);
  const highestAIScore = aiScores.length > 0 ? Math.max(...aiScores) : 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getBoardTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'All Inclusive': 'All Inclusive',
      'Half Board': 'Half Board',
      'Bed & Breakfast': 'Bed & Breakfast',
      'Full Board': 'Full Board',
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar variant="dashboard" />

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/hotels"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Wróć do wyszukiwania
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-900 dark:text-white">{name}</h1>
          </div>
          <p className="text-slate-400 text-sm">
            Udostępniono {formatDate(createdAt)} • {offers.length} ofert w porównaniu
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-sm font-bold text-slate-400 uppercase tracking-wider sticky left-0 bg-slate-900/90 backdrop-blur">
                    Cecha
                  </th>
                  {offers.map((offer) => (
                    <th key={offer.id} className="p-4 min-w-[280px]">
                      <div className="text-left">
                        <Link
                          to={`/hotels/${offer.hotel.slug}`}
                          className="text-lg font-bold text-white hover:text-blue-400 transition block mb-1"
                        >
                          {offer.hotel.name}
                        </Link>
                        <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-600 dark:text-slate-400">
                          <MapPin className="w-3 h-3" />
                          {offer.hotel.city}, {offer.hotel.country}
                        </div>
                        <div className="inline-flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded text-xs text-white mt-2">
                          {offer.provider.name}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* AI Score Row */}
                {highestAIScore > 0 && (
                  <tr className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="p-4 text-sm text-slate-300 sticky left-0 bg-slate-900/90 backdrop-blur">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        AI Score
                      </div>
                    </td>
                    {offers.map((offer) => (
                      <td key={offer.id} className="p-4">
                        {offer.aiScore ? (
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-slate-900 dark:text-slate-900 dark:text-white">
                                {offer.aiScore.score}/100
                              </span>
                              {offer.aiScore.score === highestAIScore && (
                                <Crown className="w-4 h-4 text-yellow-400" />
                              )}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              {offer.aiScore.reasoning}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                )}

                {/* Price Row */}
                <tr className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 text-sm text-slate-300 sticky left-0 bg-slate-900/90 backdrop-blur">
                    💰 Cena
                  </td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-black ${
                          parseFloat(offer.price) === lowestPrice ? 'text-green-400' : 'text-white'
                        }`}>
                          {parseFloat(offer.price).toFixed(0)} zł
                        </span>
                        {parseFloat(offer.price) === lowestPrice && (
                          <div className="flex items-center gap-1 text-xs bg-green-900/30 border border-green-500/30 text-green-400 px-2 py-1 rounded">
                            <TrendingDown className="w-3 h-3" />
                            Najtaniej
                          </div>
                        )}
                      </div>
                      {offer.pricePerPerson && (
                        <div className="text-xs text-slate-400 mt-1">za osobę</div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Dates Row */}
                <tr className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 text-sm text-slate-300 sticky left-0 bg-slate-900/90 backdrop-blur">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Termin
                    </div>
                  </td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="p-4">
                      <div className="text-sm text-slate-900 dark:text-slate-900 dark:text-white">
                        {formatDate(offer.departureDate)}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        powrót: {formatDate(offer.returnDate)}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Duration Row */}
                <tr className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 text-sm text-slate-300 sticky left-0 bg-slate-900/90 backdrop-blur">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Długość
                    </div>
                  </td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${
                          offer.durationDays === longestDuration ? 'text-blue-400' : 'text-white'
                        }`}>
                          {offer.durationDays} dni
                        </span>
                        {offer.durationDays === longestDuration && (
                          <Crown className="w-3 h-3 text-blue-400" />
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Departure City Row */}
                <tr className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 text-sm text-slate-300 sticky left-0 bg-slate-900/90 backdrop-blur">
                    <div className="flex items-center gap-2">
                      <Plane className="w-4 h-4" />
                      Wylot z
                    </div>
                  </td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="p-4">
                      <div className="text-sm text-slate-900 dark:text-slate-900 dark:text-white">
                        {offer.departureCity}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Board Type Row */}
                <tr className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 text-sm text-slate-300 sticky left-0 bg-slate-900/90 backdrop-blur">
                    <div className="flex items-center gap-2">
                      <Utensils className="w-4 h-4" />
                      Wyżywienie
                    </div>
                  </td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="p-4">
                      <div className="text-sm text-slate-900 dark:text-slate-900 dark:text-white">
                        {getBoardTypeLabel(offer.boardType)}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Room Type Row */}
                <tr className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 text-sm text-slate-300 sticky left-0 bg-slate-900/90 backdrop-blur">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Pokój
                    </div>
                  </td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="p-4">
                      <div className="text-sm text-slate-900 dark:text-slate-900 dark:text-white">
                        {offer.roomType}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Flight Info Row */}
                <tr className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 text-sm text-slate-300 sticky left-0 bg-slate-900/90 backdrop-blur">
                    <div className="flex items-center gap-2">
                      ✈️ Linie lotnicze
                    </div>
                  </td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="p-4">
                      <div className="text-sm text-slate-900 dark:text-white mb-2">
                        {offer.flightInfo.airline}
                      </div>
                      <div className="text-xs text-slate-400 space-y-1">
                        <div>Tam: {offer.flightInfo.outbound.departure} → {offer.flightInfo.outbound.arrival}</div>
                        <div>Powrót: {offer.flightInfo.return.departure} → {offer.flightInfo.return.arrival}</div>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Transfer Row */}
                <tr className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 text-sm text-slate-300 sticky left-0 bg-slate-900/90 backdrop-blur">
                    <div className="flex items-center gap-2">
                      🚌 Transfer
                    </div>
                  </td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="p-4">
                      <div className="flex items-center gap-2">
                        {offer.flightInfo.transferIncluded ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <X className="w-4 h-4 text-red-400" />
                        )}
                        <span className="text-sm text-slate-900 dark:text-slate-900 dark:text-white">
                          {offer.flightInfo.transferIncluded ? 'Wliczony' : 'Brak'}
                        </span>
                      </div>
                      {offer.flightInfo.transferIncluded && (
                        <div className="text-xs text-slate-400 mt-1">
                          {offer.flightInfo.transferDuration}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* CTA Row */}
                <tr>
                  <td className="p-4 text-sm text-slate-300 sticky left-0 bg-slate-900/90 backdrop-blur">
                    <div className="font-bold">Rezerwacja</div>
                  </td>
                  {offers.map((offer) => (
                    <td key={offer.id} className="p-4">
                      <a
                        href={offer.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white px-4 py-3 rounded-xl font-bold text-sm transition"
                      >
                        Rezerwuj
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <Link
                        to={`/offers/${offer.id}`}
                        className="block text-center text-xs text-blue-400 hover:text-blue-300 mt-2 transition"
                      >
                        Zobacz szczegóły
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6 text-xs text-slate-600 dark:text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span>Najlepsza wartość w kategorii</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-green-400" />
            <span>Najniższa cena</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SharedComparison;
