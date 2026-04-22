# Golden View

**Golden View** è una piattaforma web per scoprire e condividere i migliori posti dove vedere il tramonto e l'alba. Gli utenti possono esplorare spot su mappa interattiva, filtrarli per posizione e visualizzare gli orari esatti di golden hour per ogni luogo.

---

## Features

- **Esplora spot** — Lista e mappa interattiva (Mapbox) con filtro per luogo
- **Spot vicini** — Geolocalizzazione browser + calcolo distanza (Haversine)
- **Golden hour** — Orari tramonto/alba calcolati in tempo reale per ogni spot (SunCalc)
- **Autenticazione** — Login con email/password o Google OAuth
- **Reset password** — Flow completo via email (Resend)
- **Admin panel** — Crea, modifica ed elimina spot con upload foto (Uploadthing)
- **Dark mode** — Supporto tema chiaro/scuro

---

## Tech Stack

| Area | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS 4, Radix UI |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js 4 (JWT, Google OAuth, Credentials) |
| Mappa | Mapbox GL JS |
| Upload | Uploadthing |
| Email | Resend |
| Data fetching | TanStack Query v5 + Axios |
| Validazione | Zod + React Hook Form |
| Animazioni | Motion (Framer Motion) |
| Notifiche | Sonner |

---

## Prerequisiti

- Node.js 18+
- PostgreSQL (locale o cloud — [Neon](https://neon.tech), [Supabase](https://supabase.com), ecc.)
- Account [Uploadthing](https://uploadthing.com) per l'upload immagini
- Account [Resend](https://resend.com) per le email
- Token [Mapbox](https://account.mapbox.com) per le mappe
- Credenziali [Google OAuth](https://console.cloud.google.com) (opzionale)

---

## Getting Started

### 1. Clona il repository

```bash
git clone <repo-url>
cd goldenview
```

### 2. Installa le dipendenze

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` è necessario perché `next-auth@4` non dichiara compatibilità ufficiale con Next.js 15 (funziona comunque correttamente).

### 3. Configura le variabili d'ambiente

```bash
cp .env.example .env.development
```

Compila `.env.development` con i tuoi valori (vedi sezione [Variabili d'ambiente](#variabili-dambiente)).

### 4. Crea il database

```bash
npm run db:push:dev
```

Oppure, se hai già le migration:

```bash
npm run db:migrate:dev
```

### 5. Avvia in sviluppo

```bash
npm run dev
```

L'app è disponibile su [http://localhost:3000](http://localhost:3000).

---

## Scripts

```bash
# Sviluppo
npm run dev               # Avvia Next.js in development (porta 3000)

# Produzione
npm run build             # Build ottimizzata
npm run start             # Avvia il server di produzione
npm run start:prod        # Build + Start in un solo comando

# Database — sviluppo
npm run db:push:dev       # Applica schema Prisma al DB di sviluppo (senza migration)
npm run db:migrate:dev    # Esegue le migration sul DB di sviluppo
npm run db:studio:dev     # Apre Prisma Studio sul DB di sviluppo

# Database — produzione
npm run db:push:prod      # Applica schema Prisma al DB di produzione
npm run db:migrate:prod   # Esegue le migration sul DB di produzione
npm run db:studio:prod    # Apre Prisma Studio sul DB di produzione
```

---

## Variabili d'ambiente

Copia `.env.example` in `.env.development` (sviluppo) o `.env.production` (produzione) e compila i valori.

```env
# Database (PostgreSQL)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=                    # openssl rand -base64 32

# Google OAuth — https://console.cloud.google.com
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Uploadthing — https://uploadthing.com
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=

# Resend (email) — https://resend.com
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=/api

# Mapbox — https://account.mapbox.com
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ...
```

> I file `.env.development` e `.env.production` sono gitignored. Solo `.env.example` è tracciato dal repository.

Next.js carica automaticamente l'env corretto in base all'ambiente:
- `npm run dev` → legge `.env.development`
- `npm run build` / `npm run start` → legge `.env.production`

---

## Struttura del progetto

```
goldenview/
├── app/
│   ├── (auth)/              # Pagine autenticazione (login, register, reset password)
│   ├── (site)/              # Pagine pubbliche (home, listing spot, dettaglio spot)
│   ├── admin/               # Area amministrativa (dashboard, gestione spot, crea spot)
│   └── api/                 # API routes
│       ├── auth/            # Autenticazione e password reset
│       ├── spot/            # CRUD spot + ricerca nearby
│       └── uploadthing/     # File upload handler
├── components/
│   ├── ui/                  # Componenti base (Button, Input, Card, ecc.)
│   ├── admin/               # Componenti area admin
│   ├── location/            # Context e UI per geolocalizzazione
│   ├── search-spot-map/     # Mappa interattiva con marker e popup
│   └── spot-card/           # Card spot con skeleton loader
├── hooks/                   # Custom React hooks (useSpots, useUserLocation)
├── lib/
│   ├── api/                 # Errors, middleware auth, validazioni Zod
│   ├── services/            # Service layer (spot, auth, resend, uploadthing)
│   ├── auth.ts              # Configurazione NextAuth
│   ├── env.ts               # Helper tipizzato per variabili d'ambiente
│   ├── sun-calc.ts          # Calcolo tramonto/alba (SunCalc)
│   └── utils.ts             # Utility (slug, Mapbox geocoding, cn)
├── prisma/
│   └── schema.prisma        # Schema database
├── providers.tsx            # Provider globali (Session, QueryClient, Location)
├── middleware.ts             # Protezione route con NextAuth
└── .env.example             # Template variabili d'ambiente
```

---

## Database

Il progetto usa **PostgreSQL** tramite **Prisma ORM**.

### Modelli principali

| Modello | Descrizione |
|---|---|
| `User` | Utente con ruolo (`USER` / `ADMIN`), supporto OAuth + Credentials |
| `Spot` | Luogo con coordinate, immagini, slug, visibilità pubblica/attiva |
| `Account` | Account OAuth collegati all'utente |
| `Session` | Sessioni NextAuth |
| `PasswordResetToken` | Token temporanei per reset password |

### Inizializzare il database

```bash
# Sviluppo — applica lo schema direttamente (consigliato in dev)
npm run db:push:dev

# Produzione — esegui le migration
npm run db:migrate:prod
```

---

## API Routes

| Metodo | Endpoint | Descrizione | Auth |
|---|---|---|---|
| `GET` | `/api/spot` | Lista spot con filtri e paginazione | — |
| `POST` | `/api/spot` | Crea nuovo spot | Admin |
| `DELETE` | `/api/spot?id=` | Elimina spot | Admin |
| `GET` | `/api/spot/[slug]` | Dettaglio singolo spot | — |
| `GET` | `/api/spot/nearby` | Spot vicini per lat/lng | — |
| `POST` | `/api/auth/register` | Registrazione utente | — |
| `POST` | `/api/auth/forgot-password` | Richiesta reset password | — |
| `POST` | `/api/auth/reset-password` | Reset password con token | — |
| `*` | `/api/auth/[...nextauth]` | Handler NextAuth | — |
| `POST` | `/api/uploadthing` | Upload file | Auth |
| `POST` | `/api/uploadthing/delete` | Elimina file | Admin |

---

## Deployment

### Vercel (consigliato)

1. Importa il repository su [Vercel](https://vercel.com)
2. Aggiungi le variabili d'ambiente del tuo `.env.production` nel pannello Vercel
3. Vercel esegue automaticamente `next build` ad ogni push

### Manuale

```bash
npm run db:migrate:prod   # Esegui le migration sul DB di produzione
npm run start:prod        # Build + avvia il server
```

---

## Licenza

Progetto privato — tutti i diritti riservati.
