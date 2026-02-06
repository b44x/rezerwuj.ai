import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ChevronRight } from 'lucide-react';
import GlassCard from './ui/GlassCard';

interface OfferCardProps {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: string;
  priceUnit: string;
  imageUrl: string;
  rating: string;
  isTopChoice?: boolean;
  isStandardOffer?: boolean;
}

const OfferCard: React.FC<OfferCardProps> = ({
  id,
  slug,
  title,
  description,
  price,
  priceUnit,
  imageUrl,
  rating,
  isTopChoice = false,
  isStandardOffer = false,
}) => {
  return (
    <Link to={`/hotels/${slug}`}>
      <GlassCard className={`rounded-[2rem] overflow-hidden transition-all duration-300 border border-white/5 flex flex-col hover:border-blue-500/50 cursor-pointer ${isStandardOffer ? 'opacity-90' : ''}`}>
        <div className="relative h-48">
          <img src={imageUrl} className={`w-full h-full object-cover ${isStandardOffer ? 'grayscale-[30%]' : ''}`} alt={title} />
          {isTopChoice && (
            <div className="absolute top-4 left-4 bg-blue-600 text-[10px] font-black px-2 py-1 rounded">TOP WYBÓR</div>
          )}
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">★ {rating}</div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-4 flex-1 italic">{description}</p>

          <div className="flex justify-between items-end pt-4 border-t border-white/5">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{isStandardOffer ? 'Cena standard' : 'Cena AI'}</span>
              <div className={`text-xl font-black ${isStandardOffer ? 'text-slate-300' : 'text-white'}`}>{price} <span className={`text-xs font-normal ${isStandardOffer ? 'text-slate-500' : ''}`}>{priceUnit}</span></div>
            </div>
            <div className={`p-3 rounded-xl transition ${isStandardOffer ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-blue-600 hover:bg-blue-500'}`}>
              {isStandardOffer ? <ChevronRight className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
};

export default OfferCard;
