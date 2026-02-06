import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import VacationOfferCard from '../components/ui/VacationOfferCard';
import ComparisonBar from '../components/ComparisonBar';
import { useSEO, useStructuredData } from '../hooks/useSEO';
import { getWebsiteSchema } from '../utils/structuredData';
import { Cpu, Check, RefreshCcw, MapPin, Calendar, Utensils, Wallet } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';

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

interface Filters {
  departureCities: string[];
  boardTypes: string[];
}

interface TravelGroup {
  id: number;
  name: string;
  description: string | null;
  peopleCount: number;
}

const Hotels: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filters, setFilters] = useState<Filters>({ departureCities: [], boardTypes: [] });
  const [travelGroups, setTravelGroups] = useState<TravelGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Filter states
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedBoardType, setSelectedBoardType] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiScoring, setAiScoring] = useState<boolean>(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch travel groups and filters
        const [groupsResponse, filtersResponse] = await Promise.all([
          fetch(`${apiUrl}/api/travel-groups`),
          fetch(`${apiUrl}/api/offers/filters`)
        ]);

        if (!groupsResponse.ok || !filtersResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const groupsResult = await groupsResponse.json();
        const filtersResult = await filtersResponse.json();

        setTravelGroups(groupsResult.data || []);
        setFilters(filtersResult.data || { departureCities: [], boardTypes: [] });

        // Fetch offers (AI-scored if group selected, otherwise regular)
        await fetchOffers();
      } catch (error: any) {
        setError(error.message);
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch offers when filters or group selection changes
  useEffect(() => {
    if (!loading) {
      fetchOffers();
    }
  }, [selectedGroupId, selectedCity, selectedBoardType, priceMax]);

  const fetchOffers = async () => {
    try {
      let url: string;
      let params = new URLSearchParams();

      // Build filter params
      if (selectedCity) params.append('departureCity', selectedCity);
      if (selectedBoardType) params.append('boardType', selectedBoardType);
      if (priceMax) params.append('priceMax', priceMax);

      if (selectedGroupId) {
        // Use AI recommendations API
        url = `${apiUrl}/api/offers/ai-recommended/${selectedGroupId}`;
        setAiScoring(true);
      } else {
        // Use regular offers API
        url = `${apiUrl}/api/offers`;
        params.append('limit', '50');
        setAiScoring(false);
      }

      const fullUrl = params.toString() ? `${url}?${params}` : url;
      const response = await fetch(fullUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }

      const result = await response.json();
      setOffers(result.data || []);
    } catch (error: any) {
      setError(error.message);
      console.error('Error fetching offers:', error);
    }
  };

  const activeFiltersCount = [selectedCity, selectedBoardType, priceMax].filter(Boolean).length;

  // SEO: Search page with filters
  const groupName = travelGroups.find(g => g.id === parseInt(selectedGroupId))?.name;
  useSEO({
    title: selectedGroupId && groupName
      ? `Oferty Wakacyjne dla ${groupName} - AI Recommendations | Rezerwuj.ai`
      : 'Wyszukiwanie Wakacji - All Inclusive, Last Minute | Rezerwuj.ai',
    description: `Znajdź idealne wakacje ${selectedCity ? `z ${selectedCity}` : ''} ${selectedBoardType ? `- ${selectedBoardType}` : ''}. ${offers.length} ofert dostępnych. AI dopasowuje najlepsze hotele rodzinne z aquaparkiem dla Twojej rodziny. Porównaj ceny TUI, Itaka, Rainbow, Wakacje.pl.`,
    keywords: 'wakacje all inclusive, last minute grecja egipt turcja, hotel rodzinny aquapark, wczasy z dzieckiem, ai wyszukiwanie wakacji, porównywarka ofert wakacyjnych, tanie wakacje, wylot warszawa kraków poznań',
  });

  useStructuredData(getWebsiteSchema());

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gray-50 dark:bg-slate-950">
      <Navbar variant="dashboard" />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with AI Prompt and Filters */}
        <aside className="w-80 border-r border-slate-200 dark:border-white/5 p-6 flex flex-col gap-6 bg-white dark:bg-slate-900/30 overflow-y-auto">
          {/* Travel Group Selection */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-3 block font-mono text-blue-600 dark:text-blue-400">
              Grupa Podróżna (AI Recommendations)
            </label>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 mb-2"
            >
              <option value="">Bez grupy (standardowe)</option>
              {travelGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name} ({group.peopleCount || '?'} osób)
                </option>
              ))}
            </select>
            {selectedGroupId && (
              <div className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                <span>AI scoring aktywny</span>
              </div>
            )}
          </div>

          {/* AI Prompt */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-3 block font-mono text-blue-600 dark:text-blue-400">
              Polecenie dla Agenta AI
            </label>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-2xl p-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 min-h-[120px] resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="Np. 'Szukam hotelu z aquaparkiem dla dzieci 6 i 9 lat, All Inclusive, wylot z Warszawy w lipcu'..."
            />
            <button className="w-full mt-3 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-sm transition shadow-lg shadow-blue-600/20">
              Aktualizuj wyniki
            </button>
          </div>

          {/* Filters */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest font-mono">
                Filtry
              </label>
              {activeFiltersCount > 0 && (
                <button
                  onClick={() => {
                    setSelectedCity('');
                    setSelectedBoardType('');
                    setPriceMax('');
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                >
                  Wyczyść
                </button>
              )}
            </div>

            <div className="space-y-3">
              {/* Departure City */}
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Miasto wylotu
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">Wszystkie miasta</option>
                  {filters.departureCities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Board Type */}
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5" />
                  Wyżywienie
                </label>
                <select
                  value={selectedBoardType}
                  onChange={(e) => setSelectedBoardType(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">Wszystkie rodzaje</option>
                  {filters.boardTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Price Max */}
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5" />
                  Cena max (zł/os)
                </label>
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  placeholder="np. 5000"
                  className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>
            </div>
          </div>

          {/* AI Status */}
          <div className="flex-1">
            <GlassCard className="p-4 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 uppercase tracking-tight">
                <Cpu className="w-3 h-3 text-blue-600 dark:text-blue-500" /> Status Analizy
              </h4>
              <ul className="text-[11px] space-y-3 text-slate-600 dark:text-slate-400 font-mono">
                <li className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <Check className="w-3 h-3" /> Pobrano {offers.length} ofert
                </li>
                <li className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <Check className="w-3 h-3" /> Ceny z {filters.departureCities.length} miast
                </li>
                <li className="flex items-center gap-2 animate-pulse">
                  <RefreshCcw className="w-3 h-3" /> Monitorowanie zmian cen...
                </li>
              </ul>
            </GlassCard>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
              {activeFiltersCount > 0 || selectedGroupId
                ? `Znaleziono ${offers.length} ofert`
                : 'Wszystkie Oferty Wakacyjne'
              }
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {aiScoring
                ? `"Sortowanie AI na podstawie preferencji grupy ${travelGroups.find(g => g.id === parseInt(selectedGroupId))?.name}"`
                : aiPrompt
                ? '"Analizuję Twoje wymagania i szukam najlepszych dopasowań..."'
                : 'Wybierz grupę podróżną po lewej aby aktywować AI scoring'
              }
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-slate-600 dark:text-slate-400 text-sm animate-pulse">Ładowanie ofert...</div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-500/20 rounded-lg">
              <p className="text-red-600 dark:text-red-400">Błąd ładowania: {error}</p>
            </div>
          )}

          {/* Results */}
          {!loading && !error && (
            <>
              {offers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <MapPin className="w-16 h-16 text-slate-400 dark:text-slate-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Brak wyników</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">Spróbuj zmienić kryteria wyszukiwania</p>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={() => {
                        setSelectedCity('');
                        setSelectedBoardType('');
                        setPriceMax('');
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold transition"
                    >
                      Wyczyść filtry
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                  {offers.map((offer) => (
                    <VacationOfferCard key={offer.id} offer={offer} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Floating comparison bar */}
      <ComparisonBar />
    </div>
  );
};

export default Hotels;
