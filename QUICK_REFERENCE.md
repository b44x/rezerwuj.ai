# Quick Reference - Rezerwuj.ai

Szybki przewodnik po najczęstszych zadaniach i komendach.

---

## 🚀 Uruchomienie Projektu

```bash
# Start wszystkich serwisów
docker-compose up -d

# Sprawdzenie statusu
docker-compose ps

# Otwarcie aplikacji
open http://localhost:5173
```

---

## 🔑 Logowanie (Test Account)

**Email:** `test@example.com`
**Hasło:** `test123`

Lub zarejestruj nowe konto: http://localhost:5173/register

---

## 🐛 Debug & Troubleshooting

### Frontend nie działa
```bash
# Sprawdź logi
docker-compose logs -f client

# Restart
docker-compose restart client

# Rebuild (po zmianach w package.json)
docker-compose up --build -d client
```

### Backend errors
```bash
# Sprawdź logi PHP
docker-compose logs -f php

# Clear cache
docker exec rezerwuj_php php bin/console cache:clear

# Sprawdź routing
docker exec rezerwuj_php php bin/console debug:router
```

### Baza danych
```bash
# Sprawdź tabele
docker exec rezerwuj_db psql -U app_user -d app_db -c "\dt"

# Sprawdź użytkowników
docker exec rezerwuj_db psql -U app_user -d app_db -c "SELECT id, email, name FROM \"user\";"

# Sprawdź hotele
docker exec rezerwuj_db psql -U app_user -d app_db -c "SELECT id, name, city FROM hotel;"
```

---

## 📊 Migracje

```bash
# Wejdź do kontenera
docker exec -it rezerwuj_php bash

# Utwórz nową migrację
php bin/console make:migration

# Wykonaj migracje
php bin/console doctrine:migrations:migrate

# Status migracji
php bin/console doctrine:migrations:status
```

---

## 🔌 API Testing

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"new@example.com","password":"test123","name":"New User"}'
```

### Get Current User (requires token)
```bash
TOKEN="your-jwt-token-here"
curl http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Hotels API
```bash
# Lista hoteli
curl http://localhost:8080/api/hotels

# Pojedynczy hotel
curl http://localhost:8080/api/hotels/1

# Utworzenie hotelu (requires auth)
curl -X POST http://localhost:8080/api/hotels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"New Hotel","address":"...","city":"...","country":"...","location":{"lat":0,"lng":0}}'
```

---

## 📁 Gdzie co jest?

### Backend
```
api/
├── src/
│   ├── Controller/       # API endpoints
│   │   ├── AuthController.php
│   │   ├── HotelController.php
│   │   └── TravelProfileController.php
│   ├── Entity/          # Database models
│   │   ├── User.php
│   │   ├── Hotel.php
│   │   ├── TravelProfile.php
│   │   └── PasswordResetToken.php
│   └── Repository/      # Database queries
├── config/
│   ├── packages/
│   │   ├── security.yaml           # Auth config
│   │   └── nelmio_cors.yaml        # CORS
│   └── jwt/                        # JWT keys
└── migrations/                     # Database migrations
```

### Frontend
```
client/
└── src/
    ├── contexts/
    │   └── AuthContext.tsx         # Auth state
    ├── components/
    │   ├── ProtectedRoute.tsx      # Route protection
    │   ├── layout/
    │   │   ├── Navbar.tsx          # Navigation + user menu
    │   │   └── Sidebar.tsx
    │   ├── ui/                     # UI components
    │   ├── map/                    # Map components
    │   └── profile/                # Profile components
    └── pages/
        ├── Login.tsx               # Auth pages
        ├── Register.tsx
        ├── ForgotPassword.tsx
        ├── ResetPassword.tsx
        ├── Dashboard.tsx           # Main pages
        ├── HotelDetails.tsx        # Hotel details page
        ├── HotelMap.tsx
        └── UserProfile.tsx
```

---

## 🎨 Stylowanie

### Tailwind Classes
```tsx
// Dark background
bg-slate-950

// Glass morphism
bg-slate-900/60 backdrop-blur border border-white/5

// Primary button
bg-blue-600 hover:bg-blue-500

// Text colors
text-white text-slate-400 text-blue-400
```

### Dodawanie nowych styli
1. Edytuj `client/src/index.css`
2. Vite automatycznie przeładuje (HMR)
3. Nie potrzeba restartu kontenera

---

## 🔒 Security

### JWT Token
- **Algorytm:** RS256
- **Ważność:** 1 godzina
- **Storage:** localStorage (klucz: `token`)
- **Header:** `Authorization: Bearer <token>`

### Password Reset
1. POST `/api/auth/password/reset-request` z email
2. Backend zwraca token (w dev też w response)
3. Link: `http://localhost:5173/reset-password?token=...`
4. POST `/api/auth/password/reset` z token + new password

---

## 📝 Dokumentacja

- **IMPLEMENTATION_COMPLETE.md** - pełna dokumentacja projektu
- **AUTH_DOCUMENTATION.md** - dokumentacja autentykacji
- **CHANGELOG.md** - historia zmian
- **MEMORY.md** (w ~/.claude) - notatki AI o projekcie

---

## 🆘 Częste Problemy

### "CSS nie ładuje się"
```bash
# Restart client container
docker-compose restart client

# Hard refresh w przeglądarce
Ctrl+Shift+R (Windows) lub Cmd+Shift+R (Mac)

# Clear browser cache
DevTools → Application → Clear storage
```

### "401 Unauthorized"
```bash
# Token expired (1h) - zaloguj się ponownie
# Lub sprawdź czy token jest w localStorage
console.log(localStorage.getItem('token'))
```

### "CORS error"
```bash
# Sprawdź CORS config
cat api/config/packages/nelmio_cors.yaml

# Upewnij się że frontend działa na localhost:5173
```

### "Database connection failed"
```bash
# Sprawdź czy kontener działa
docker-compose ps

# Restart bazy
docker-compose restart db

# Sprawdź .env
cat api/.env | grep DATABASE_URL
```

---

## 🔗 Linki

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080
- **Swagger/API Docs:** (TODO - do dodania w przyszłości)
- **Projekt GitHub:** (TODO - jeśli będzie repozytorium)

---

**Ostatnia aktualizacja:** 2026-02-06
