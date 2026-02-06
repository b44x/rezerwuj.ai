import React from 'react';
import { User, Baby, MoreVertical } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

interface TravelerCardProps {
  name: string;
  type: 'adult' | 'child';
  birthYear: number;
  age?: number; // Optional for children
  passportStatus?: string; // e.g., "Paszport OK"
}

const TravelerCard: React.FC<TravelerCardProps> = ({
  name,
  type,
  birthYear,
  age,
  passportStatus,
}) => {
  const icon = type === 'adult' ? <User className="w-5 h-5" /> : <Baby className="w-5 h-5" />;
  const iconColorClass = type === 'adult' ? 'text-blue-500' : 'text-teal-500';
  const bgColorClass = type === 'adult' ? 'bg-blue-500/20' : 'bg-teal-500/20';

  return (
    <GlassCard className="p-5 rounded-2xl flex items-center justify-between border-white/10 group hover:border-blue-500/30 transition">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full ${bgColorClass} flex items-center justify-center ${iconColorClass}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-white">{name}</p>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-none">
            {type === 'adult' ? 'Dorosły' : `Dziecko`} · {birthYear} {age ? `(${age} lat)` : ''}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {passportStatus && (
          <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-slate-500 uppercase font-bold tracking-tighter">{passportStatus}</span>
        )}
        <MoreVertical className="w-4 h-4 text-slate-600 cursor-pointer" />
      </div>
    </GlassCard>
  );
};

export default TravelerCard;
