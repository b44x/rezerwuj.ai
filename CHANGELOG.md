# Changelog

Wszystkie znaczące zmiany w projekcie Rezerwuj.ai są dokumentowane w tym pliku.

Format oparty na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.2.0] - 2026-02-06

### Added
- 🏨 **Strona szczegółów hotelu** (`/hotels/:id`)
  - Galeria zdjęć z nawigacją (carousel)
  - Szczegółowe informacje o hotelu
  - Lista udogodnień (WiFi, basen, restauracja, etc.)
  - Interaktywna mapa z lokalizacją (React Leaflet)
  - Booking card z formularzem rezerwacji
  - Kalkulacja ceny (breakdown)
  - Przyciski: Like, Share, Rezerwuj, Porównaj
  - Rekomendacja AI
  - Responsywny layout (2 kolumny na desktop)
- Link z OfferCard do strony szczegółów hotelu
- Przycisk "Wróć do ofert" (back navigation)

### Changed
- OfferCard: dodane `id` prop i Link do `/hotels/:id`
- Dashboard: offers zawierają teraz `id` hotelu
- App.tsx: dodany routing dla `/hotels/:id`
- OfferCard: hover effect z border-blue-500

---

## [1.1.0] - 2026-02-06

### Added
- 🔐 **System Autentykacji** - pełny JWT authentication
  - Backend: 5 endpoints auth (register, login, me, password reset)
  - Frontend: 4 strony auth (Login, Register, ForgotPassword, ResetPassword)
  - AuthContext z zarządzaniem stanem
  - ProtectedRoute dla zabezpieczenia tras
  - Token storage w localStorage z auto-refresh
  - User menu w Navbar z logout
- PasswordResetToken entity dla resetu haseł
- User entity rozszerzone o `roles` (JSON field)
- Security configuration z JWT firewall
- Migracje: Version20260206125554 (roles), Version20260206131548 (password_reset_token)
- Dokumentacja: AUTH_DOCUMENTATION.md

### Changed
- Tailwind CSS downgrade z 4.x → 3.x (fix CSS loading issues)
- PostCSS config updated dla Tailwind 3.x
- User entity implements UserInterface + PasswordAuthenticatedUserInterface
- Navbar: dodane user menu, initials, logout button
- App.tsx: dodane routing dla stron auth + AuthProvider wrapper

### Fixed
- 🐛 CSS nie ładował się (Tailwind 4.x issue)
  - Usunięto `tailwind:watch` i `predev` scripts z package.json
  - Usunięto `<link rel="stylesheet" href="/tailwind.css" />` z index.html
  - Dodano `import './index.css'` w main.tsx
  - Downgrade do Tailwind 3.x
- Dockerfile.dev: uproszczono CMD do `["npm", "run", "dev", "--", "--host"]`

### Security
- Password hashing via bcrypt (Symfony PasswordHasher)
- JWT tokens z RS256 encryption (1h expiration)
- CORS configured dla localhost:5173
- Access control: public auth routes, protected API routes

---

## [1.0.0] - 2026-02-06

### Added
- 🐳 **Docker environment** - 5 services (nginx, php, postgres, redis, client)
- 🗄️ **Database setup** - PostgreSQL 16 z migracjami
- 📊 **Entities**: Hotel, TravelProfile, User
- 🔌 **API Endpoints**:
  - CRUD dla Hotels: GET/POST/PUT/DELETE /api/hotels
  - CRUD dla Profiles: GET/POST/PUT/DELETE /api/profiles
  - Test endpoint: GET /api/test
- ⚛️ **React 19 Frontend**:
  - Dashboard (z integracją API)
  - HotelMap (Leaflet maps)
  - UserProfile
  - Komponenty UI: GlassCard, OfferCard, FilterChip, etc.
- 🎨 **Styling**: Tailwind CSS, Plus Jakarta Sans font, dark mode
- 🧭 **React Router** - routing między stronami
- 🌐 **CORS configuration** - komunikacja frontend-backend
- 📝 **Dane testowe**: 3 hotele, 2 profile podróży

### Technical
- Symfony 7.4 backend
- React 19 + TypeScript + Vite 7
- Tailwind CSS 4.x (later downgraded to 3.x)
- PostgreSQL 16 + Redis 7
- Doctrine ORM z migracjami
- API Response format z paginacją (data + meta)

### Documentation
- IMPLEMENTATION_COMPLETE.md - pełna dokumentacja projektu
- MEMORY.md - kluczowe informacje dla AI
- README struktura projektu

---

## Format

### Types of changes
- `Added` - nowe funkcjonalności
- `Changed` - zmiany w istniejącej funkcjonalności
- `Deprecated` - funkcjonalności do usunięcia w przyszłości
- `Removed` - usunięte funkcjonalności
- `Fixed` - poprawki bugów
- `Security` - zmiany związane z bezpieczeństwem
