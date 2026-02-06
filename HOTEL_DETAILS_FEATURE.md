# 🏨 Strona Szczegółów Hotelu

## Opis

Pełny widok szczegółów hotelu z galerią zdjęć, mapą, udogodnieniami i formularzem rezerwacji.

**Route:** `/hotels/:slug` (SEO-friendly URLs, np. `/hotels/aquatic-blue-resort-hersonissos`)

---

## ✨ Funkcjonalności

### 1. Galeria Zdjęć (Image Carousel)
- ✅ Nawigacja strzałkami (← →)
- ✅ Miniaturki (thumbnail gallery) na dole
- ✅ Licznik zdjęć (np. "2 / 4")
- ✅ Przełączanie między zdjęciami
- ✅ Aktywne zdjęcie podświetlone na niebiesko

### 2. Action Buttons
- ✅ **Like** (❤️) - dodawanie do ulubionych (toggle)
- ✅ **Share** (🔗) - udostępnianie hotelu
- Oba przyciski w prawym górnym rogu galerii

### 3. Informacje o Hotelu
- ✅ Nazwa hotelu (duży nagłówek)
- ✅ Adres z ikoną lokalizacji (📍)
- ✅ Ocena (★ 4.8) w badge
- ✅ Opis hotelu (placeholder text)

### 4. Udogodnienia (Amenities)
Gridowa lista z ikonami:
- ✅ Darmowe WiFi
- ✅ Basen
- ✅ Restauracja
- ✅ Klimatyzacja
- ✅ Parking
- ✅ Siłownia

### 5. Mapa Lokalizacji
- ✅ React Leaflet z OpenStreetMap
- ✅ Marker na lokalizacji hotelu
- ✅ Popup z nazwą hotelu
- ✅ Zoom: 14 (poziom dzielnicy)
- ✅ Wysokość: 320px

### 6. Booking Card (Sticky Right Column)
Formularz rezerwacji z:
- ✅ **Cena główna** - duża (np. 4,120 zł / osoba)
- ✅ **AI Rekomendacja** - niebieska karta z wyjaśnieniem
- ✅ **Data wyjazdu** - input type="date"
- ✅ **Długość pobytu** - select (7/10/14 dni)
- ✅ **Typ pokoju** - select (Standard/Family/Suite)
- ✅ **Price Breakdown** - szczegółowe rozliczenie:
  - 2 dorośli × 7 dni = 6,240 zł
  - 2 dzieci × 7 dni = 3,120 zł
  - Transfer = Wliczony
  - **Suma: 9,360 zł**
- ✅ **Przyciski**:
  - "Zarezerwuj teraz" (niebieski, główny)
  - "Dodaj do porównania" (szary, secondary)
- ✅ **Info** - "Bezpłatna anulacja do 30 dni przed wyjazdem"

### 7. Navigation
- ✅ **Back button** - "← Wróć do ofert" (top left)
- ✅ Navbar z user menu

---

## 🎨 Design

### Layout
```
┌─────────────────────────────────────────────┐
│ Navbar                                      │
├─────────────────────────────────────────────┤
│ ← Wróć do ofert                             │
│                                             │
│ ┌───────────────────┐  ┌──────────────┐   │
│ │                   │  │              │   │
│ │   Image Gallery   │  │   Booking    │   │
│ │   (left col)      │  │   Card       │   │
│ │                   │  │   (sticky)   │   │
│ │   Hotel Info      │  │              │   │
│ │                   │  └──────────────┘   │
│ │   Amenities       │                     │
│ │                   │                     │
│ │   Map             │                     │
│ └───────────────────┘                     │
└─────────────────────────────────────────────┘
```

### Kolory (Dark Mode)
- **Background**: slate-950
- **Cards**: slate-900/60 z backdrop-blur
- **Borders**: white/5
- **Text**: white (main), slate-400 (secondary)
- **Primary**: blue-600
- **Accent**: teal-400

### Responsive
- **Desktop (lg+)**: 2 kolumny (2:1 grid)
- **Mobile**: 1 kolumna, booking card na dole

---

## 🔌 API Integration

### Endpoint: `GET /api/hotels/:slug`

**Response:**
```json
{
  "id": 1,
  "slug": "aquatic-blue-resort-hersonissos",
  "name": "Aquatic Blue Resort",
  "address": "Beach Road 123",
  "city": "Hersonissos",
  "country": "Greece",
  "location": {
    "lat": 35.3326,
    "lng": 25.3919
  },
  "createdAt": "2026-02-06T12:57:03+00:00",
  "updatedAt": "2026-02-06T12:57:03+00:00"
}
```

### Mock Data (currently)
- **Images**: Unsplash placeholders (4 zdjęcia)
- **Amenities**: Hardcoded lista 6 udogodnień
- **Price**: Losowa cena 3500-4500 zł
- **Description**: Placeholder text

### TODO dla pełnej integracji
- [ ] Backend: dodać pole `images` (JSON) do Hotel entity
- [ ] Backend: dodać pole `amenities` (JSON) do Hotel entity
- [ ] Backend: dodać pole `description` (TEXT) do Hotel entity
- [ ] Backend: dodać pole `rating` (DECIMAL) do Hotel entity
- [ ] Backend: dodać pole `price_per_person` (DECIMAL) do Hotel entity
- [ ] Frontend: używać prawdziwych danych z API zamiast mock

---

## 📂 Pliki

### Nowe
- `/client/src/pages/HotelDetails.tsx` - główna strona szczegółów

### Zmodyfikowane
- `/client/src/App.tsx` - dodany routing `/hotels/:id`
- `/client/src/components/OfferCard.tsx` - dodany `id` prop i Link
- `/client/src/pages/Dashboard.tsx` - przekazywanie `id` do OfferCard

---

## 🧪 Testowanie

### Manual Test
1. Otwórz http://localhost:5173
2. Zaloguj się
3. Kliknij na kartę hotelu w Dashboard
4. Zostaniesz przekierowany do `/hotels/aquatic-blue-resort-hersonissos` (SEO-friendly URL)
5. Sprawdź:
   - ✅ Galeria działa (strzałki, miniaturki)
   - ✅ Like button toggle
   - ✅ Mapa się renderuje z markerem
   - ✅ Booking card jest sticky przy scrollu
   - ✅ "Wróć do ofert" przekierowuje do /dashboard
   - ✅ URL jest SEO-friendly (zawiera nazwę hotelu i miasto)

### API Test
```bash
# Test endpoint szczegółów hotelu (z slug)
curl http://localhost:8080/api/hotels/aquatic-blue-resort-hersonissos | python3 -m json.tool

# Test listy hoteli (zawiera slugi)
curl http://localhost:8080/api/hotels | python3 -m json.tool
```

---

## 🚀 Przyszłe Ulepszenia

### Phase 2
- [ ] Galeria full-screen (lightbox)
- [ ] Zoom zdjęć
- [ ] Video tour hotelu
- [ ] 360° panoramy

### Phase 3
- [ ] Recenzje i opinie gości (ratings)
- [ ] System rezerwacji (real booking)
- [ ] Sprawdzanie dostępności dat
- [ ] Integracja z płatnościami

### Phase 4
- [ ] Porównywanie hoteli (compare feature)
- [ ] Historia przeglądanych hoteli
- [ ] Podobne hotele (recommendations)
- [ ] Social sharing (Facebook, Twitter)

---

**Status:** ✅ Implemented
**Wersja:** 1.0
**Data:** 2026-02-06
