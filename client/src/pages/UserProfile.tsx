import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import GlassCard from '../components/ui/GlassCard';
import { BrainCircuit, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSEO } from '../hooks/useSEO';

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [aiInstructions, setAiInstructions] = useState('');
  const [profileId, setProfileId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  // SEO
  useSEO({
    title: 'Profil i Ustawienia - Preferencje AI | Rezerwuj.ai',
    description: 'Zarządzaj swoim profilem podróżnym, dodaj globalne preferencje AI, twórz grupy podróżne. Spersonalizuj wyszukiwanie wakacji według swoich potrzeb.',
    keywords: 'profil użytkownika, ustawienia wakacje, preferencje ai, instrukcje ai wyszukiwanie, personalizacja ofert wakacyjnych',
  });

  useEffect(() => {
    // Fetch user's travel profile
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/profiles`);
        const result = await response.json();

        if (result.data && result.data.length > 0) {
          // Use first profile (in real app, should be user-specific)
          const profile = result.data[0];
          setProfileId(profile.id);
          setAiInstructions(profile.aiInstructions || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setLoading(true);
    setSaveMessage('');

    try {
      if (profileId) {
        // Update existing profile
        const response = await fetch(`${apiUrl}/api/profiles/${profileId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ aiInstructions })
        });

        if (response.ok) {
          setSaveMessage('✓ Zapisano pomyślnie!');
          setTimeout(() => setSaveMessage(''), 3000);
        } else {
          setSaveMessage('✗ Błąd podczas zapisywania');
        }
      } else {
        // Create new profile
        const response = await fetch(`${apiUrl}/api/profiles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `Profil ${user?.name || 'użytkownika'}`,
            description: 'Moje preferencje podróżne',
            preferences: {},
            aiInstructions
          })
        });

        if (response.ok) {
          const newProfile = await response.json();
          setProfileId(newProfile.id);
          setSaveMessage('✓ Zapisano pomyślnie!');
          setTimeout(() => setSaveMessage(''), 3000);
        } else {
          setSaveMessage('✗ Błąd podczas zapisywania');
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveMessage('✗ Błąd podczas zapisywania');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white antialiased">
      <Navbar variant="profile" />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          <ProfileSidebar />

          <div className="flex-1 space-y-8">
            {/* Travel Groups Card */}
            <Link to="/travel-groups">
              <GlassCard className="p-8 rounded-[2.5rem] border-blue-500/20 bg-blue-600/5 hover:border-blue-500/40 transition cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Grupy Podróżne</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Zarządzaj uczestnikami i twórz grupy wyjazdowe</p>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </GlassCard>
            </Link>

            {/* AI Instructions Card */}
            <GlassCard className="p-8 rounded-[2.5rem] border-blue-500/20 bg-blue-600/5">
              <div className="flex items-center gap-3 mb-6">
                <BrainCircuit className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Globalne Preferencje AI</h3>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Te instrukcje będą uwzględniane dla wszystkich Twoich wyszukiwań. Możesz też dodać specyficzne instrukcje dla poszczególnych grup podróżnych.
              </p>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 block">Dodatkowe instrukcje (widoczne tylko dla AI)</label>
                <textarea
                  value={aiInstructions}
                  onChange={(e) => setAiInstructions(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl p-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 min-h-[80px] placeholder-slate-400"
                  placeholder="Np. Żona nie lubi latać rano. Szukaj hoteli z menu dla alergików..."
                />
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 italic">
                  Te instrukcje są widoczne tylko dla AI i pomagają w doborze idealnych ofert dla Ciebie.
                </p>
              </div>
            </GlassCard>

            <div className="flex justify-end gap-4 items-center">
              {saveMessage && (
                <span className={`text-sm font-medium ${saveMessage.includes('✓') ? 'text-green-400' : 'text-red-400'}`}>
                  {saveMessage}
                </span>
              )}
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-xl text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-white/5 transition"
              >
                Odrzuć zmiany
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold text-sm shadow-xl shadow-blue-600/20 transition"
              >
                {loading ? 'Zapisywanie...' : 'Zapisz ustawienia'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;