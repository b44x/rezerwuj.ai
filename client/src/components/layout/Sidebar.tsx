import React from 'react';
import { Cpu, Check, RefreshCcw } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-80 border-r border-white/5 p-6 flex flex-col gap-6 bg-slate-900/30">
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block font-mono text-blue-400">Polecenie dla Agenta</label>
        <textarea
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500 min-h-[120px] resize-none"
          placeholder="Np. 'Zmień na Hiszpanię i szukaj tylko hoteli z klubem dla dzieci'..."
        ></textarea>
        <button className="w-full mt-3 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-sm transition shadow-lg shadow-blue-600/20">
          Aktualizuj wyniki
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <GlassCard className="p-4 space-y-4">
          <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2 uppercase tracking-tight">
            <Cpu className="w-3 h-3 text-blue-500" /> Status Analizy
          </h4>
          <ul className="text-[11px] space-y-3 text-slate-400 font-mono">
            <li className="flex items-center gap-2 text-teal-400"><Check className="w-3 h-3" /> Profil rodziny załadowany</li>
            <li className="flex items-center gap-2 text-teal-400"><Check className="w-3 h-3" /> Pobrano ceny z 4 źródeł</li>
            <li className="flex items-center gap-2 animate-pulse"><RefreshCcw className="w-3 h-3" /> Szukanie opinii o basenach...</li>
          </ul>
        </GlassCard>
      </div>
    </aside>
  );
};

export default Sidebar;
