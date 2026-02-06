import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { Users, Plus, X, Edit2, Trash2, UserPlus, Sparkles } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

interface Person {
  name: string;
  birthDate: string; // YYYY-MM-DD format
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

const TravelGroups: React.FC = () => {
  const [groups, setGroups] = useState<TravelGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<TravelGroup | null>(null);

  // Form states
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupAiInstructions, setGroupAiInstructions] = useState('');
  const [newPerson, setNewPerson] = useState<Person>({
    name: '',
    birthDate: '1990-01-01',
    gender: 'male',
    type: 'adult'
  });

  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  // SEO
  useSEO({
    title: 'Grupy Podróżne - Zarządzaj Uczestnikami Wyjazdów | Rezerwuj.ai',
    description: 'Twórz grupy podróżne, dodawaj uczestników (rodzina, znajomi), zarządzaj wiekiem dzieci i preferencjami. AI dopasuje oferty wakacyjne do składu Twojej grupy.',
    keywords: 'grupy podróżne, wakacje z rodziną, zarządzanie uczestnikami wyjazdu, wakacje dla grup, rodzinna podróż organizacja',
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/travel-groups`);
      const result = await response.json();
      setGroups(result.data || []);
    } catch (error) {
      console.error('Error fetching travel groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async () => {
    if (!groupName.trim()) return;

    try {
      const response = await fetch(`${apiUrl}/api/travel-groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: groupName,
          description: groupDescription,
          people: [],
          aiInstructions: groupAiInstructions || null
        })
      });

      if (response.ok) {
        fetchGroups();
        setShowCreateModal(false);
        setGroupName('');
        setGroupDescription('');
        setGroupAiInstructions('');
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const deleteGroup = async (id: number) => {
    if (!confirm('Czy na pewno chcesz usunąć tę grupę?')) return;

    try {
      const response = await fetch(`${apiUrl}/api/travel-groups/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchGroups();
      }
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  const addPersonToGroup = async () => {
    if (!selectedGroup || !newPerson.name.trim()) return;

    try {
      const response = await fetch(`${apiUrl}/api/travel-groups/${selectedGroup.id}/people`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPerson)
      });

      if (response.ok) {
        fetchGroups();
        setShowAddPersonModal(false);
        setSelectedGroup(null);
        setNewPerson({ name: '', birthDate: '1990-01-01', gender: 'male', type: 'adult' });
      }
    } catch (error) {
      console.error('Error adding person:', error);
    }
  };

  const removePerson = async (groupId: number, personIndex: number) => {
    if (!confirm('Czy na pewno chcesz usunąć tę osobę?')) return;

    try {
      const response = await fetch(`${apiUrl}/api/travel-groups/${groupId}/people/${personIndex}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchGroups();
      }
    } catch (error) {
      console.error('Error removing person:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar variant="dashboard" />

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Grupy Podróżne</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Zarządzaj swoimi grupami i uczestnikami wyjazdów</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition"
          >
            <Plus className="w-5 h-5" />
            Nowa Grupa
          </button>
        </div>

        {/* Groups Grid */}
        {loading ? (
          <div className="text-center py-12 text-slate-600 dark:text-slate-400">Ładowanie...</div>
        ) : groups.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 shadow-sm rounded-3xl p-12 text-center">
            <Users className="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Brak grup podróżnych</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Utwórz swoją pierwszą grupę aby rozpocząć planowanie</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition"
            >
              Utwórz pierwszą grupę
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 shadow-sm rounded-3xl p-6 hover:border-blue-500/30 transition"
              >
                {/* Group Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{group.name}</h3>
                    {group.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400">{group.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteGroup(group.id)}
                      className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* People Count */}
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-slate-700 dark:text-slate-300">{group.peopleCount} osób</span>
                </div>

                {/* People List */}
                <div className="space-y-2 mb-4">
                  {group.people.map((person, idx) => {
                    const age = calculateAge(person.birthDate);
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            person.gender === 'male' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-pink-500/20 text-pink-600 dark:text-pink-400'
                          }`}>
                            {person.gender === 'male' ? '♂' : '♀'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white">{person.name}</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              {age} lat • {person.type === 'adult' ? 'Dorosły' : 'Dziecko'}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removePerson(group.id, idx)}
                          className="w-6 h-6 hover:bg-red-500/20 rounded flex items-center justify-center text-red-500 dark:text-red-400 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Add Person Button */}
                <button
                  onClick={() => {
                    setSelectedGroup(group);
                    setShowAddPersonModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white py-3 rounded-xl font-medium transition border border-slate-300 dark:border-white/10"
                >
                  <UserPlus className="w-4 h-4" />
                  Dodaj osobę
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-lg rounded-3xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Nowa Grupa</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 hover:bg-white/10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Nazwa grupy</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="np. Rodzina Kowalskich"
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Opis (opcjonalnie)</label>
                <textarea
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="np. Wakacje 2026 - Grecja"
                  rows={2}
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Instrukcje AI (opcjonalnie)
                </label>
                <textarea
                  value={groupAiInstructions}
                  onChange={(e) => setGroupAiInstructions(e.target.value)}
                  placeholder="np. Preferujemy hotele z animacjami dla dzieci, bez schodów..."
                  rows={2}
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none text-sm"
                />
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 italic">
                  Widoczne tylko dla AI - pomaga w doborze ofert
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white py-3 rounded-xl font-medium transition border border-slate-300 dark:border-white/10"
                >
                  Anuluj
                </button>
                <button
                  onClick={createGroup}
                  disabled={!groupName.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 disabled:dark:bg-slate-700 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition"
                >
                  Utwórz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Person Modal */}
      {showAddPersonModal && selectedGroup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-lg rounded-3xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Dodaj Osobę</h2>
              <button
                onClick={() => {
                  setShowAddPersonModal(false);
                  setSelectedGroup(null);
                }}
                className="w-8 h-8 hover:bg-white/10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Imię i nazwisko</label>
                <input
                  type="text"
                  value={newPerson.name}
                  onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                  placeholder="np. Jan Kowalski"
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Data urodzenia</label>
                  <input
                    type="date"
                    value={newPerson.birthDate}
                    onChange={(e) => setNewPerson({ ...newPerson, birthDate: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Płeć</label>
                  <select
                    value={newPerson.gender}
                    onChange={(e) => setNewPerson({ ...newPerson, gender: e.target.value as 'male' | 'female' })}
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="male">Mężczyzna</option>
                    <option value="female">Kobieta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Typ</label>
                <select
                  value={newPerson.type}
                  onChange={(e) => setNewPerson({ ...newPerson, type: e.target.value as 'adult' | 'child' })}
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="adult">Dorosły</option>
                  <option value="child">Dziecko</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddPersonModal(false);
                    setSelectedGroup(null);
                  }}
                  className="flex-1 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white py-3 rounded-xl font-medium transition border border-slate-300 dark:border-white/10"
                >
                  Anuluj
                </button>
                <button
                  onClick={addPersonToGroup}
                  disabled={!newPerson.name.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 disabled:dark:bg-slate-700 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition"
                >
                  Dodaj
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelGroups;
