# REZERWUJ.AI 🏖️

Inteligentny system rezerwacji wakacji z personalizacją AI.

[![Docker](https://img.shields.io/badge/Docker-ready-blue.svg)](https://www.docker.com/)
[![Symfony](https://img.shields.io/badge/Symfony-7.4-black.svg)](https://symfony.com/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

---

## 🚀 Quick Start

```bash
# Sklonuj repozytorium (jeśli jeszcze nie masz)
cd rezerwuj.ai

# Uruchom wszystkie serwisy
docker-compose up -d

# Otwórz aplikację
open http://localhost:5173
```

**Test account:**
- Email: `test@example.com`
- Hasło: `test123`

---

## 📖 Dokumentacja

| Dokument | Opis |
|----------|------|
| **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** | 📘 Szybki przewodnik - start tutaj! |
| **[IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md)** | 📚 Pełna dokumentacja projektu |
| **[AUTH_DOCUMENTATION.md](AUTH_DOCUMENTATION.md)** | 🔐 Dokumentacja autentykacji i API |
| **[CHANGELOG.md](CHANGELOG.md)** | 📝 Historia zmian |

---

## ✨ Funkcjonalności

### ✅ Zaimplementowane

- 🔐 **Autentykacja** - JWT, rejestracja, login, reset hasła
- 🏨 **Zarządzanie hotelami** - CRUD API dla hoteli
- 📋 **Strona szczegółów hotelu** - galeria zdjęć, mapa, udogodnienia, rezerwacja
- 👤 **Profile podróży** - personalizowane preferencje
- 🗺️ **Mapa interaktywna** - Leaflet z lokalizacjami hoteli
- 🎨 **Modern UI** - Dark mode, glass-morphism, Tailwind CSS
- 📱 **Responsive** - działa na desktop i mobile

### 🔜 Planowane (TODO)

- 🤖 **AI Agent** - analiza preferencji i rekomendacje
- 📧 **Email notifications** - powiadomienia o ofertach
- 💳 **Płatności** - integracja z Stripe/PayU
- 📊 **Dashboard admin** - zarządzanie hotelami i użytkownikami
- 🔍 **Advanced search** - filtry, sortowanie, wyszukiwanie
- ⭐ **Recenzje** - system ocen i komentarzy
- 📸 **Galerie zdjęć** - upload i galerie hoteli
- 🌍 **Multilanguage** - PL/EN/DE

---

## 🛠️ Tech Stack

### Backend
- **Symfony 7.4** - PHP framework
- **PostgreSQL 16** - relacyjna baza danych
- **Redis 7** - cache i sesje
- **JWT** - autentykacja
- **Doctrine ORM** - zarządzanie bazą danych
- **Nelmio CORS** - cross-origin requests

### Frontend
- **React 19** - UI library
- **TypeScript 5.9** - type safety
- **Vite 7** - build tool
- **Tailwind CSS 3** - utility-first CSS
- **React Router** - routing
- **React Leaflet** - mapy interaktywne
- **Lucide React** - ikony

### Infrastructure
- **Docker** - konteneryzacja
- **Nginx** - web server
- **Docker Compose** - orchestration

---

## 📦 Instalacja

### Wymagania
- Docker & Docker Compose
- Porty wolne: 5173 (frontend), 8080 (backend), 5432 (postgres), 6379 (redis)

### Krok po kroku

```bash
# 1. Sklonuj projekt
git clone <repo-url>
cd rezerwuj.ai

# 2. Uruchom kontenery
docker-compose up -d

# 3. Sprawdź status
docker-compose ps

# 4. Otwórz w przeglądarce
open http://localhost:5173
```

**Gotowe!** Aplikacja powinna działać.

---

## 🧪 Testowanie

### Backend API

```bash
# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Test hotels
curl http://localhost:8080/api/hotels
```

### Frontend

1. Otwórz http://localhost:5173
2. Kliknij "Zarejestruj się" lub zaloguj jako `test@example.com`
3. Przejdź do Dashboard - powinny być widoczne hotele

---

## 📂 Struktura Projektu

```
rezerwuj.ai/
├── api/                    # Backend Symfony
│   ├── config/            # Konfiguracja
│   ├── migrations/        # Migracje bazy
│   ├── src/
│   │   ├── Controller/    # API endpoints
│   │   ├── Entity/        # Modele bazy
│   │   └── Repository/    # Zapytania DB
│   └── docker/            # Dockerfile PHP
│
├── client/                # Frontend React
│   ├── public/           # Statyczne pliki
│   ├── src/
│   │   ├── components/   # Komponenty React
│   │   ├── contexts/     # Context providers
│   │   ├── pages/        # Strony aplikacji
│   │   └── index.css     # Główne style
│   └── Dockerfile.dev    # Dockerfile client
│
├── mockups/              # HTML mockups (design)
├── nginx/                # Nginx config
├── docker-compose.yml    # Orchestration
└── *.md                  # Dokumentacja
```

---

## 🔌 API Endpoints

### Publiczne (bez autentykacji)
- `POST /api/auth/register` - rejestracja
- `POST /api/auth/login` - logowanie
- `POST /api/auth/password/reset-request` - request resetu hasła
- `POST /api/auth/password/reset` - reset hasła
- `GET /api/hotels` - lista hoteli
- `GET /api/profiles` - lista profili

### Chronione (wymagają JWT token)
- `GET /api/auth/me` - current user
- `POST /api/hotels` - utworzenie hotelu
- `PUT /api/hotels/{id}` - edycja hotelu
- `DELETE /api/hotels/{id}` - usunięcie hotelu
- *(analogicznie dla profiles)*

**Szczegóły:** Zobacz [AUTH_DOCUMENTATION.md](AUTH_DOCUMENTATION.md)

---

## 🗄️ Baza Danych

### Tabele

- **user** - użytkownicy (email, password, name, roles)
- **hotel** - hotele (name, address, city, country, location JSON)
- **travel_profile** - profile podróży (name, description, preferences JSON)
- **password_reset_token** - tokeny resetu hasła

**Migracje:** `api/migrations/`

---

## 🐛 Troubleshooting

### CSS nie ładuje się
```bash
docker-compose restart client
# Ctrl+Shift+R w przeglądarce
```

### Backend nie odpowiada
```bash
docker-compose logs -f php
docker exec rezerwuj_php php bin/console cache:clear
```

### Baza danych - problem z połączeniem
```bash
docker-compose restart db
docker exec rezerwuj_db psql -U app_user -d app_db -c "\dt"
```

**Więcej:** Zobacz [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

---

## 🤝 Contributing

Projekt w fazie rozwoju. Guidelines wkrótce.

---

## 📄 Licencja

Proprietary - wszystkie prawa zastrzeżone.

---

## 📞 Kontakt

W razie pytań - sprawdź dokumentację lub otwórz issue.

---

**Status:** ✅ Active Development
**Wersja:** 1.1.0
**Ostatnia aktualizacja:** 2026-02-06

---

## 🎯 Roadmap

- [ ] AI Agent - rekomendacje hoteli na podstawie preferencji
- [ ] Email service - Symfony Mailer dla reset hasła
- [ ] Admin panel - zarządzanie hotelami i użytkownikami
- [ ] Płatności - Stripe/PayU integration
- [ ] Recenzje - system ocen i komentarzy
- [ ] Tests - PHPUnit + Vitest
- [ ] CI/CD - GitHub Actions
- [ ] Production deployment - Dockerfile production

---

Made with ❤️ using Symfony + React + AI
