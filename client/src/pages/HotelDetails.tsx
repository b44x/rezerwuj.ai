import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {
  ArrowLeft,
  MapPin,
  Star,
  Wifi,
  Waves,
  Coffee,
  Wind,
  Car,
  Dumbbell,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useSEO, useStructuredData } from '../hooks/useSEO';
import { getHotelSchema, getBreadcrumbSchema } from '../utils/structuredData';
import 'leaflet/dist/leaflet.css';

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

const HotelDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  const minSwipeDistance = 50;

  // Mock images - w przyszłości będą z API
  const images = [
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200',
  ];

  // Mock amenities - w przyszłości z API
  const amenities = [
    { icon: Wifi, label: 'Darmowe WiFi' },
    { icon: Waves, label: 'Basen' },
    { icon: Coffee, label: 'Restauracja' },
    { icon: Wind, label: 'Klimatyzacja' },
    { icon: Car, label: 'Parking' },
    { icon: Dumbbell, label: 'Siłownia' },
  ];

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/hotels/${slug}`);

        if (!response.ok) {
          throw new Error('Hotel nie został znaleziony');
        }

        const data = await response.json();
        setHotel(data);

        // Track recently viewed via API
        const token = localStorage.getItem('token');
        if (token) {
          fetch(`${apiUrl}/api/recently-viewed/track`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ hotelId: data.id })
          }).catch(err => console.error('Failed to track view:', err));
        }
      } catch (err: any) {
        setError(err.message || 'Wystąpił błąd');
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [slug]);

  // SEO: Dynamic meta tags and structured data
  useSEO({
    title: hotel ? `${hotel.name} - ${hotel.city}, ${hotel.country}` : 'Szczegóły hotelu',
    description: hotel
      ? `${hotel.name} w ${hotel.city}, ${hotel.country}. Sprawdź dostępne oferty wakacyjne, ceny i terminy wyjazdów. All inclusive, last minute, wczasy z dzieckiem. Rezerwuj.ai - inteligentne wyszukiwanie z AI.`
      : 'Szczegóły hotelu i dostępne oferty wakacyjne',
    keywords: hotel
      ? `${hotel.name}, hotel ${hotel.city}, wakacje ${hotel.country}, ${hotel.city} all inclusive, hotel rodzinny ${hotel.city}, last minute ${hotel.country}, wczasy ${hotel.city}`
      : 'hotel, wakacje, oferty',
    url: hotel ? `https://rezerwuj.ai/hotels/${hotel.slug}` : undefined,
    canonical: hotel ? `https://rezerwuj.ai/hotels/${hotel.slug}` : undefined,
  });

  // Structured data for SEO
  useStructuredData(
    hotel
      ? {
          ...getHotelSchema(hotel),
          ...getBreadcrumbSchema([
            { name: 'Home', url: 'https://rezerwuj.ai' },
            { name: 'Hotele', url: 'https://rezerwuj.ai/hotels' },
            { name: hotel.name, url: `https://rezerwuj.ai/hotels/${hotel.slug}` },
          ]),
        }
      : {}
  );

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    setZoomLevel(1);
    document.body.style.overflow = 'hidden'; // Prevent body scroll
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setZoomLevel(1);
    document.body.style.overflow = 'unset';
  };

  const nextLightboxImage = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
    setZoomLevel(1);
  }, [images.length]);

  const prevLightboxImage = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoomLevel(1);
  }, [images.length]);

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 1));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextLightboxImage();
    }
    if (isRightSwipe) {
      prevLightboxImage();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        prevLightboxImage();
      } else if (e.key === 'ArrowRight') {
        nextLightboxImage();
      } else if (e.key === '+' || e.key === '=') {
        zoomIn();
      } else if (e.key === '-' || e.key === '_') {
        zoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, nextLightboxImage, prevLightboxImage]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-slate-950">
        <Navbar variant="dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-sm animate-pulse">Ładowanie...</div>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-slate-950">
        <Navbar variant="dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">😕 Nie znaleziono hotelu</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white px-6 py-3 rounded-lg font-bold transition"
            >
              Wróć do Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar variant="dashboard" />

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Wróć do ofert</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden">
              <div className="relative h-96 lg:h-[500px] group cursor-pointer" onClick={() => openLightbox(currentImage)}>
                <img
                  src={images[currentImage]}
                  alt={hotel.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />

                {/* Fullscreen indicator */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur p-3 rounded-full">
                    <Maximize2 className="w-6 h-6 text-slate-900 dark:text-white" />
                  </div>
                </div>

                {/* Image Navigation */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 backdrop-blur rounded-full flex items-center justify-center text-white transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 backdrop-blur rounded-full flex items-center justify-center text-white transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-white text-sm font-medium">
                  {currentImage + 1} / {images.length}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur transition ${
                      liked ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  </button>
                  <button className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-2 p-4 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImage(idx);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      openLightbox(idx);
                    }}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      currentImage === idx ? 'border-blue-500' : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${hotel.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Hotel Info */}
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 rounded-3xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{hotel.name}</h1>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{hotel.address}, {hotel.city}, {hotel.country}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-blue-500/20 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-blue-400 fill-current" />
                  <span className="text-blue-400 font-bold text-sm">4.8</span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">O hotelu</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  {hotel.name} to luksusowy hotel położony w sercu {hotel.city}, oferujący wyjątkowe doświadczenia
                  dla gości poszukujących niezapomnianych wakacji. Hotel wyróżnia się doskonałą lokalizacją,
                  nowoczesnymi udogodnieniami oraz profesjonalną obsługą.
                </p>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Udogodnienia</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-slate-700 dark:text-slate-700 dark:text-slate-300">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <amenity.icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-sm">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map with POI */}
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Lokalizacja i okolica</h3>

                {/* POI Legend */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-600 dark:text-slate-600 dark:text-slate-400">Hotel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                    <span className="text-slate-600 dark:text-slate-600 dark:text-slate-400">Plaża (~400m)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <span className="text-slate-600 dark:text-slate-600 dark:text-slate-400">Lotnisko (18km)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <span className="text-slate-600 dark:text-slate-600 dark:text-slate-400">Centrum (2km)</span>
                  </div>
                </div>
              </div>
              <div className="h-96">
                <MapContainer
                  center={[hotel.location.lat, hotel.location.lng]}
                  zoom={13}
                  className="h-full w-full"
                  zoomControl={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Hotel Marker */}
                  <Marker position={[hotel.location.lat, hotel.location.lng]}>
                    <Popup>
                      <div className="text-center">
                        <strong>{hotel.name}</strong>
                        <br />
                        <span className="text-xs text-gray-600">{hotel.address}</span>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Beach Marker (mock - 400m north) */}
                  <Marker position={[hotel.location.lat + 0.0036, hotel.location.lng + 0.002]}>
                    <Popup>
                      <div className="text-center">
                        <strong>🏖️ Plaża</strong>
                        <br />
                        <span className="text-xs text-gray-600">~400m (5 min pieszo)</span>
                      </div>
                    </Popup>
                  </Marker>

                  {/* City Center Marker (mock - 2km south) */}
                  <Marker position={[hotel.location.lat - 0.018, hotel.location.lng - 0.005]}>
                    <Popup>
                      <div className="text-center">
                        <strong>🏛️ Centrum miasta</strong>
                        <br />
                        <span className="text-xs text-gray-600">~2km (25 min pieszo)</span>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Airport Marker (mock - 18km west) */}
                  <Marker position={[hotel.location.lat - 0.05, hotel.location.lng - 0.15]}>
                    <Popup>
                      <div className="text-center">
                        <strong>✈️ Lotnisko</strong>
                        <br />
                        <span className="text-xs text-gray-600">~18km (20 min samochodem)</span>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-white/5 rounded-3xl p-6 sticky top-24">
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-black text-slate-900 dark:text-slate-900 dark:text-white">4,120</span>
                  <span className="text-slate-400 text-sm">zł / osoba</span>
                </div>
                <p className="text-xs text-slate-500">Cena za 7 dni, all inclusive</p>
              </div>

              {/* AI Recommendation */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  <span className="text-blue-400 font-bold text-sm">Rekomendacja AI</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Ten hotel idealnie pasuje do Twoich preferencji: ma aquapark dla dzieci i krótki transfer z lotniska.
                </p>
              </div>

              {/* Booking Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Data wyjazdu</label>
                  <input
                    type="date"
                    defaultValue="2026-07-15"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Długość pobytu</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                    <option>7 dni / 6 nocy</option>
                    <option>10 dni / 9 nocy</option>
                    <option>14 dni / 13 nocy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Pokój</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                    <option>Standard (2+2)</option>
                    <option>Family Room (2+3)</option>
                    <option>Suite (2+2)</option>
                  </select>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-white/5 pt-4 mb-6 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-600 dark:text-slate-400">
                  <span>2 dorośli × 7 dni</span>
                  <span>6,240 zł</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-600 dark:text-slate-400">
                  <span>2 dzieci × 7 dni</span>
                  <span>3,120 zł</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-600 dark:text-slate-400">
                  <span>Transfer</span>
                  <span>Wliczony</span>
                </div>
                <div className="flex justify-between text-slate-900 dark:text-white font-bold pt-2 border-t border-white/5">
                  <span>Suma</span>
                  <span>9,360 zł</span>
                </div>
              </div>

              {/* Book Button */}
              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-blue-600/20 mb-3">
                Zarezerwuj teraz
              </button>

              <button className="w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-medium transition border border-white/10">
                Dodaj do porównania
              </button>

              <p className="text-xs text-slate-500 text-center mt-4">
                Bezpłatna anulacja do 30 dni przed wyjazdem
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-slate-900 dark:text-white font-medium z-10">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                zoomOut();
              }}
              disabled={zoomLevel <= 1}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <div className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm font-medium">
              {Math.round(zoomLevel * 100)}%
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                zoomIn();
              }}
              disabled={zoomLevel >= 3}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevLightboxImage();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextLightboxImage();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Image */}
          <div
            className="relative max-w-7xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={images[lightboxIndex]}
              alt={`${hotel?.name} ${lightboxIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>

          {/* Keyboard Hints */}
          <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur px-3 py-2 rounded-lg text-white text-xs space-y-1 z-10">
            <div>← → - Nawigacja</div>
            <div>ESC - Zamknij</div>
            <div>+/- - Zoom</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetails;
