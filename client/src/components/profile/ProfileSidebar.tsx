import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Settings2, History, CreditCard } from 'lucide-react';

const ProfileSidebar: React.FC = () => {
  return (
    <aside className="w-full md:w-64 space-y-2 text-sm font-medium">
      <Link to="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
        <Users className="w-4 h-4" /> Grupa Podróżna
      </Link>
      <Link to="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 transition">
        <Settings2 className="w-4 h-4" /> Preferencje AI
      </Link>
      <Link to="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 transition">
        <History className="w-4 h-4" /> Moje Rezerwacje
      </Link>
      <Link to="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 transition">
        <CreditCard className="w-4 h-4" /> Płatności
      </Link>
    </aside>
  );
};

export default ProfileSidebar;
