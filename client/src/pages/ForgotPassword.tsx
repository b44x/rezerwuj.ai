import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

const ForgotPassword: React.FC = () => {
  // SEO - noindex for auth pages
  useSEO({
    title: 'Resetowanie Hasła - Rezerwuj.ai',
    description: 'Zapomniałeś hasła? Zresetuj hasło do swojego konta Rezerwuj.ai.',
    robots: 'noindex, nofollow',
  });

  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/auth/password/reset-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        throw new Error('Request failed');
      }
    } catch (err) {
      setError('Coś poszło nie tak. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
              REZERWUJ<span className="text-blue-500">.AI</span>
            </h1>
          </div>

          <div className="bg-white dark:bg-slate-900/60 backdrop-blur border border-white/5 rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Email wysłany!</h2>
              <p className="text-slate-400 text-sm">
                Jeśli konto z tym adresem email istnieje, wysłaliśmy link do resetowania hasła.
              </p>
            </div>

            <Link
              to="/login"
              className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold transition"
            >
              Wróć do logowania
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            REZERWUJ<span className="text-blue-500">.AI</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Zresetuj swoje hasło</p>
        </div>

        <div className="bg-white dark:bg-slate-900/60 backdrop-blur border border-white/5 rounded-2xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <p className="text-slate-400 text-sm mb-6">
            Podaj adres email przypisany do Twojego konta, a wyślemy Ci link do resetowania hasła.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                placeholder="twoj@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Wysyłanie...' : 'Wyślij link resetujący'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              ← Wróć do logowania
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
