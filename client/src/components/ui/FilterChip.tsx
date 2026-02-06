import React from 'react';
import { X } from 'lucide-react';

interface FilterChipProps {
  label: string;
  isActive?: boolean;
  onRemove?: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, isActive = false, onRemove }) => {
  const activeClasses = 'bg-blue-500 text-white';
  const inactiveClasses = 'bg-white/5 border border-white/10 text-slate-400';

  return (
    <span className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-2 ${isActive ? activeClasses : inactiveClasses}`}>
      {label}
      {isActive && onRemove && <X className="w-3 h-3 cursor-pointer" onClick={onRemove} />}
    </span>
  );
};

export default FilterChip;
