# 🔐 System Autentykacji - Dokumentacja

## ✅ Zaimplementowane Funkcjonalności

### Backend (Symfony + JWT)
- ✅ **JWT Authentication** - bezstanowa autentykacja z tokenami
- ✅ **Rejestracja użytkowników** - z walidacją i hashowaniem haseł
- ✅ **Logowanie** - z weryfikacją credentials
- ✅ **Reset hasła** - system tokenów z wygasaniem (1 godzina)
- ✅ **Current user endpoint** - GET /api/auth/me
- ✅ **Security configuration** - zabezpieczenie API endpoints

### Frontend (React + TypeScript)
- ✅ **AuthContext** - centralne zarządzanie stanem autentykacji
- ✅ **ProtectedRoute** - zabezpieczenie tras przed nieautoryzowanym dostępem
- ✅ **Strony auth:**
  - Login - logowanie z walidacją
  - Register - rejestracja z potwierdzeniem hasła
  - ForgotPassword - request resetu hasła
  - ResetPassword - ustawienie nowego hasła z tokenem
- ✅ **Navbar z menu użytkownika** - dropdown z logout i profilem
- ✅ **Token storage** - localStorage z auto-refresh przy starcie

---

## 🚀 API Endpoints

### Publiczne (bez autentykacji)

#### POST `/api/auth/register`
Rejestracja nowego użytkownika.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Jan Kowalski"
}
```

**Response (201):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Jan Kowalski",
    "roles": ["ROLE_USER"]
  },
  "token": "eyJ0eXAiOiJKV1QiLCJh..."
}
```

---

#### POST `/api/auth/login`
Logowanie użytkownika.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Jan Kowalski",
    "roles": ["ROLE_USER"]
  },
  "token": "eyJ0eXAiOiJKV1QiLCJh..."
}
```

**Error (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

#### POST `/api/auth/password/reset-request`
Request resetu hasła (wysyła email z tokenem).

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "If the email exists, a reset link has been sent",
  "token": "abc123..." // TYLKO DLA DEV - usuń w produkcji!
}
```

**Uwaga:** Zawsze zwraca sukces, nawet jeśli email nie istnieje (zapobiega enumeracji).

---

#### POST `/api/auth/password/reset`
Resetowanie hasła z tokenem.

**Request:**
```json
{
  "token": "abc123...",
  "password": "newPassword123"
}
```

**Response (200):**
```json
{
  "message": "Password reset successfully"
}
```

**Error (400):**
```json
{
  "error": "Invalid or expired token"
}
```

---

### Chronione (wymagają JWT)

#### GET `/api/auth/me`
Pobierz dane zalogowanego użytkownika.

**Headers:**
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJh...
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Jan Kowalski",
    "roles": ["ROLE_USER"]
  }
}
```

**Error (401):**
```json
{
  "error": "Unauthorized"
}
```

---

## 📱 Frontend - Jak używać

### 1. Logowanie
```typescript
import { useAuth } from './contexts/AuthContext';

function LoginComponent() {
  const { login, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password123');
      // Użytkownik zalogowany, redirect do /dashboard
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };
}
```

### 2. Rejestracja
```typescript
const { register } = useAuth();

await register('user@example.com', 'password123', 'Jan Kowalski');
```

### 3. Logout
```typescript
const { logout } = useAuth();

logout(); // Czyści token i przekierowuje do /login
```

### 4. Sprawdzanie autentykacji
```typescript
const { isAuthenticated, user } = useAuth();

if (isAuthenticated) {
  console.log(`Zalogowany jako: ${user?.name}`);
}
```

### 5. Protected Routes
Automatycznie chronione w App.tsx:
```typescript
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

---

## 🗄️ Struktura Bazy Danych

### Tabela: `user`
| Kolumna    | Typ           | Opis                          |
|------------|---------------|-------------------------------|
| id         | int           | Primary key                   |
| email      | varchar(255)  | Email (unique)                |
| password   | varchar(255)  | Hashed password (bcrypt)      |
| name       | varchar(255)  | Imię i nazwisko               |
| roles      | json          | Role użytkownika (ROLE_USER)  |
| created_at | timestamp     | Data utworzenia               |
| updated_at | timestamp     | Data aktualizacji             |

### Tabela: `password_reset_token`
| Kolumna    | Typ           | Opis                          |
|------------|---------------|-------------------------------|
| id         | int           | Primary key                   |
| user_id    | int           | Foreign key → user            |
| token      | varchar(255)  | Reset token (unique)          |
| expires_at | timestamp     | Data wygaśnięcia (1h)         |
| used       | boolean       | Czy użyty                     |
| created_at | timestamp     | Data utworzenia               |

---

## 🔐 Security Configuration

### JWT Token
- **Algorytm:** RS256 (RSA)
- **Ważność:** 1 godzina (3600s)
- **Klucze:** `/api/config/jwt/` (private.pem, public.pem)
- **Header:** `Authorization: Bearer <token>`

### Password Hashing
- **Algorytm:** bcrypt (auto - Symfony)
- **Cost:** 13 (default dla bcrypt)

### CORS
- **Allowed Origins:** `http://localhost:5173`, `http://127.0.0.1:5173`
- **Allowed Methods:** GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers:** Content-Type, Authorization

### Access Control
```yaml
# Public endpoints
- /api/auth/login
- /api/auth/register
- /api/auth/password/*
- /api/test
- /api/hotels
- /api/profiles

# Protected endpoints (require ROLE_USER)
- /api/* (wszystko inne)
```

---

## 🧪 Testowanie

### Test rejestracji
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

### Test logowania
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Test /me endpoint
```bash
TOKEN="eyJ0eXAiOiJKV1QiLCJh..."

curl http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Test reset hasła
```bash
# 1. Request reset token
curl -X POST http://localhost:8080/api/auth/password/reset-request \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# 2. Reset password with token
curl -X POST http://localhost:8080/api/auth/password/reset \
  -H "Content-Type: application/json" \
  -d '{
    "token": "abc123...",
    "password": "newPassword123"
  }'
```

---

## 📂 Struktura Plików

### Backend
```
api/
├── config/
│   ├── packages/
│   │   ├── security.yaml          # Security config + JWT
│   │   └── lexik_jwt_authentication.yaml
│   └── jwt/
│       ├── private.pem             # JWT private key
│       └── public.pem              # JWT public key
├── src/
│   ├── Entity/
│   │   ├── User.php                # User entity + UserInterface
│   │   └── PasswordResetToken.php  # Reset token entity
│   ├── Repository/
│   │   ├── UserRepository.php
│   │   └── PasswordResetTokenRepository.php
│   └── Controller/
│       └── AuthController.php      # All auth endpoints
└── migrations/
    ├── Version20260206125554.php   # User roles
    └── Version20260206131548.php   # PasswordResetToken
```

### Frontend
```
client/
└── src/
    ├── contexts/
    │   └── AuthContext.tsx         # Auth state management
    ├── components/
    │   ├── ProtectedRoute.tsx      # Route protection
    │   └── layout/
    │       └── Navbar.tsx          # User menu + logout
    └── pages/
        ├── Login.tsx               # Login page
        ├── Register.tsx            # Registration page
        ├── ForgotPassword.tsx      # Password reset request
        └── ResetPassword.tsx       # Password reset form
```

---

## ⚠️ TODO dla Produkcji

### Backend
1. **Email service** - dodać Symfony Mailer do wysyłania emaili reset hasła
2. **Rate limiting** - dodać limity requestów dla auth endpoints
3. **Token blacklist** - invalidacja JWT przed wygaśnięciem (logout)
4. **HTTPS only** - wymagać HTTPS w produkcji
5. **Remove dev token** - usunąć zwracanie tokenu w `/password/reset-request`
6. **Refresh tokens** - dodać refresh token mechanism
7. **2FA** - opcjonalna dwuetapowa weryfikacja

### Frontend
1. **Interceptor** - axios/fetch interceptor dla automatycznego dodawania JWT
2. **Token refresh** - automatyczne odświeżanie tokenu przed wygaśnięciem
3. **Loading states** - lepsze loadery/skeletony
4. **Error boundaries** - obsługa błędów React
5. **Form validation** - Yup/Zod schema validation
6. **Remember me** - opcja "zapamiętaj mnie"

### Security
1. **CSRF protection** - dla non-API requests
2. **XSS protection** - sanityzacja inputów
3. **SQL injection** - Doctrine już chroni, ale weryfikować queries
4. **Brute force** - login attempt limiting
5. **Password strength** - wymagania minimum 8 znaków, cyfry, znaki specjalne

---

## 🎯 Użycie w Aplikacji

### Przykładowy Flow

1. **Użytkownik niezalogowany** → redirect do `/login`
2. **Kliknięcie "Zarejestruj się"** → `/register`
3. **Po rejestracji** → auto-login + redirect do `/dashboard`
4. **Kliknięcie avatara** → dropdown menu
5. **Kliknięcie "Wyloguj się"** → logout + redirect do `/login`

### Persistence
- Token JWT zapisywany w `localStorage`
- Auto-login przy refresh strony jeśli token ważny
- Logout czyści localStorage

---

## 📞 API Errors

| Status | Error                  | Znaczenie                          |
|--------|------------------------|------------------------------------|
| 400    | Missing required fields| Brak wymaganych pól w request     |
| 401    | Invalid credentials    | Błędny email lub hasło            |
| 401    | Unauthorized           | Brak lub nieprawidłowy JWT token  |
| 409    | User already exists    | Email już zarejestrowany          |

---

**Status:** ✅ Fully Implemented
**Data:** 2026-02-06
**Wersja:** 1.0

System autentykacji jest w pełni funkcjonalny i gotowy do użycia! 🎉
