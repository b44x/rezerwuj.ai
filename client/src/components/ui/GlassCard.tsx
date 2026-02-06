import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white/80 dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm ${className || ''}`}>
      {children}
    </div>
  );
};

export default GlassCard;
