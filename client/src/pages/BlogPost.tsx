import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useSEO, useStructuredData } from '../hooks/useSEO';
import { getBreadcrumbSchema } from '../utils/structuredData';
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Mock blog post data (in production, fetch from API/CMS)
const blogPosts: Record<string, any> = {
  'najlepsze-hotele-z-aquaparkiem-dla-dzieci-2026': {
    title: 'TOP 10 Hoteli z Aquaparkiem dla Dzieci w 2026 - Grecja, Turcja, Egipt',
    excerpt: 'Sprawdź ranking najlepszych hoteli z aquaparkami w Europie i Afryce Północnej. Porównanie cen, atrakcji wodnych, opinii rodzin i dostępności All Inclusive.',
    content: `
# TOP 10 Hoteli z Aquaparkiem dla Dzieci w 2026

Planujesz wakacje z dziećmi i szukasz hotelu z aquaparkiem? Przygotowaliśmy ranking **10 najlepszych hoteli rodzinnych** z fantastycznymi parkami wodnymi w Grecji, Turcji i Egipcie. Wszystkie hotele oferują **All Inclusive** i zostały wysoko ocenione przez rodziny.

## Kryteria Rankingu

Przy tworzeniu listy wzięliśmy pod uwagę:
- ✅ **Rozmiar aquaparku** (liczba zjeżdżalni, basenów)
- ✅ **Bezpieczeństwo** (ratownicy, płytkie strefy dla małych dzieci)
- ✅ **Oceny rodzin** (opinie z TripAdvisor, Google, biur podróży)
- ✅ **Stosunek jakości do ceny**
- ✅ **Dostępność All Inclusive**
- ✅ **Infrastruktura** (animacje, kids club, plac zabaw)

---

## 🏆 #1 Aqua Fantasy (Kusadasi, Turcja)

**Cena:** od 4,200 zł/osoba (7 dni, AI, wylot z Warszawy)

### Dlaczego wygrał?
- **19 zjeżdżalni wodnych** + rzeka leniwa 600m
- Aquapark czynny 10h dziennie (10:00-20:00)
- Strefa dla małych dzieci (0-5 lat) z mini zjeżdżalniami
- Ultra All Inclusive (napoje premium, lody bez limitu)
- Kids club (4-12 lat) + Teen club (13-17 lat)

### Dla kogo?
Rodziny z dziećmi **6-12 lat** - idealny wiek na większość atrakcji. Dla młodszych dzieci też świetnie (bezpieczna strefa).

### Opinie:
> "Najlepszy aquapark w jakim byliśmy. Dzieci (8 i 11 lat) nie chciały wychodzić z wody!" - Anna, Warszawa

[➡️ Sprawdź Oferty Aqua Fantasy](https://rezerwuj.ai/hotels/aqua-fantasy-kusadasi)

---

## 🥈 #2 Eri Beach & Village (Kreta, Grecja)

**Cena:** od 3,800 zł/osoba (7 dni, AI, wylot z Katowic)

### Dlaczego tak wysoko?
- **7 basenów** w tym aquapark z 5 zjeżdżalniami
- Położenie: 50m od piaszczystej plaży
- Krótki lot (3h z Polski)
- Doskonałe jedzenie (grecka kuchnia)
- Darmowy parking (jeśli wypożyczasz auto)

### Dla kogo?
Rodziny z **małymi dziećmi (2-6 lat)** - płytkie baseny, bezpieczne, mniejsze tłumy.

---

## 🥉 #3 Jungle Aqua Park (Hurghada, Egipt)

**Cena:** od 3,200 zł/osoba (7 dni, AI, wylot z Poznania)

### Dlaczego TOP 3?
- **35 zjeżdżalni** (największy aquapark w Egipcie!)
- Ciepło przez cały rok (idealny na ferie zimowe)
- Rafy koralowe - snorkeling dla starszych dzieci
- Najtańsza opcja z TOP 3

### Dla kogo?
Rodziny z dziećmi **8+ lat** (aktywne, lubiące mocne wrażenia) + dorośli (też się świetnie bawią).

---

## 🏅 #4-10: Pozostałe Hotele

### #4 Rixos Premium Belek (Turcja)
- **Cena:** 5,500 zł/osoba
- **Wyróżnik:** Luksusowy, aquapark + land of legends park wejściówka gratis
- **Dla kogo:** Rodziny szukające premium experience

### #5 Albatros Aqua Park (Sharm el-Sheikh, Egipt)
- **Cena:** 3,400 zł/osoba
- **Wyróżnik:** 12 zjeżdżalni, świetny snorkeling
- **Dla kogo:** Rodziny z dziećmi 10+, miłośnicy nurkowania

### #6 Splash World Venus Beach (Antalya, Turcja)
- **Cena:** 3,900 zł/osoba
- **Wyróżnik:** Aquapark bezpośrednio przy plaży
- **Dla kogo:** Rodziny łączące plażę + aquapark

### #7 Mitsis Laguna Resort (Kreta, Grecja)
- **Cena:** 4,100 zł/osoba
- **Wyróżnik:** Grecka kuchnia + aquapark
- **Dla kogo:** Rodziny ceniące quality time i jedzenie

### #8 Titanic Beach Lara (Antalya, Turcja)
- **Cena:** 3,700 zł/osoba
- **Wyróżnik:** Duży aquapark + piaszczysta plaża
- **Dla kogo:** Rodziny z dziećmi różnych wieku (2-14 lat)

### #9 Hawaii Caesar Palace (Hurghada, Egipt)
- **Cena:** 2,900 zł/osoba (NAJTANIEJ!)
- **Wyróżnik:** Świetny stosunek jakości do ceny
- **Dla kogo:** Rodziny z budżetem, szukające okazji

### #10 Aqua Blue Resort (Hersonissos, Kreta)
- **Cena:** 3,600 zł/osoba
- **Wyróżnik:** Średniej wielkości aquapark + TOP lokalizacja
- **Dla kogo:** Rodziny chcące zwiedzać Kretę (wycieczki)

[➡️ Porównaj Wszystkie Hotele](https://rezerwuj.ai/hotels?amenity=aquapark)

---

## 💡 Praktyczne Porady

### Kiedy Jechać?
- **Czerwiec/Wrzesień:** Najlepsze ceny, mniej ludzi, ciepłe morze
- **Lipiec/Sierpień:** Najcieplej, najdrożej, najwięcej rodzin
- **Ferie zimowe:** Egipt (25°C) - świetna alternatywa

### Co Spakować?
- ✅ Krem z filtrem SPF 50+ (aquaparki = pełne słońce)
- ✅ Klapki do wody (gorące płytki wokół basenów)
- ✅ Rashguard dla dzieci (ochrona przed słońcem)
- ✅ Wodoodporny aparat (uwiecznić zjazdy!)

### Zasady Bezpieczeństwa
- 🔴 Zawsze sprawdź wysokość dziecka (minimalna dla zjeżdżalni: 110-120cm)
- 🔴 Kamizelki ratunkowe dla niepływających (dostępne w hotelach)
- 🔴 Nie zostawiaj małych dzieci bez opieki (nawet na chwilę)
- 🔴 Pij dużo wody (łatwo o odwodnienie w aquaparku)

---

## ❓ FAQ

**Czy All Inclusive obejmuje aquapark?**
Tak, wszystkie hotele w rankingu mają aquapark wliczony w cenę All Inclusive. Nie płacisz ekstra.

**Czy aquaparki są czynne cały dzień?**
Zazwyczaj 10:00-18:00 lub 10:00-20:00. W upalne dni mogą zamykać najczęściej używane zjeżdżalnie na 1-2h (konserwacja).

**Czy są animacje w aquaparku?**
Większość hoteli organizuje water aerobic, water polo, konkursy. Sprawdź program animacji w hotelu.

**Jaki wiek dziecka jest minimalny?**
Dla strefy dziecięcej: 0+ (z opiekunem). Dla zjeżdżalni: 6-8 lat (w zależności od wysokości).

---

## 🎯 Podsumowanie

**TOP 3 Rekomendacje:**

1. **Aqua Fantasy (Turcja)** - najlepszy aquapark, ultra all inclusive → rodziny z dziećmi 6-12 lat
2. **Eri Beach (Grecja)** - dla małych dzieci, blisko plaży, krótki lot → rodziny z dziećmi 2-6 lat
3. **Jungle Aqua Park (Egipt)** - najtaniej, największy aquapark → rodziny aktywne, dzieci 8+

**Nie możesz się zdecydować?**
Użyj [AI Search na Rezerwuj.ai](https://rezerwuj.ai/hotels) - opisz swoje potrzeby (np. "hotel z aquaparkiem dla dzieci 6 i 9 lat, all inclusive, budżet 4000 zł, lipiec"), a AI znajdzie najlepsze dopasowanie!

---

## 📌 Przydatne Linki

- [Wszystkie Hotele z Aquaparkiem](https://rezerwuj.ai/hotels?amenity=aquapark)
- [Porównywarka Ofert](https://rezerwuj.ai/compare)
- [FAQ - Wakacje z Dziećmi](https://rezerwuj.ai/faq)
- [Blog - Więcej Poradników](https://rezerwuj.ai/blog)
`,
    category: 'Poradniki',
    readTime: '8 min',
    date: '2026-01-15',
    author: 'Zespół Rezerwuj.ai',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200',
  },
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogPosts[slug] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Post nie znaleziony</h1>
          <Link to="/blog" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
            ← Wróć do bloga
          </Link>
        </div>
      </div>
    );
  }

  // SEO
  useSEO({
    title: post.title,
    description: post.excerpt,
    keywords: 'hotel z aquaparkiem dzieci, najlepsze hotele aquapark 2026, grecja turcja egipt aquapark, all inclusive aquapark ranking, wakacje rodzinne aquapark',
    type: 'article',
    url: `https://rezerwuj.ai/blog/${slug}`,
    image: post.image,
  });

  useStructuredData({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Rezerwuj.ai',
      logo: {
        '@type': 'ImageObject',
        url: 'https://rezerwuj.ai/logo.png',
      },
    },
    ...getBreadcrumbSchema([
      { name: 'Home', url: 'https://rezerwuj.ai' },
      { name: 'Blog', url: 'https://rezerwuj.ai/blog' },
      { name: post.title, url: `https://rezerwuj.ai/blog/${slug}` },
    ]),
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar variant="dashboard" />

      <article className="max-w-4xl mx-auto px-8 py-12">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Wróć do bloga
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-600/20 border border-blue-300 dark:border-blue-500/30 rounded-lg text-xs font-bold text-blue-700 dark:text-blue-400 mb-4">
            {post.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('pl-PL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-12 rounded-2xl overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-[400px] object-cover" />
        </div>

        {/* Content */}
        <div className="space-y-8">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 leading-tight">
                  {children}
                </h1>
              ),
              h2: ({ children }) => {
                const text = String(children);
                const match = text.match(/^(🏆|🥈|🥉|🏅)\s*#(\d+)\s+(.+)/);
                if (match) {
                  const [, emoji, number, title] = match;
                  const colors = {
                    '1': 'from-yellow-500 to-amber-500',
                    '2': 'from-slate-300 to-slate-400',
                    '3': 'from-orange-500 to-amber-600',
                  };
                  const bgColor = colors[number as keyof typeof colors] || 'from-blue-600 to-purple-600';

                  return (
                    <div className="mt-16 mb-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur border border-blue-200 dark:border-white/10 rounded-3xl p-8 shadow-xl hover:border-blue-400 dark:hover:border-blue-500/30 transition">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-6xl">{emoji}</span>
                        <div className="flex-1">
                          <div className={`inline-block px-5 py-2 bg-gradient-to-r ${bgColor} rounded-xl text-white font-black text-2xl mb-2 shadow-lg`}>
                            #{number}
                          </div>
                          <h2 className="text-3xl font-black text-slate-900 dark:text-white">{title}</h2>
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-16 mb-8 border-l-4 border-blue-600 dark:border-blue-500 pl-6 bg-gradient-to-r from-blue-100 dark:from-blue-600/10 to-transparent py-4 rounded-r-xl">
                    {children}
                  </h2>
                );
              },
              h3: ({ children }) => (
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-8 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-6">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="space-y-3 mb-6">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="space-y-4 mb-8">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-slate-700 dark:text-slate-300 text-lg flex items-start gap-3">
                  <span className="text-blue-400 mt-1 flex-shrink-0">→</span>
                  <span className="flex-1">{children}</span>
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="my-8 bg-gradient-to-r from-blue-100 dark:from-blue-600/10 to-purple-100 dark:to-purple-600/10 border-l-4 border-blue-500 rounded-r-2xl p-6 italic">
                  <div className="text-slate-800 dark:text-slate-200 text-lg leading-relaxed">
                    {children}
                  </div>
                </blockquote>
              ),
              a: ({ href, children }) => {
                if (href?.startsWith('https://rezerwuj.ai')) {
                  return (
                    <a
                      href={href}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition no-underline shadow-lg shadow-blue-600/20 my-4"
                    >
                      {children}
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  );
                }
                return (
                  <a href={href} className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline decoration-blue-400/30 underline-offset-4 transition">
                    {children}
                  </a>
                );
              },
              hr: () => (
                <hr className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
              ),
              strong: ({ children }) => {
                const text = String(children);
                // Highlight prices
                if (text.match(/\d{1,3}[,\s]?\d{3}\s*zł/)) {
                  return (
                    <strong className="text-2xl font-black text-green-400 bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20">
                      {children}
                    </strong>
                  );
                }
                // Highlight stats/numbers
                if (text.match(/^\d+/)) {
                  return (
                    <strong className="text-xl font-black text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                      {children}
                    </strong>
                  );
                }
                return (
                  <strong className="text-slate-900 dark:text-white font-bold bg-slate-200 dark:bg-white/5 px-2 py-0.5 rounded">
                    {children}
                  </strong>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Share & Actions */}
        <div className="mt-12 pt-8 border-t border-slate-300 dark:border-white/10 flex items-center justify-between">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-lg text-slate-900 dark:text-white text-sm font-bold transition">
            <Share2 className="w-4 h-4" />
            Udostępnij
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-lg text-slate-900 dark:text-white text-sm font-bold transition">
            <Bookmark className="w-4 h-4" />
            Zapisz
          </button>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-600/20 dark:to-purple-600/20 border border-blue-300 dark:border-blue-500/20 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Gotowy znaleźć idealny hotel?
          </h3>
          <p className="text-slate-700 dark:text-slate-300 mb-6">
            Użyj AI aby przeszukać tysiące ofert i znaleźć hotel z aquaparkiem dopasowany do Twojej rodziny
          </p>
          <Link
            to="/hotels?amenity=aquapark"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition"
          >
            Szukaj Hoteli z Aquaparkiem
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
