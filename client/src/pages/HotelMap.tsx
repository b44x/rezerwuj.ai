import React from 'react';
import Navbar from '../components/layout/Navbar';
import MapComponent from '../components/map/MapComponent';
import ProximityCard from '../components/map/ProximityCard';
import GlassCard from '../components/ui/GlassCard';
import { MapPinned } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const HotelMap: React.FC = () => {
  // SEO
  useSEO({
    title: 'Mapa Hoteli - Smart Proximity Analysis | Rezerwuj.ai',
    description: 'Interaktywna mapa hoteli z analizą otoczenia wykonaną przez AI. Sprawdź odległości do plaży, sklepów, lotniska i punktów medycznych. Idealny wybór lokalizacji dla Twojej rodziny.',
    keywords: 'mapa hoteli, lokalizacja hotelu, odległość do plaży, otoczenie hotelu, proximity analysis, hotel blisko plaży',
  });

  const center: [number, number] = [35.33, 25.39]; // Example coordinates (Crete)
  const hotelLocation: [number, number] = [35.332, 25.391];
  const pointsOfInterest: Array<{ position: [number, number]; name: string; type: 'beach' | 'supermarket' }> = [
    { position: [35.335, 25.385], name: 'Plaża Piaszczysta', type: 'beach' },
    { position: [35.328, 25.400], name: 'Supermarket Lidl', type: 'supermarket' },
  ];

  const distances: Array<{ icon: 'waves' | 'shopping-cart' | 'plane-landing' | 'stethoscope'; title: string; distance: string; time: string; color: 'teal' | 'blue' | 'orange' | 'red' }> = [
    { icon: 'waves', title: 'Plaża Laguna', distance: '150m', time: '2 min spacerem', color: 'teal' },
    { icon: 'shopping-cart', title: 'Sklepy i Bary', distance: '850m', time: '12 min spacerem', color: 'blue' },
    { icon: 'plane-landing', title: 'Lotnisko (HER)', distance: '22 km', time: '25 min taxi', color: 'orange' },
    { icon: 'stethoscope', title: 'Punkt Medyczny', distance: '400m', time: '5 min spacerem', color: 'red' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white antialiased">
      <Navbar variant="profile" />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <MapPinned className="w-8 h-8 text-blue-600 dark:text-blue-500" /> Smart Proximity
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1 italic text-sm">Analiza otoczenia hotelu wykonana przez AI na podstawie map Google.</p>
          </div>
          <div className="flex gap-2 font-mono text-[10px]">
            <span className="bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-500/20 px-3 py-1 rounded-full">LAT: {hotelLocation[0]}</span>
            <span className="bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-500/20 px-3 py-1 rounded-full">LNG: {hotelLocation[1]}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 h-[600px] rounded-[3rem] overflow-hidden border border-white/10 relative shadow-2xl">
            <MapComponent center={center} zoom={14} hotelLocation={hotelLocation} pointsOfInterest={pointsOfInterest} className="h-full w-full rounded-[3rem]" />

            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
              <GlassCard className="p-6 rounded-[2rem] max-w-sm pointer-events-auto">
                <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-3">Werdykt AI: Lokalizacja</h4>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic">
                  "Hotel położony idealnie pod Twój profil. Z dala od głośnych klubów, ale z bezpośrednim przejściem podziemnym na plażę. Twoje dzieci nie muszą przechodzić przez ulicę."
                </p>
              </GlassCard>

              <div className="flex flex-col gap-2 pointer-events-auto">
                <GlassCard className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white hover:bg-white/10 transition cursor-pointer">+</GlassCard>
                <GlassCard className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white hover:bg-white/10 transition cursor-pointer">-</GlassCard>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-4">
            <GlassCard className="p-6 rounded-[2.5rem] border-white/5 h-full">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest">Dystanse</h3>

              <div className="space-y-6">
                {distances.map((item, index) => (
                  <ProximityCard key={index} {...item} />
                ))}
              </div>

              <div className="mt-10 p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold mb-2">Transport w okolicy</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-700 dark:text-slate-300">Przystanek autobusowy</span>
                  <span className="text-slate-900 dark:text-white font-mono">100m</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HotelMap;