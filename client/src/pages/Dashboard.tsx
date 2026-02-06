import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import ComparisonBar from '../components/ComparisonBar';
import { useSEO } from '../hooks/useSEO';
import {
  Users,
  Hotel,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar
} from 'lucide-react';

interface Hotel {
  id: number;
  slug: string;
  name: string;
  address: string;
  city: string;
  country: string;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface Person {
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
  type: 'adult' | 'child';
}

interface TravelGroup {
  id: number;
  name: string;
  description: string | null;
  people: Person[];
  peopleCount: number;
  aiInstructions: string | null;
  createdAt: string;
  updatedAt: string;
}

const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const Dashboard: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [groups, setGroups] = useState<TravelGroup[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch hotels
        const hotelsResponse = await fetch(`${apiUrl}/api/hotels`);
        const hotelsResult = await hotelsResponse.json();
        setHotels(hotelsResult.data || []);

        // Fetch travel groups
        const groupsResponse = await fetch(`${apiUrl}/api/travel-groups`);
        const groupsResult = await groupsResponse.json();
        setGroups(groupsResult.data || []);

        // Fetch recently viewed from API
        if (token) {
          const recentResponse = await fetch(`${apiUrl}/api/recently-viewed?limit=3`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (recentResponse.ok) {
            const recentResult = await recentResponse.json();
            const viewedHotels = recentResult.data.map((rv: any) => rv.hotel);
            setRecentlyViewed(viewedHotels);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats
  const totalPeople = groups.reduce((sum, group) => sum + group.peopleCount, 0);
  const totalChildren = groups.reduce((sum, group) =>
    sum + group.people.filter(p => p.type === 'child').length, 0
  );

  // SEO
  useSEO({
    title: 'Dashboard - Twoje Wakacje | Rezerwuj.ai',
    description: `Zarządzaj swoimi grupami podróżnymi (${groups.length} grup), przeglądaj ostatnio oglądane hotele i otrzymuj AI recommendations. Inteligentne planowanie wakacji z Rezerwuj.ai.`,
    keywords: 'dashboard wakacje, grupy podróżne, planowanie wyjazdu, ai recommendations, ostatnio oglądane hotele',
  });

  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-slate-950">
        <Navbar variant="dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-slate-900 dark:text-white text-sm animate-pulse">Ładowanie...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar variant="dashboard" />

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Witaj z powrotem! Oto podsumowanie Twoich planów podróży.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs text-slate-600 dark:text-slate-500 uppercase font-bold">Grupy</span>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{groups.length}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{totalPeople} osób łącznie</p>
          </div>

          <div className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Hotel className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-xs text-slate-600 dark:text-slate-500 uppercase font-bold">Hotele</span>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{hotels.length}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">dostępnych ofert</p>
          </div>

          <div className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span className="text-xs text-slate-600 dark:text-slate-500 uppercase font-bold">Ostatnio</span>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{recentlyViewed.length}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">przeglądane hotele</p>
          </div>

          <div className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-xs text-slate-600 dark:text-slate-500 uppercase font-bold">Dzieci</span>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{totalChildren}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">w grupach</p>
          </div>
        </div>

        {/* Travel Groups Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Twoje Grupy Podróżne</h2>
            <Link
              to="/travel-groups"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition"
            >
              Zobacz wszystkie
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {groups.length === 0 ? (
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 shadow-sm rounded-2xl p-8 text-center">
              <Users className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Nie masz jeszcze grup</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Utwórz pierwszą grupę aby rozpocząć planowanie</p>
              <Link
                to="/travel-groups"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition"
              >
                <Plus className="w-5 h-5" />
                Utwórz grupę
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.slice(0, 3).map((group) => (
                <Link
                  key={group.id}
                  to="/travel-groups"
                  className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 shadow-sm hover:border-blue-500/30 rounded-2xl p-6 transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{group.name}</h3>
                      {group.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">{group.description}</p>
                      )}
                    </div>
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <span>{group.peopleCount} osób</span>
                    <span>•</span>
                    <span>
                      {group.people.filter(p => p.type === 'adult').length} dorosłych
                    </span>
                    <span>•</span>
                    <span>
                      {group.people.filter(p => p.type === 'child').length} dzieci
                    </span>
                  </div>

                  {group.aiInstructions && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5">
                      <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                        <Sparkles className="w-3 h-3" />
                        <span>Instrukcje AI ustawione</span>
                      </div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recently Viewed Hotels */}
        {recentlyViewed.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ostatnio Przeglądane</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentlyViewed.map((hotel) => (
                <Link
                  key={hotel.id}
                  to={`/hotels/${hotel.slug}`}
                  className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 shadow-sm hover:border-blue-500/30 rounded-2xl overflow-hidden transition group"
                >
                  <div className="h-32 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                    <Hotel className="w-12 h-12 text-blue-400/50" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                      <MapPin className="w-3 h-3" />
                      <span>{hotel.city}, {hotel.country}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Rekomendacje AI dla Twoich Grup</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotels.slice(0, 3).map((hotel, index) => (
              <Link
                key={hotel.id}
                to={`/hotels/${hotel.slug}`}
                className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 shadow-sm hover:border-blue-500/30 rounded-2xl overflow-hidden transition group relative"
              >
                {index === 0 && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      TOP AI
                    </div>
                  </div>
                )}
                <div className="h-32 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                  <Hotel className="w-12 h-12 text-blue-400/50" />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {hotel.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>{hotel.city}, {hotel.country}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                    Polecane na podstawie preferencji Twoich grup
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <ComparisonBar />
      </main>
    </div>
  );
};

export default Dashboard;
