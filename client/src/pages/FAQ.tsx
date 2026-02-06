import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useSEO, useStructuredData } from '../hooks/useSEO';
import { getFAQSchema } from '../utils/structuredData';
import { ChevronDown, ChevronUp, Search, ArrowRight } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'booking' | 'payment' | 'travel' | 'ai';
}

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs: FAQItem[] = [
    // General
    {
      question: 'Jak działa Rezerwuj.ai?',
      answer: 'Rezerwuj.ai to inteligentna wyszukiwarka wakacji, która wykorzystuje sztuczną inteligencję do dopasowania najlepszych ofert do Twoich potrzeb. Podajesz preferencje (np. "rodzina z dziećmi 6 i 9 lat, all inclusive, aquapark"), a AI analizuje tysiące ofert i pokazuje te najbardziej pasujące.',
      category: 'general',
    },
    {
      question: 'Czy Rezerwuj.ai sprzedaje wczasy?',
      answer: 'Nie, Rezerwuj.ai to agregator i porównywarka ofert. Działamy jak Google dla wakacji - wyszukujemy i porównujemy oferty od różnych biur podróży (TUI, Itaka, Rainbow, Wakacje.pl), ale sama rezerwacja odbywa się na stronie wybranego operatora. Zarabiamy prowizję od partnerów.',
      category: 'general',
    },
    {
      question: 'Czy korzystanie z Rezerwuj.ai jest darmowe?',
      answer: 'Tak! Rezerwuj.ai jest w 100% darmowe dla użytkowników. Nie pobieramy żadnych opłat za wyszukiwanie, porównywanie czy korzystanie z AI. Zarabiamy tylko wtedy, gdy dokonasz rezerwacji u naszych partnerów.',
      category: 'general',
    },

    // AI Features
    {
      question: 'Co to jest AI Scoring?',
      answer: 'AI Scoring to system oceniania ofert (0-100 punktów) na podstawie Twoich preferencji. AI analizuje 7 czynników: dostępność atrakcji dla dzieci, rodzaj wyżywienia, transfer z lotniska, typ pokoju, zgodność z instrukcjami AI, cenę i więcej. Im wyższy score, tym lepiej oferta pasuje do Twoich potrzeb.',
      category: 'ai',
    },
    {
      question: 'Jak działa wyszukiwanie AI?',
      answer: 'Zamiast klikać dziesiątki filtrów, po prostu opisujesz czego szukasz naturalnym językiem: "Hotel z aquaparkiem dla dzieci 6 i 9 lat, all inclusive, wylot z Warszawy w lipcu, budżet do 5000 zł na osobę". AI rozumie Twoje potrzeby i znajduje najbardziej pasujące oferty.',
      category: 'ai',
    },
    {
      question: 'Co to są grupy podróżne?',
      answer: 'Grupy podróżne to sposób na zapisanie składu Twojej rodziny/znajomych (np. "Rodzina: 2 dorosłych + dzieci 6 i 9 lat"). Dzięki temu AI lepiej dopasowuje oferty - np. wie, że potrzebujesz pokój dla 4 osób, hotelu z atrakcjami dla dzieci w tym wieku i płytkiego basenu.',
      category: 'ai',
    },

    // Booking
    {
      question: 'Jak zarezerwować wakacje przez Rezerwuj.ai?',
      answer: 'Po znalezieniu idealnej oferty kliknij przycisk "Rezerwuj". Zostaniesz przekierowany na stronę biura podróży (np. TUI.pl), gdzie dokończysz rezerwację. Ceny i dostępność są aktualizowane na bieżąco, więc to co widzisz u nas = to co zobaczysz u partnera.',
      category: 'booking',
    },
    {
      question: 'Czy mogę zarezerwować bezpośrednio na Rezerwuj.ai?',
      answer: 'Nie, rezerwacja odbywa się zawsze u operatora (TUI, Itaka, itp.). My pokazujemy oferty i porównujemy ceny, ale płatność i umowę zawierasz z biurem podróży. To daje Ci bezpieczeństwo i gwarancję Funduszu Gwarancyjnego.',
      category: 'booking',
    },
    {
      question: 'Co jeśli cena się zmieni po kliknięciu "Rezerwuj"?',
      answer: 'Ceny aktualizujemy co 6 godzin, ale mogą się zmienić w międzyczasie (np. ostatnie miejsca zostały sprzedane). Zawsze sprawdzaj cenę na stronie operatora przed płatnością. Jeśli cena drastycznie się zmieniła, wróć do Rezerwuj.ai - być może inna oferta będzie lepsza.',
      category: 'booking',
    },
    {
      question: 'Czy mogę porównać oferty przed rezerwacją?',
      answer: 'Tak! To jedna z najlepszych funkcji Rezerwuj.ai. Kliknij przycisk "+" przy ofercie aby dodać ją do porównania (max 4 oferty). Później kliknij "Porównaj" i zobaczysz tabelę side-by-side z cenami, terminami, wyżywieniem i wszystkimi szczegółami. Możesz też zapisać porównanie i udostępnić link znajomym/rodzinie.',
      category: 'booking',
    },

    // Payment
    {
      question: 'Jak wygląda płatność za wakacje?',
      answer: 'Płatność realizujesz bezpośrednio u operatora (TUI, Itaka, etc.) po kliknięciu "Rezerwuj". Zazwyczaj płacisz zadatek 20-30% przy rezerwacji, resztę 30 dni przed wylotem. Metody płatności: przelew, BLIK, karta, raty 0%. Rezerwuj.ai nie pobiera żadnych opłat.',
      category: 'payment',
    },
    {
      question: 'Czy mogę płacić ratami?',
      answer: 'Tak, większość biur podróży (TUI, Itaka) oferuje raty 0% przez Santander Consumer Bank, Aion Bank lub PayU. Zwykle 10-20 rat bez odsetek. Szczegóły sprawdź na stronie operatora podczas rezerwacji.',
      category: 'payment',
    },

    // Travel
    {
      question: 'Co oznacza "All Inclusive"?',
      answer: 'All Inclusive to wyżywienie obejmujące: śniadania, obiady, kolacje + napoje (alkoholowe i bezalkoholowe) przez cały dzień + przekąski. W niektórych hotelach też lody, kawa z ekspresu, minibar. To najlepsza opcja dla rodzin z dziećmi - nie martwisz się o jedzenie.',
      category: 'travel',
    },
    {
      question: 'Czym różni się "Half Board" od "Full Board"?',
      answer: 'Half Board (HB) = śniadanie + obiadokolacja (obiad LUB kolacja). Full Board (FB) = śniadanie + obiad + kolacja. All Inclusive (AI) = FB + napoje + przekąski przez cały dzień. Bed & Breakfast (BB) = tylko śniadanie.',
      category: 'travel',
    },
    {
      question: 'Czy w cenie jest transfer z lotniska do hotelu?',
      answer: 'To zależy od oferty. Przy każdej ofercie widzisz informację "Transfer: ✓ Wliczony (35 min)" lub "Transfer: ✗ Brak". Transfer wliczony = autobus czeka na lotnisku i zawozi Cię do hotelu (i z powrotem). Jeśli brak, musisz zorganizować transport sam (taxi, wynajęty samochód).',
      category: 'travel',
    },
    {
      question: 'Co to jest "Last Minute"?',
      answer: 'Last Minute to oferty z wylotem w ciągu 2-4 tygodni, często 30-50% taniej niż regularne ceny. Biura podróży wyprzedają ostatnie miejsca. Idealne jeśli jesteś elastyczny z terminami. Na Rezerwuj.ai filtruj oferty po dacie wylotu aby znaleźć Last Minute.',
      category: 'travel',
    },
    {
      question: 'Jak znaleźć hotel z aquaparkiem dla dzieci?',
      answer: 'Użyj wyszukiwania AI: wpisz "hotel z aquaparkiem dla dzieci 6 i 9 lat". AI automatycznie filtruje oferty z wodną atrakcją. Możesz też użyć filtrów: Amenities → Aquapark (funkcja wkrótce). Najlepsze hotele z aquaparkami: Aqua Fantasy (Turcja), Jungle Aqua Park (Egipt), Eri Beach (Kreta).',
      category: 'travel',
    },
    {
      question: 'Które kierunki są najlepsze dla rodzin z dziećmi?',
      answer: 'TOP 3: 1) Grecja (Kreta, Rodos) - krótki lot, ciepłe morze, płytkie plaże, dużo hoteli all inclusive z aquaparkami. 2) Turcja (Antalya) - najlepsze aquaparki, animacje, ultra all inclusive. 3) Egipt (Hurghada, Sharm) - ciepło cały rok, snorkeling, rafy koralowe. Unikaj: długich lotów (ponad 5h dla małych dzieci).',
      category: 'travel',
    },
  ];

  const categories = [
    { id: 'general', label: 'Ogólne', icon: '❓' },
    { id: 'ai', label: 'AI & Technologia', icon: '🤖' },
    { id: 'booking', label: 'Rezerwacja', icon: '📅' },
    { id: 'payment', label: 'Płatności', icon: '💳' },
    { id: 'travel', label: 'Podróże', icon: '✈️' },
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // SEO
  useSEO({
    title: 'FAQ - Najczęściej Zadawane Pytania o Wakacjach | Rezerwuj.ai',
    description: 'Odpowiedzi na pytania o rezerwację wakacji all inclusive, last minute, AI scoring, porównywanie ofert, płatności ratalne, hotele z aquaparkiem dla dzieci. Wszystko co musisz wiedzieć przed rezerwacją.',
    keywords: 'faq wakacje, pytania all inclusive, jak zarezerwować wakacje, last minute co to jest, hotel z aquaparkiem dzieci, ai scoring, porównywarka ofert, płatność ratalna wakacje',
  });

  useStructuredData(
    getFAQSchema(faqs.map(faq => ({ question: faq.question, answer: faq.answer })))
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar variant="dashboard" />

      <main className="max-w-4xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Najczęściej Zadawane Pytania
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Wszystko co musisz wiedzieć o rezerwacji wakacji z Rezerwuj.ai
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-600 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Szukaj pytania... (np. 'all inclusive')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-lg rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => {
            const count = faqs.filter(f => f.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSearchQuery(cat.id)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-lg text-white text-sm font-medium transition"
              >
                <span className="text-xl">{cat.icon}</span>
                {cat.label}
                <span className="text-slate-600 dark:text-slate-400">({count})</span>
              </button>
            );
          })}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">Nie znaleziono pytań pasujących do "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-400 hover:text-blue-300"
              >
                Wyczyść wyszukiwanie
              </button>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 shadow-sm rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition"
                >
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white pr-4">{faq.question}</h3>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {openIndex === index && (
                  <div className="px-6 pb-6 text-slate-700 dark:text-slate-300 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Nie znalazłeś odpowiedzi?
          </h2>
          <p className="text-slate-300 mb-6">
            Zacznij wyszukiwać wakacje - AI pomoże Ci znaleźć idealne oferty!
          </p>
          <Link
            to="/hotels"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition"
          >
            Znajdź Wakacje
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Popular Searches */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500 mb-4">Popularne wyszukiwania:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Grecja all inclusive',
              'Last minute Egipt',
              'Hotel z aquaparkiem',
              'Wakacje z dziećmi',
              'Turcja lipiec',
              'Wylot z Warszawy',
            ].map((term) => (
              <Link
                key={term}
                to={`/hotels?q=${encodeURIComponent(term)}`}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-lg text-slate-400 hover:text-white text-xs transition"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
