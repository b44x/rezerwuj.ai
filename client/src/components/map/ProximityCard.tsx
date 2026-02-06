import React from 'react';
import { Waves, ShoppingCart, PlaneLanding, Stethoscope } from 'lucide-react';

interface ProximityCardProps {
  icon: 'waves' | 'shopping-cart' | 'plane-landing' | 'stethoscope';
  title: string;
  distance: string;
  time: string;
  color: 'teal' | 'blue' | 'orange' | 'red';
}

const iconMap = {
  'waves': Waves,
  'shopping-cart': ShoppingCart,
  'plane-landing': PlaneLanding,
  'stethoscope': Stethoscope,
};

const ProximityCard: React.FC<ProximityCardProps> = ({ icon, title, distance, time, color }) => {
  const IconComponent = iconMap[icon];
  const bgColorClass = `bg-${color}-500/10`;
  const textColorClass = `text-${color}-400`;

  return (
    <div className="flex gap-4">
      <div className={`w-10 h-10 rounded-xl ${bgColorClass} flex items-center justify-center ${textColorClass} flex-shrink-0`}>
        <IconComponent className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-bold text-white">{title}</p>
        <p className="text-[10px] text-slate-500">{distance} · {time}</p>
      </div>
    </div>
  );
};

export default ProximityCard;
