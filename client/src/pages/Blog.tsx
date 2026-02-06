import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useSEO } from '../hooks/useSEO';
import { Calendar, Clock, ArrowRight, TrendingUp } from 'lucide-react';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  featured?: boolean;
}

const Blog: React.FC = () => {
  const posts: BlogPost[] = [
    {
      slug: 'najlepsze-hotele-z-aquaparkiem-dla-dzieci-2026',
      title: 'TOP 10 Hoteli z Aquaparkiem dla Dzieci w 2026 - Grecja, Turcja, Egipt',
      excerpt: 'Sprawdź ranking najlepszych hoteli z aquaparkami w Europie i Afryce Północnej. Porównanie cen, atrakcji wodnych, opinii rodzin i dostępności All Inclusive.',
      category: 'Poradniki',
      readTime: '8 min',
      date: '2026-01-15',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
      featured: true,
    },
    {
      slug: 'jak-znalezc-tanie-wakacje-last-minute',
      title: 'Jak Znaleźć Tanie Wakacje Last Minute? 7 Sprawdzonych Sposobów',
      excerpt: 'Last minute to oszczędność nawet 50%! Poznaj triki, jak znaleźć najlepsze oferty last minute, kiedy rezerwować i jak uniknąć pułapek.',
      category: 'Oszczędzanie',
      readTime: '6 min',
      date: '2026-01-10',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
    },
    {
      slug: 'all-inclusive-przewodnik-rodzica',
      title: 'All Inclusive - Kompleksowy Przewodnik dla Rodziców 2026',
      excerpt: 'Co dokładnie obejmuje All Inclusive? Które hotele mają najlepsze AI? Czy warto dopłacać? Wszystko co musisz wiedzieć przed rezerwacją.',
      category: 'Poradniki',
      readTime: '10 min',
      date: '2026-01-05',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    },
    {
      slug: 'grecja-czy-turcja-rodziny-z-dziecmi',
      title: 'Grecja czy Turcja dla Rodziny z Dziećmi? Szczera Porównanie 2026',
      excerpt: 'Kreta vs Antalya - co wybrać? Porównujemy plaże, hotele, aquaparki, ceny, bezpieczeństwo i czas lotu. Konkretne rekomendacje dla różnych grup wiekowych dzieci.',
      category: 'Kierunki',
      readTime: '12 min',
      date: '2025-12-20',
      image: 'https://images.unsplash.com/photo-1601581987809-a874a81309c9?w=800',
    },
    {
      slug: 'jak-dziala-ai-w-wyszukiwaniu-wakacji',
      title: 'Jak AI Pomaga Znaleźć Idealne Wakacje? [Technologia]',
      excerpt: 'Przyszłość rezerwacji wakacji już tu jest. Zobacz jak sztuczna inteligencja analizuje tysiące ofert i znajduje te najbardziej dopasowane do Twoich potrzeb.',
      category: 'Technologia',
      readTime: '5 min',
      date: '2025-12-15',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    },
    {
      slug: 'checklist-wakacje-z-malymi-dziecmi',
      title: 'Checklist: Wakacje z Małymi Dziećmi (0-5 lat) - Co Spakować?',
      excerpt: 'Kompletna lista rzeczy do spakowania na wakacje z niemowlakiem i małym dzieckiem. PDF do pobrania + lista zakupów na miejscu.',
      category: 'Praktyczne',
      readTime: '7 min',
      date: '2025-12-01',
      image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800',
    },
  ];

  const categories = ['Wszystkie', 'Poradniki', 'Oszczędzanie', 'Kierunki', 'Technologia', 'Praktyczne'];

  // SEO
  useSEO({
    title: 'Blog - Porady o Wakacjach, Last Minute, Hotele dla Rodzin | Rezerwuj.ai',
    description: 'Praktyczne porady o wakacjach all inclusive, last minute, hotelach z aquaparkiem dla dzieci. Rankingi, porównania kierunków (Grecja, Turcja, Egipt), przewodniki dla rodziców.',
    keywords: 'blog wakacje, porady last minute, hotele z aquaparkiem ranking, wakacje z dziećmi porady, grecja czy turcja, all inclusive przewodnik, tanie wakacje jak znaleźć',
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar variant="dashboard" />

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Blog Rezerwuj.ai
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Praktyczne porady, rankingi hoteli i przewodniki dla rodziców planujących wakacje
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                cat === 'Wszystkie'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:border-blue-500/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {posts.filter(p => p.featured).map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="block mb-12 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-600/10 dark:to-purple-600/10 border border-blue-300 dark:border-blue-500/20 rounded-3xl overflow-hidden hover:border-blue-500 dark:hover:border-blue-500/40 transition group"
          >
            <div className="md:flex">
              <div className="md:w-1/2 h-64 md:h-auto bg-slate-800">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 mb-4">
                  <TrendingUp className="w-4 h-4" />
                  WYRÓŻNIONY
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {post.title}
                </h2>
                <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString('pl-PL')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.filter(p => !p.featured).map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 shadow-sm rounded-2xl overflow-hidden hover:border-blue-500/30 transition group"
            >
              <div className="h-48 bg-slate-800 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-600/20 border border-blue-300 dark:border-blue-500/30 rounded-lg text-xs font-bold text-blue-700 dark:text-blue-400 mb-3">
                  {post.category}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {post.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.date).toLocaleDateString('pl-PL')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-600/20 dark:to-purple-600/20 border border-blue-300 dark:border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Gotowy na wakacje?
          </h2>
          <p className="text-slate-700 dark:text-slate-300 mb-6">
            Znajdź idealne oferty dopasowane do Twoich potrzeb z pomocą AI
          </p>
          <Link
            to="/hotels"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition"
          >
            Zacznij Wyszukiwać
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Blog;
