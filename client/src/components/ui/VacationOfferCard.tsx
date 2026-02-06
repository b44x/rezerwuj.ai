import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, Plane, Utensils, Users, ExternalLink, Sparkles, Plus, Check } from 'lucide-react';
import { useComparison } from '../../contexts/ComparisonContext';

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
    imageUrl?: string;
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

interface VacationOfferCardProps {
  offer: Offer;
}

const VacationOfferCard: React.FC<VacationOfferCardProps> = ({ offer }) => {
  const { addToComparison, removeFromComparison, isInComparison, canAddMore } = useComparison();
  const inComparison = isInComparison(offer.id);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
  };

  const getBoardTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'All Inclusive': 'All Inclusive',
      'Half Board': 'HB',
      'Bed & Breakfast': 'BB',
      'Full Board': 'FB',
    };
    return labels[type] || type;
  };

  const handleComparisonToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inComparison) {
      removeFromComparison(offer.id);
    } else if (canAddMore) {
      addToComparison(offer);
    }
  };

  return (
    <Link
      to={`/offers/${offer.id}`}
      className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 transition group block shadow-sm"
    >
      {/* Hotel Image */}
      <div className="relative h-48 bg-slate-800 overflow-hidden">
        {offer.hotel.imageUrl ? (
          <img
            src={offer.hotel.imageUrl}
            alt={offer.hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
        )}

        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Provider Logo Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg">
          <span className="text-xs font-bold text-slate-900">{offer.provider.name}</span>
        </div>

        {/* AI Score Badge */}
        {offer.aiScore && offer.aiScore.score >= 50 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 backdrop-blur px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-bold text-white">{offer.aiScore.score} pkt</span>
          </div>
        )}

        {/* Hotel Location */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xl font-black mb-1 line-clamp-1 text-white drop-shadow-lg">{offer.hotel.name}</h3>
          <div className="flex items-center gap-1 text-sm text-white/90 drop-shadow">
            <MapPin className="w-4 h-4" />
            <span>{offer.hotel.city}, {offer.hotel.country}</span>
          </div>
        </div>
      </div>

      {/* Offer Details */}
      <div className="p-5">
        {/* Departure Info */}
        <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-white/5">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <Plane className="w-3.5 h-3.5" />
              <span>Wylot z</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{offer.departureCity}</div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Termin</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {formatDate(offer.departureDate)} - {formatDate(offer.returnDate)}
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{offer.durationDays} dni</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Utensils className="w-3.5 h-3.5" />
            <span>{getBoardTypeLabel(offer.boardType)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Users className="w-3.5 h-3.5" />
            <span>{offer.roomType}</span>
          </div>
        </div>

        {/* Flight Info */}
        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-3 mb-4">
          <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">Lot: {offer.flightInfo.airline}</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-slate-500">Tam:</div>
              <div className="text-slate-900 dark:text-white font-medium">
                {offer.flightInfo.outbound.departure} → {offer.flightInfo.outbound.arrival}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Powrót:</div>
              <div className="text-slate-900 dark:text-white font-medium">
                {offer.flightInfo.return.departure} → {offer.flightInfo.return.arrival}
              </div>
            </div>
          </div>
          {offer.flightInfo.transferIncluded && (
            <div className="mt-2 pt-2 border-t border-slate-200 dark:border-white/5 text-xs text-blue-600 dark:text-blue-400">
              ✓ Transfer wliczony ({offer.flightInfo.transferDuration})
            </div>
          )}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Cena od</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {offer.price.toFixed(0)} zł
              {offer.pricePerPerson && (
                <span className="text-xs text-slate-500 dark:text-slate-400 font-normal ml-1">/os</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleComparisonToggle}
              className={`p-2.5 rounded-lg font-bold text-sm transition ${
                inComparison
                  ? 'bg-green-600 hover:bg-green-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-white/10'
              } ${!canAddMore && !inComparison ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!canAddMore && !inComparison}
              title={inComparison ? 'Usuń z porównania' : 'Dodaj do porównania'}
            >
              {inComparison ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                window.open(offer.externalUrl, '_blank', 'noopener,noreferrer');
              }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition"
            >
              Rezerwuj
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Reasoning */}
        {offer.aiScore && offer.aiScore.reasoning && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                  AI Score: {offer.aiScore.score}/100
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {offer.aiScore.reasoning}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default VacationOfferCard;
