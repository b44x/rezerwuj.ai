import React from 'react';
import { Link } from 'react-router-dom';
import { useComparison } from '../contexts/ComparisonContext';
import { X, ArrowRight, Layers } from 'lucide-react';

const ComparisonBar: React.FC = () => {
  const { comparedOffers, removeFromComparison, clearComparison } = useComparison();

  if (comparedOffers.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-white/10 p-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Selected offers */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Porównanie ({comparedOffers.length}/4)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {comparedOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 flex items-center gap-2 group"
              >
                <div className="text-xs text-white truncate max-w-[150px]">
                  {offer.hotel.name}
                </div>
                <button
                  onClick={() => removeFromComparison(offer.id)}
                  className="text-slate-400 hover:text-red-400 transition"
                  aria-label="Usuń z porównania"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={clearComparison}
            className="text-sm text-slate-400 hover:text-white transition"
          >
            Wyczyść
          </button>
          <Link
            to="/compare"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold text-sm transition"
          >
            Porównaj
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComparisonBar;
