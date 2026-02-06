import React from 'react';
import { Link } from 'react-router-dom';
import { useComparison } from '../contexts/ComparisonContext';
import Navbar from '../components/layout/Navbar';
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
  Printer,
  Filter,
  Share2
} from 'lucide-react';

const OfferComparison: React.FC = () => {
  const { comparedOffers, removeFromComparison, clearComparison } = useComparison();
  const [showDifferencesOnly, setShowDifferencesOnly] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [showSaveModal, setShowSaveModal] = React.useState(false);
  const [comparisonName, setComparisonName] = React.useState('');
  const [shareLink, setShareLink] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  // Detect mobile
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (comparedOffers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
        <Navbar variant="dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Brak ofert do porównania</h2>
            <p className="text-slate-400 mb-6">
              Dodaj oferty do porównania używając przycisku "+" na kartach ofert
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

  // Find best values for highlighting
  const prices = comparedOffers.map(o => o.price);
  const lowestPrice = Math.min(...prices);
  const durations = comparedOffers.map(o => o.durationDays);
  const longestDuration = Math.max(...durations);
  const aiScores = comparedOffers
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

  // Check if a category has differences
  const hasDifferences = (field: string): boolean => {
    if (comparedOffers.length < 2) return false;

    const values = comparedOffers.map(o => {
      switch(field) {
        case 'price': return o.price;
        case 'departureCity': return o.departureCity;
        case 'boardType': return o.boardType;
        case 'roomType': return o.roomType;
        case 'airline': return o.flightInfo.airline;
        case 'transferIncluded': return o.flightInfo.transferIncluded;
        case 'durationDays': return o.durationDays;
        default: return null;
      }
    });

    return new Set(values).size > 1;
  };

  // Save comparison to backend
  const handleSaveComparison = async () => {
    if (!comparisonName.trim()) {
      alert('Podaj nazwę porównania');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Musisz być zalogowany aby zapisać porównanie');
        setSaving(false);
        return;
      }

      const offerIds = comparedOffers.map(o => o.id);
      const response = await fetch(`${apiUrl}/api/saved-comparisons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: comparisonName,
          offerIds: offerIds,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save comparison');
      }

      const result = await response.json();
      const shareToken = result.shareToken;
      const link = `${window.location.origin}/compare/shared/${shareToken}`;
      setShareLink(link);
    } catch (error) {
      console.error('Error saving comparison:', error);
      alert('Nie udało się zapisać porównania');
    } finally {
      setSaving(false);
    }
  };

  // Copy share link to clipboard
  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Link skopiowany do schowka!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar variant="dashboard" />

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/hotels"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Wróć do wyszukiwania
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                Porównanie Ofert ({comparedOffers.length})
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Porównaj szczegóły i wybierz najlepszą ofertę dla siebie
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDifferencesOnly(!showDifferencesOnly)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition border ${
                  showDifferencesOnly
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title="Pokaż tylko różnice"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Tylko różnice</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition no-print"
                title="Wydrukuj"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Drukuj</span>
              </button>

              <button
                onClick={() => setShowSaveModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-green-600 border border-green-500 text-white hover:bg-green-500 transition no-print"
                title="Zapisz i udostępnij"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Udostępnij</span>
              </button>

              <button
                onClick={clearComparison}
                className="text-sm text-red-400 hover:text-red-300 transition hidden md:block no-print"
              >
                Wyczyść wszystkie
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        {isMobile ? (
          <div className="space-y-4">
            {comparedOffers.map((offer, index) => (
              <div
                key={offer.id}
                className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 rounded-2xl p-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-white/5">
                  <div className="flex-1">
                    <Link
                      to={`/hotels/${offer.hotel.slug}`}
                      className="text-xl font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition block mb-2"
                    >
                      {offer.hotel.name}
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                      <MapPin className="w-4 h-4" />
                      {offer.hotel.city}, {offer.hotel.country}
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded text-xs text-slate-900 dark:text-white">
                      {offer.provider.name}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromComparison(offer.id)}
                    className="text-slate-400 hover:text-red-400 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Details Grid */}
                <div className="space-y-3">
                  {/* AI Score */}
                  {offer.aiScore && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">AI Score:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{offer.aiScore.score}/100</span>
                        {offer.aiScore.score === highestAIScore && (
                          <Crown className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Cena:</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xl font-black ${
                        offer.price === lowestPrice ? 'text-green-400' : 'text-white'
                      }`}>
                        {offer.price.toFixed(0)} zł
                      </span>
                      {offer.price === lowestPrice && (
                        <TrendingDown className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Termin:</span>
                    <span className="text-sm text-slate-900 dark:text-white">{formatDate(offer.departureDate)}</span>
                  </div>

                  {/* Duration */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Długość:</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${
                        offer.durationDays === longestDuration ? 'text-blue-400' : 'text-white'
                      }`}>
                        {offer.durationDays} dni
                      </span>
                      {offer.durationDays === longestDuration && (
                        <Crown className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                  </div>

                  {/* Departure City */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Wylot z:</span>
                    <span className="text-sm text-slate-900 dark:text-white">{offer.departureCity}</span>
                  </div>

                  {/* Board Type */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Wyżywienie:</span>
                    <span className="text-sm text-slate-900 dark:text-white">{getBoardTypeLabel(offer.boardType)}</span>
                  </div>

                  {/* Room Type */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Pokój:</span>
                    <span className="text-sm text-slate-900 dark:text-white">{offer.roomType}</span>
                  </div>

                  {/* Airline */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Linie:</span>
                    <span className="text-sm text-slate-900 dark:text-white">{offer.flightInfo.airline}</span>
                  </div>

                  {/* Transfer */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Transfer:</span>
                    <div className="flex items-center gap-2">
                      {offer.flightInfo.transferIncluded ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-slate-900 dark:text-white">Wliczony</span>
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-slate-900 dark:text-white">Brak</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6 pt-4 border-t border-white/5 space-y-2">
                  <a
                    href={offer.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-bold text-sm transition"
                  >
                    Rezerwuj
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <Link
                    to={`/offers/${offer.id}`}
                    className="block text-center text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                  >
                    Zobacz szczegóły
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop Table View */
          <div className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto no-print-scroll">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-sm font-bold text-slate-400 uppercase tracking-wider sticky left-0 bg-slate-900/90 backdrop-blur">
                    Cecha
                  </th>
                  {comparedOffers.map((offer) => (
                    <th key={offer.id} className="p-4 min-w-[280px]">
                      <div className="text-left">
                        {/* Hotel Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <Link
                              to={`/hotels/${offer.hotel.slug}`}
                              className="text-lg font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition block mb-1"
                            >
                              {offer.hotel.name}
                            </Link>
                            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                              <MapPin className="w-3 h-3" />
                              {offer.hotel.city}, {offer.hotel.country}
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromComparison(offer.id)}
                            className="text-slate-400 hover:text-red-400 transition ml-2"
                            title="Usuń z porównania"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Provider Badge */}
                        <div className="inline-flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded text-xs text-slate-900 dark:text-white">
                          {offer.provider.name}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* AI Score Row */}
                {highestAIScore > 0 && (!showDifferencesOnly || hasDifferences('aiScore')) && (
                  <tr className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="p-4 text-sm text-slate-300 sticky left-0 bg-slate-900/90 backdrop-blur">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        AI Score
                      </div>
                    </td>
                    {comparedOffers.map((offer) => (
                      <td key={offer.id} className="p-4">
                        {offer.aiScore ? (
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-slate-900 dark:text-white">
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
                {(!showDifferencesOnly || hasDifferences('price')) && (
                <tr className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 text-sm text-slate-300 sticky left-0 bg-slate-900/90 backdrop-blur">
                    <div className="flex items-center gap-2">
                      💰 Cena
                    </div>
                  </td>
                  {comparedOffers.map((offer) => (
                    <td key={offer.id} className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-black ${
                          offer.price === lowestPrice ? 'text-green-400' : 'text-white'
                        }`}>
                          {offer.price.toFixed(0)} zł
                        </span>
                        {offer.price === lowestPrice && (
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
                )}

                {/* Dates Row */}
                <tr className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 text-sm text-slate-300 sticky left-0 bg-slate-900/90 backdrop-blur">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Termin
                    </div>
                  </td>
                  {comparedOffers.map((offer) => (
                    <td key={offer.id} className="p-4">
                      <div className="text-sm text-slate-900 dark:text-white">
                        {formatDate(offer.departureDate)}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        powrót: {formatDate(offer.returnDate)}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Duration Row */}
                {(!showDifferencesOnly || hasDifferences('durationDays')) && (
                <tr className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 text-sm text-slate-300 sticky left-0 bg-slate-900/90 backdrop-blur">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Długość
                    </div>
                  </td>
                  {comparedOffers.map((offer) => (
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
                )}

                {/* Departure City Row */}
                {(!showDifferencesOnly || hasDifferences('departureCity')) && (
                <tr className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 text-sm text-slate-300 sticky left-0 bg-slate-900/90 backdrop-blur">
                    <div className="flex items-center gap-2">
                      <Plane className="w-4 h-4" />
                      Wylot z
                    </div>
                  </td>
                  {comparedOffers.map((offer) => (
                    <td key={offer.id} className="p-4">
                      <div className="text-sm text-slate-900 dark:text-white">
                        {offer.departureCity}
                      </div>
                    </td>
                  ))}
                </tr>
                )}

                {/* Board Type Row */}
                {(!showDifferencesOnly || hasDifferences('boardType')) && (
                <tr className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 text-sm text-slate-300 sticky left-0 bg-slate-900/90 backdrop-blur">
                    <div className="flex items-center gap-2">
                      <Utensils className="w-4 h-4" />
                      Wyżywienie
                    </div>
                  </td>
                  {comparedOffers.map((offer) => (
                    <td key={offer.id} className="p-4">
                      <div className="text-sm text-slate-900 dark:text-white">
                        {getBoardTypeLabel(offer.boardType)}
                      </div>
                    </td>
                  ))}
                </tr>
                )}

                {/* Room Type Row */}
                {(!showDifferencesOnly || hasDifferences('roomType')) && (
                <tr className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 text-sm text-slate-300 sticky left-0 bg-slate-900/90 backdrop-blur">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Pokój
                    </div>
                  </td>
                  {comparedOffers.map((offer) => (
                    <td key={offer.id} className="p-4">
                      <div className="text-sm text-slate-900 dark:text-white">
                        {offer.roomType}
                      </div>
                    </td>
                  ))}
                </tr>
                )}

                {/* Flight Info Row */}
                {(!showDifferencesOnly || hasDifferences('airline')) && (
                <tr className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 text-sm text-slate-300 sticky left-0 bg-slate-900/90 backdrop-blur">
                    <div className="flex items-center gap-2">
                      ✈️ Linie lotnicze
                    </div>
                  </td>
                  {comparedOffers.map((offer) => (
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
                )}

                {/* Transfer Row */}
                {(!showDifferencesOnly || hasDifferences('transferIncluded')) && (
                <tr className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 text-sm text-slate-300 sticky left-0 bg-slate-900/90 backdrop-blur">
                    <div className="flex items-center gap-2">
                      🚌 Transfer
                    </div>
                  </td>
                  {comparedOffers.map((offer) => (
                    <td key={offer.id} className="p-4">
                      <div className="flex items-center gap-2">
                        {offer.flightInfo.transferIncluded ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <X className="w-4 h-4 text-red-400" />
                        )}
                        <span className="text-sm text-slate-900 dark:text-white">
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
                )}

                {/* CTA Row */}
                <tr>
                  <td className="p-4 text-sm text-slate-300 sticky left-0 bg-slate-900/90 backdrop-blur">
                    <div className="font-bold">Rezerwacja</div>
                  </td>
                  {comparedOffers.map((offer) => (
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
        )}

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6 text-xs text-slate-400 no-print">
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

      {/* Save & Share Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 no-print">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4">
            {!shareLink ? (
              <>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Zapisz i udostępnij porównanie</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Nadaj nazwę porównaniu, aby móc je później odnaleźć i udostępnić znajomym
                </p>

                <input
                  type="text"
                  value={comparisonName}
                  onChange={(e) => setComparisonName(e.target.value)}
                  placeholder="np. Wakacje 2026 - Grecja"
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 mb-4"
                  autoFocus
                />

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveComparison}
                    disabled={saving || !comparisonName.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 dark:text-white px-4 py-3 rounded-xl font-bold transition"
                  >
                    {saving ? 'Zapisywanie...' : 'Zapisz i generuj link'}
                  </button>
                  <button
                    onClick={() => {
                      setShowSaveModal(false);
                      setComparisonName('');
                    }}
                    className="px-4 py-3 text-slate-400 hover:text-white transition"
                  >
                    Anuluj
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Porównanie zapisane!</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Link gotowy do udostępnienia</p>
                  </div>
                </div>

                <div className="bg-slate-800 border border-white/10 rounded-lg p-4 mb-4">
                  <div className="text-xs text-slate-400 mb-2">Link do udostępnienia:</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={shareLink}
                      readOnly
                      className="flex-1 bg-slate-900 border border-white/10 rounded px-3 py-2 text-sm text-slate-900 dark:text-white"
                    />
                    <button
                      onClick={copyShareLink}
                      className="bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white px-4 py-2 rounded font-bold text-sm transition"
                    >
                      Kopiuj
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowSaveModal(false);
                    setShareLink('');
                    setComparisonName('');
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-900 dark:text-white px-4 py-3 rounded-xl font-bold transition"
                >
                  Zamknij
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferComparison;
