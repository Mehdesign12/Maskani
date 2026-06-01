# 🏠 Maskani — Architecture & Vision Technique

> **Document vivant.** Toute décision d'architecture majeure doit être consignée ici.
> Stack : `Next.js 14` · `Supabase` · `Vercel` · `Mapbox` · `Stripe` · `OpenAI`
> Équipe : Solo dev · Approche : MVP → itérations rapides

---

## Table des matières

1. [Vision & Philosophie Produit](#1-vision--philosophie-produit)
2. [Stack Technique](#2-stack-technique)
3. [Architecture Globale](#3-architecture-globale)
4. [Structure du Projet](#4-structure-du-projet)
5. [Schéma de Base de Données](#5-schéma-de-base-de-données)
6. [Rôles & Permissions (RBAC)](#6-rôles--permissions-rbac)
7. [Modules Fonctionnels](#7-modules-fonctionnels)
8. [Architecture Frontend](#8-architecture-frontend)
9. [Architecture Backend & API](#9-architecture-backend--api)
10. [Moteur de Recherche & Géospatial](#10-moteur-de-recherche--géospatial)
11. [Messagerie Temps Réel](#11-messagerie-temps-réel)
12. [Module IA & Estimation](#12-module-ia--estimation)
13. [Internationalisation FR + AR (RTL)](#13-internationalisation-fr--ar-rtl)
14. [Monétisation](#14-monétisation)
15. [Infrastructure & DevOps](#15-infrastructure--devops)
16. [Sécurité](#16-sécurité)
17. [Roadmap de Développement](#17-roadmap-de-développement)
18. [Règles & Conventions](#18-règles--conventions)
19. [Décisions d'Architecture (ADR)](#19-décisions-darchitecture-adr)

---

## 1. Vision & Philosophie Produit

### Qu'est-ce que Maskani ?

**Maskani** (مسكاني — *ma maison* en darija) est la plateforme immobilière de référence au Maroc,
conçue pour surpasser Mubawab et Avito sur **chaque axe** simultanément.

| Axe | Mubawab / Avito | **Maskani** |
|-----|:---------------:|:-----------:|
| Design & UX | Daté, surchargé | Premium Airbnb-level, mobile-first |
| Confiance | Annonces non vérifiées | Badges vérification, scoring qualité |
| Intelligence IA | Aucune | Estimation prix, search sémantique, auto-description |
| Données marché | Absentes | Prix/m² live par quartier, tendances, historique |
| Langues | FR ou AR séparés | FR + AR RTL natif, switch instantané |
| Expérience agences | Basique | Dashboard complet, leads qualifiés, analytics |

### Les 5 Principes Directeurs

1. **Trust First** — Chaque annonce doit inspirer confiance. Vérification systématique,
   photos authentifiées, badge agence certifiée, score de qualité annonce.
2. **Data is a Product** — Les données de marché ne sont pas un bonus.
   Elles sont un module à part entière et une source de revenus B2B.
3. **AI-Augmented, not AI-replaced** — L'IA assiste l'utilisateur (estimation,
   description, recherche). Elle ne décide pas à sa place.
4. **Itérer, pas perfectionner** — MVP lean en production rapidement.
   Feedback réel > spécification parfaite. Ship, measure, improve.
5. **Solo-Scalable** — L'architecture est maintenable seul aujourd'hui,
   extensible à une équipe de 5+ sans refonte majeure demain.

---

## 2. Stack Technique

> **⚠️ Note importante** : PlanetScale (MySQL) est **écarté** au profit de Supabase.
> MySQL ne supporte pas PostGIS, indispensable pour la recherche géospatiale.
> Supabase (PostgreSQL + PostGIS) couvre Auth, Realtime, Storage et DB en un seul service.

### Frontend

| Outil | Version | Rôle |
|-------|---------|------|
| **Next.js** | 14 (App Router) | Framework principal — SSR/ISR critique pour le SEO immobilier |
| **TypeScript** | 5.x | Type safety, DX, refacto sûr |
| **Tailwind CSS** | 3.x | Styling utility-first, classes `rtl:` pour l'arabe |
| **shadcn/ui** | latest | Composants accessibles et personnalisables |
| **next-intl** | 3.x | i18n avec routing et support RTL natif |
| **Zustand** | 4.x | State management léger (search state, map viewport) |
| **TanStack Query** | 5.x | Data fetching, cache, infinite scroll, revalidation |
| **React Hook Form + Zod** | latest | Formulaires multi-étapes + validation typée |
| **Mapbox GL JS** | 3.x | Carte interactive (meilleur pricing que Google Maps, tiles offline possibles) |
| **Framer Motion** | 11.x | Animations et micro-interactions |
| **next/image** | inclus | Optimisation images (WebP, lazy, responsive) |

### Backend & Services

| Outil | Rôle |
|-------|------|
| **Supabase** | PostgreSQL + PostGIS + Auth + Realtime + Storage + Edge Functions |
| **Next.js API Routes** | Business logic custom, orchestration, validation |
| **Resend + React Email** | Emails transactionnels (alertes, confirmations, notifications) |
| **Stripe** | Paiements : boost listings, abonnements agences, leads |
| **OpenAI API** | Estimation IA, enrichissement descriptions, search sémantique |
| **Vercel** | Déploiement, Edge Network, Cron Jobs |
| **PostHog** | Analytics produit (self-hostable pour économiser) |
| **Sentry** | Monitoring erreurs front et back |
| **Upstash Redis** | Rate limiting API, cache sessions |
| **GitHub Actions** | CI/CD (lint, typecheck, tests, preview deploy) |

---

## 3. Architecture Globale

```
┌─────────────────────────────────────────────────────────────────────┐
│                            CLIENTS                                   │
│                  Browser (Next.js — SSR + CSR)                      │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ HTTPS / WSS
┌───────────────────────────────▼─────────────────────────────────────┐
│                         VERCEL EDGE                                   │
│                                                                       │
│  middleware.ts ──→ Auth check + i18n locale routing                  │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐     │
│  │  Next.js App (App Router)                                   │     │
│  │  ├── /fr/...         Server Components  (SSR + ISR + SSG)  │     │
│  │  ├── /ar/...         (RTL, same pages, different dir)       │     │
│  │  ├── /api/...        Route Handlers  (business logic)       │     │
│  │  └── /api/cron/...   Cron Jobs  (alertes, stats, expiry)   │     │
│  └─────────────────────────────────────────────────────────────┘     │
└──────────────┬────────────────────────────────┬─────────────────────┘
               │                                │
┌──────────────▼──────────┐     ┌───────────────▼──────────────────┐
│      SUPABASE           │     │       SERVICES EXTERNES           │
│                         │     │                                    │
│  PostgreSQL + PostGIS   │     │  Mapbox     — Cartes & géocodage  │
│  ├── RLS policies       │     │  Stripe     — Paiements           │
│  ├── Functions SQL      │     │  OpenAI     — IA estimation       │
│  ├── Migrations         │     │  Resend     — Emails              │
│                         │     │  PostHog    — Analytics           │
│  Auth (JWT)             │     │  Sentry     — Monitoring          │
│  ├── Email + password   │     │  Upstash    — Rate limiting       │
│  └── Google OAuth       │     └────────────────────────────────────┘
│                         │
│  Realtime (WebSocket)   │
│  └── Messages live      │
│                         │
│  Storage (S3-compatible)│
│  └── Photos annonces    │
└─────────────────────────┘
```

### Flux de données par type de requête

```
[Page publique]     → SSR/ISR Next.js → Supabase DB (server-side)
[Mutation auth]     → API Route → Zod validation → Supabase DB
[Recherche]         → API Route → buildQuery() → Supabase + PostGIS
[Messagerie]        → Supabase Realtime client direct (WebSocket)
[Upload photo]      → API Route → Supabase Storage → CDN Vercel
[Estimation IA]     → API Route → market stats DB → OpenAI API
[Paiement]          → API Route → Stripe Checkout → Webhook → DB update
[Alerte email]      → Cron Vercel → Supabase query → Resend
```

---

## 4. Structure du Projet

```
maskani/
│
├── app/                                    # Next.js 14 App Router
│   │
│   ├── [locale]/                           # Routing i18n : /fr/... et /ar/...
│   │   ├── layout.tsx                      # Root layout (dir RTL, fonts, theme)
│   │   ├── page.tsx                        # Homepage (SSG + ISR 1h)
│   │   │
│   │   ├── (public)/                       # Pages sans authentification
│   │   │   ├── annonces/
│   │   │   │   ├── page.tsx                # Search + carte + filtres (SSR)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx            # Détail annonce (ISR 5min)
│   │   │   ├── projets-neufs/
│   │   │   │   ├── page.tsx                # Liste projets (ISR 1h)
│   │   │   │   └── [slug]/page.tsx         # Détail projet (ISR 30min)
│   │   │   ├── agences/
│   │   │   │   ├── page.tsx                # Annuaire agences (ISR 1h)
│   │   │   │   └── [slug]/page.tsx         # Profil agence (ISR 30min)
│   │   │   ├── estimation/
│   │   │   │   └── page.tsx                # Outil estimation (CSR)
│   │   │   └── marche/
│   │   │       ├── page.tsx                # Dashboard marché global (ISR 24h)
│   │   │       └── [city]/page.tsx         # Stats par ville (ISR 24h)
│   │   │
│   │   ├── (auth)/                         # Flux d'authentification
│   │   │   ├── connexion/page.tsx
│   │   │   ├── inscription/page.tsx
│   │   │   ├── onboarding/page.tsx         # Choix du rôle post-signup
│   │   │   └── callback/page.tsx           # Redirect OAuth Google
│   │   │
│   │   └── (dashboard)/                    # Espace privé (auth required)
│   │       ├── layout.tsx                  # Layout dashboard (sidebar, nav)
│   │       ├── compte/page.tsx             # Mon profil
│   │       ├── annonces/
│   │       │   ├── page.tsx                # Mes annonces + statuts
│   │       │   ├── nouvelle/page.tsx       # Créer une annonce (multi-step)
│   │       │   └── [id]/
│   │       │       ├── modifier/page.tsx
│   │       │       └── statistiques/page.tsx
│   │       ├── messages/
│   │       │   └── [[...conversationId]]/page.tsx  # Messagerie (CSR Realtime)
│   │       ├── favoris/page.tsx
│   │       ├── alertes/page.tsx            # Saved searches + fréquence
│   │       └── agence/                     # Agency dashboard (role: agency)
│   │           ├── page.tsx                # Vue d'ensemble + métriques
│   │           ├── annonces/page.tsx       # Toutes les annonces de l'agence
│   │           ├── equipe/page.tsx         # Gestion agents
│   │           ├── leads/page.tsx          # Contacts reçus
│   │           ├── abonnement/page.tsx     # Plan + facturation Stripe
│   │           └── statistiques/page.tsx
│   │
│   ├── (admin)/                            # Back-office (role: admin only)
│   │   ├── layout.tsx
│   │   ├── page.tsx                        # Dashboard admin
│   │   ├── moderation/
│   │   │   ├── annonces/page.tsx           # File de modération
│   │   │   └── signalements/page.tsx
│   │   ├── utilisateurs/page.tsx
│   │   ├── agences/page.tsx
│   │   └── statistiques/page.tsx
│   │
│   └── api/                                # Route Handlers (API)
│       ├── listings/
│       │   ├── route.ts                    # GET (search), POST (créer)
│       │   └── [id]/
│       │       ├── route.ts                # GET, PUT, DELETE
│       │       ├── contact/route.ts        # Initier conversation
│       │       └── boost/route.ts          # Booster l'annonce (Stripe)
│       ├── upload/
│       │   └── route.ts                    # Upload images → Supabase Storage
│       ├── estimation/
│       │   └── route.ts                    # Estimation prix IA
│       ├── alerts/
│       │   └── route.ts                    # CRUD alertes
│       ├── market/
│       │   └── [city]/route.ts             # Stats marché par ville
│       ├── stripe/
│       │   ├── checkout/route.ts           # Créer session Stripe
│       │   └── webhook/route.ts            # Événements Stripe (signature validée)
│       └── cron/
│           ├── send-alerts/route.ts        # Envoyer alertes email quotidiennes
│           ├── expire-listings/route.ts    # Archiver annonces expirées
│           └── refresh-stats/route.ts      # Recalculer stats marché
│
├── components/
│   ├── ui/                                 # shadcn/ui (auto-généré)
│   ├── listing/
│   │   ├── ListingCard.tsx                 # Carte annonce (grille)
│   │   ├── ListingCardHorizontal.tsx       # Vue liste
│   │   ├── ListingGrid.tsx
│   │   ├── ListingDetail.tsx               # Page détail complète
│   │   ├── ListingForm/                    # Formulaire multi-step création
│   │   │   ├── Step1Type.tsx
│   │   │   ├── Step2Details.tsx
│   │   │   ├── Step3Location.tsx
│   │   │   ├── Step4Photos.tsx
│   │   │   └── Step5Preview.tsx
│   │   ├── ListingGallery.tsx              # Galerie photos lightbox
│   │   └── ListingStatusBadge.tsx
│   ├── search/
│   │   ├── SearchBar.tsx                   # Barre hero (achat/location)
│   │   ├── SearchFilters.tsx               # Panneau filtres avancés
│   │   ├── SearchResults.tsx
│   │   └── SearchSuggestions.tsx           # Autocomplete villes
│   ├── map/
│   │   ├── MapView.tsx                     # Container Mapbox GL
│   │   ├── MapMarker.tsx                   # Marker prix custom
│   │   ├── MapCluster.tsx                  # Clustering supercluster
│   │   └── SplitView.tsx                   # Vue liste + carte côte à côte
│   ├── messaging/
│   │   ├── ConversationList.tsx
│   │   ├── MessageThread.tsx               # Chat realtime
│   │   └── MessageInput.tsx
│   ├── agency/
│   │   ├── AgencyCard.tsx
│   │   ├── AgencyHeader.tsx
│   │   └── AgencyStats.tsx
│   ├── estimation/
│   │   ├── EstimationForm.tsx
│   │   └── EstimationResult.tsx
│   ├── market/
│   │   ├── PriceChart.tsx                  # Évolution prix (Recharts)
│   │   └── HeatMap.tsx                     # Carte thermique prix
│   └── shared/
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       ├── PriceDisplay.tsx                # Format MAD selon locale
│       ├── VerificationBadge.tsx
│       ├── QualityScore.tsx                # Score qualité annonce
│       └── RTLWrapper.tsx                  # Bascule dir selon locale
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                       # Browser client (cookies)
│   │   ├── server.ts                       # Server client (server components)
│   │   └── admin.ts                        # Admin client (service_role — server only)
│   ├── ai/
│   │   ├── estimation.ts                   # Logique estimation prix
│   │   └── description.ts                  # Enrichissement descriptions
│   ├── search/
│   │   └── buildQuery.ts                   # Query builder Supabase
│   ├── stripe/
│   │   ├── client.ts
│   │   └── plans.ts                        # Plans agences + prix
│   ├── email/
│   │   ├── client.ts                       # Resend client
│   │   └── templates/
│   │       ├── AlertEmail.tsx
│   │       ├── WelcomeEmail.tsx
│   │       └── ContactEmail.tsx
│   ├── mapbox/
│   │   └── geocode.ts                      # Geocoding adresses
│   └── validations/
│       ├── listing.ts                      # Zod schemas annonces
│       ├── user.ts                         # Zod schemas user
│       └── search.ts                       # Zod schemas recherche
│
├── i18n/
│   ├── routing.ts                          # next-intl routing config
│   ├── request.ts                          # Résolution locale par requête
│   └── messages/
│       ├── fr.json                         # Traductions françaises
│       └── ar.json                         # Traductions arabes (RTL)
│
├── types/
│   ├── database.ts                         # Types auto-générés (supabase gen types)
│   ├── listing.ts
│   ├── user.ts
│   └── search.ts
│
├── hooks/
│   ├── useListings.ts
│   ├── useMessages.ts
│   ├── useSearch.ts
│   ├── useGeolocation.ts
│   └── useMapbox.ts
│
├── store/
│   ├── searchStore.ts                      # Zustand : filtres + état recherche
│   └── mapStore.ts                         # Zustand : viewport carte
│
├── supabase/
│   ├── config.toml
│   └── migrations/
│       ├── 00_schema.sql                   # Tables, index, PostGIS
│       ├── 01_rls_policies.sql             # Row Level Security
│       ├── 02_functions.sql                # Fonctions SQL custom
│       ├── 03_triggers.sql                 # Triggers (updated_at, stats)
│       └── 04_seed.sql                     # Données de dev
│
├── middleware.ts                           # Auth check + routing i18n
├── next.config.ts                          # Config Next.js (headers CSP, images)
├── tailwind.config.ts
└── package.json
```

---

## 5. Schéma de Base de Données

```sql
-- ══════════════════════════════════════════════════════
-- EXTENSIONS
-- ══════════════════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;   -- Recherche textuelle approximative
CREATE EXTENSION IF NOT EXISTS unaccent;  -- Recherche sans accents

-- ══════════════════════════════════════════════════════
-- PROFILS UTILISATEURS
-- Étend auth.users (Supabase Auth) — ne jamais modifier auth.users
-- ══════════════════════════════════════════════════════
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT,
  avatar_url      TEXT,
  phone           TEXT,
  role            TEXT NOT NULL DEFAULT 'user'
                  CHECK (role IN ('user','agency','promoter','admin','superadmin')),
  is_verified     BOOLEAN DEFAULT FALSE,
  subscription    TEXT DEFAULT 'free'
                  CHECK (subscription IN ('free','basic','pro','enterprise')),
  stripe_customer_id TEXT UNIQUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════
-- AGENCES
-- ══════════════════════════════════════════════════════
CREATE TABLE agencies (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES profiles(id),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  logo_url        TEXT,
  cover_url       TEXT,
  description     TEXT,
  city            TEXT,
  address         TEXT,
  phone           TEXT,
  email           TEXT,
  website         TEXT,
  is_verified     BOOLEAN DEFAULT FALSE,
  subscription    TEXT DEFAULT 'free'
                  CHECK (subscription IN ('free','basic','pro','enterprise')),
  subscription_ends_at TIMESTAMPTZ,
  rating          NUMERIC(2,1) DEFAULT 0,
  reviews_count   INTEGER DEFAULT 0,
  listings_count  INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Membres d'une agence (agents)
CREATE TABLE agency_members (
  agency_id       UUID REFERENCES agencies(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role            TEXT DEFAULT 'agent' CHECK (role IN ('owner','admin','agent')),
  joined_at       TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (agency_id, user_id)
);

-- ══════════════════════════════════════════════════════
-- ANNONCES
-- ══════════════════════════════════════════════════════
CREATE TABLE listings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  -- Contenu (bilingue)
  title           TEXT NOT NULL,
  title_ar        TEXT,
  description     TEXT,
  description_ar  TEXT,
  -- Classification
  type            TEXT NOT NULL CHECK (type IN (
                    'appartement','villa','riad','terrain',
                    'bureau','local','ferme','fond_commerce'
                  )),
  transaction     TEXT NOT NULL CHECK (transaction IN ('vente','location')),
  -- Prix (en centimes MAD pour éviter les flottants)
  price           BIGINT NOT NULL,
  price_negotiable BOOLEAN DEFAULT FALSE,
  -- Caractéristiques physiques
  area            NUMERIC(10,2),           -- m²
  bedrooms        SMALLINT,
  bathrooms       SMALLINT,
  floor           SMALLINT,
  total_floors    SMALLINT,
  year_built      SMALLINT,
  -- Localisation
  city            TEXT NOT NULL,
  district        TEXT,
  address         TEXT,
  location        GEOGRAPHY(POINT, 4326),  -- PostGIS : lng/lat
  -- Équipements (flexible, extensible sans migration)
  features        JSONB DEFAULT '{}',
  -- Ex: {"parking": true, "pool": true, "elevator": false, "garden": true,
  --      "security": true, "furnished": false, "terrace": true}
  -- Statut & Visibilité
  status          TEXT DEFAULT 'pending' CHECK (status IN (
                    'draft','pending','active','rejected',
                    'sold','rented','expired','archived'
                  )),
  rejection_reason TEXT,
  is_premium      BOOLEAN DEFAULT FALSE,
  is_featured     BOOLEAN DEFAULT FALSE,
  is_verified     BOOLEAN DEFAULT FALSE,
  quality_score   SMALLINT DEFAULT 0,      -- 0-100, calculé par trigger
  -- Métriques
  views_count     INTEGER DEFAULT 0,
  contacts_count  INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  -- Relations
  owner_id        UUID NOT NULL REFERENCES profiles(id),
  agency_id       UUID REFERENCES agencies(id),
  -- Dates
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  published_at    TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  -- SEO
  meta_title      TEXT,
  meta_description TEXT,
  -- Full-text search (mis à jour par trigger)
  search_vector   TSVECTOR
);

-- Index critiques pour les performances
CREATE INDEX idx_listings_location    ON listings USING GIST (location);
CREATE INDEX idx_listings_search      ON listings USING GIN (search_vector);
CREATE INDEX idx_listings_status_type ON listings (status, type);
CREATE INDEX idx_listings_city_status ON listings (city, status);
CREATE INDEX idx_listings_price       ON listings (price) WHERE status = 'active';
CREATE INDEX idx_listings_owner       ON listings (owner_id);
CREATE INDEX idx_listings_agency      ON listings (agency_id);
CREATE INDEX idx_listings_published   ON listings (published_at DESC) WHERE status = 'active';

-- Trigger : mise à jour du search_vector
CREATE OR REPLACE FUNCTION update_listing_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('french', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('french', coalesce(NEW.city, '')), 'B') ||
    setweight(to_tsvector('french', coalesce(NEW.district, '')), 'B') ||
    setweight(to_tsvector('french', coalesce(NEW.description, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_listing_search
  BEFORE INSERT OR UPDATE OF title, city, district, description
  ON listings
  FOR EACH ROW EXECUTE FUNCTION update_listing_search_vector();

-- ══════════════════════════════════════════════════════
-- IMAGES DES ANNONCES
-- ══════════════════════════════════════════════════════
CREATE TABLE listing_images (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id      UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  url             TEXT NOT NULL,              -- URL CDN publique
  storage_path    TEXT NOT NULL,              -- Chemin Supabase Storage
  position        SMALLINT DEFAULT 0,
  is_primary      BOOLEAN DEFAULT FALSE,
  width           INTEGER,
  height          INTEGER,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_listing_images_listing ON listing_images (listing_id, position);

-- ══════════════════════════════════════════════════════
-- PROJETS NEUFS
-- ══════════════════════════════════════════════════════
CREATE TABLE new_projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  promoter_id     UUID REFERENCES profiles(id),
  agency_id       UUID REFERENCES agencies(id),
  name            TEXT NOT NULL,
  description     TEXT,
  city            TEXT NOT NULL,
  address         TEXT,
  location        GEOGRAPHY(POINT, 4326),
  cover_url       TEXT,
  status          TEXT CHECK (status IN (
                    'pre_vente','en_construction','pret_a_livrer','livre'
                  )),
  total_units     INTEGER,
  available_units INTEGER,
  price_from      BIGINT,
  price_to        BIGINT,
  delivery_date   DATE,
  is_premium      BOOLEAN DEFAULT FALSE,
  is_verified     BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════
-- MESSAGERIE
-- ══════════════════════════════════════════════════════
CREATE TABLE conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id      UUID REFERENCES listings(id) ON DELETE SET NULL,
  -- Les deux participants (toujours 2 : acheteur + vendeur)
  buyer_id        UUID NOT NULL REFERENCES profiles(id),
  seller_id       UUID NOT NULL REFERENCES profiles(id),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (listing_id, buyer_id, seller_id)
);

CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES profiles(id),
  content         TEXT NOT NULL,
  read_at         TIMESTAMPTZ,                -- NULL = non lu
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conv_date ON messages (conversation_id, created_at DESC);
CREATE INDEX idx_conversations_buyer  ON conversations (buyer_id, last_message_at DESC);
CREATE INDEX idx_conversations_seller ON conversations (seller_id, last_message_at DESC);

-- ══════════════════════════════════════════════════════
-- FAVORIS & ALERTES
-- ══════════════════════════════════════════════════════
CREATE TABLE favorites (
  user_id         UUID REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id      UUID REFERENCES listings(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, listing_id)
);

CREATE TABLE saved_searches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name            TEXT,
  filters         JSONB NOT NULL,
  -- Ex: {"type":"appartement","city":"Casablanca","price_max":3000000,"bedrooms_min":2}
  frequency       TEXT DEFAULT 'daily'
                  CHECK (frequency IN ('instant','daily','weekly','never')),
  is_active       BOOLEAN DEFAULT TRUE,
  last_sent_at    TIMESTAMPTZ,
  results_count   INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════
-- DONNÉES MARCHÉ (rafraîchies hebdomadairement par cron)
-- ══════════════════════════════════════════════════════
CREATE TABLE market_stats (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city            TEXT NOT NULL,
  district        TEXT,
  type            TEXT NOT NULL,
  transaction     TEXT NOT NULL,
  avg_price       BIGINT,                     -- Prix moyen
  avg_price_sqm   BIGINT,                     -- Prix moyen par m²
  median_price    BIGINT,
  min_price       BIGINT,
  max_price       BIGINT,
  count           INTEGER,                    -- Nombre d'annonces analysées
  period          TEXT NOT NULL,              -- Ex: '2026-Q2'
  computed_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (city, district, type, transaction, period)
);

-- Historique des prix par annonce (pour tendances)
CREATE TABLE price_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id      UUID REFERENCES listings(id) ON DELETE CASCADE,
  price           BIGINT NOT NULL,
  recorded_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════
-- MONÉTISATION
-- ══════════════════════════════════════════════════════
CREATE TABLE orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES profiles(id),
  type                TEXT NOT NULL CHECK (type IN (
                        'listing_boost','listing_premium',
                        'agency_subscription','lead_fee','api_credit'
                      )),
  amount              INTEGER NOT NULL,           -- Centimes MAD
  currency            TEXT DEFAULT 'mad',
  stripe_payment_id   TEXT UNIQUE,
  stripe_session_id   TEXT,
  status              TEXT DEFAULT 'pending'
                      CHECK (status IN ('pending','paid','failed','refunded')),
  metadata            JSONB DEFAULT '{}',         -- listing_id, plan, etc.
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════
-- AVIS AGENCES
-- ══════════════════════════════════════════════════════
CREATE TABLE agency_reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id       UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  reviewer_id     UUID NOT NULL REFERENCES profiles(id),
  rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment         TEXT,
  is_verified     BOOLEAN DEFAULT FALSE,          -- A eu une transaction réelle
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (agency_id, reviewer_id)
);

-- Trigger : recalcule la note moyenne de l'agence
CREATE OR REPLACE FUNCTION update_agency_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE agencies SET
    rating = (SELECT ROUND(AVG(rating)::NUMERIC, 1) FROM agency_reviews WHERE agency_id = NEW.agency_id),
    reviews_count = (SELECT COUNT(*) FROM agency_reviews WHERE agency_id = NEW.agency_id)
  WHERE id = NEW.agency_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_agency_rating
  AFTER INSERT OR UPDATE OR DELETE ON agency_reviews
  FOR EACH ROW EXECUTE FUNCTION update_agency_rating();

-- ══════════════════════════════════════════════════════
-- SIGNALEMENTS (modération)
-- ══════════════════════════════════════════════════════
CREATE TABLE reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id     UUID NOT NULL REFERENCES profiles(id),
  listing_id      UUID REFERENCES listings(id) ON DELETE CASCADE,
  reason          TEXT NOT NULL CHECK (reason IN (
                    'fake','duplicate','wrong_price','inappropriate',
                    'already_sold','other'
                  )),
  details         TEXT,
  status          TEXT DEFAULT 'pending'
                  CHECK (status IN ('pending','reviewed','resolved','dismissed')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 6. Rôles & Permissions (RBAC)

### Matrice des droits

| Action | `anon` | `user` | `agency` | `promoter` | `admin` |
|--------|:------:|:------:|:--------:|:----------:|:-------:|
| Consulter annonces actives | ✅ | ✅ | ✅ | ✅ | ✅ |
| Consulter profils agences | ✅ | ✅ | ✅ | ✅ | ✅ |
| Créer une annonce | ❌ | ✅ | ✅ | ✅ | ✅ |
| Modifier ses annonces | ❌ | ✅ | ✅ | ✅ | ✅ |
| Dashboard agence | ❌ | ❌ | ✅ | ❌ | ✅ |
| Gérer agents de l'agence | ❌ | ❌ | ✅ | ❌ | ✅ |
| Créer un projet neuf | ❌ | ❌ | ❌ | ✅ | ✅ |
| Messagerie | ❌ | ✅ | ✅ | ✅ | ✅ |
| Sauvegarder des alertes | ❌ | ✅ | ✅ | ✅ | ✅ |
| Modérer des annonces | ❌ | ❌ | ❌ | ❌ | ✅ |
| Voir toutes les annonces | ❌ | ❌ | ❌ | ❌ | ✅ |
| Gérer les utilisateurs | ❌ | ❌ | ❌ | ❌ | ✅ |

### Implémentation : Row Level Security (Supabase)

```sql
-- 01_rls_policies.sql

-- LISTINGS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des annonces actives"
  ON listings FOR SELECT
  USING (status = 'active');

CREATE POLICY "L'admin voit tout"
  ON listings FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','superadmin')
  ));

CREATE POLICY "Owner voit et modifie ses annonces"
  ON listings FOR ALL
  USING (auth.uid() = owner_id);

CREATE POLICY "Agent d'agence gère les annonces de l'agence"
  ON listings FOR ALL
  USING (EXISTS (
    SELECT 1 FROM agency_members
    WHERE agency_id = listings.agency_id AND user_id = auth.uid()
  ));

-- MESSAGES
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Un user ne voit que ses messages"
  ON messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = conversation_id
    AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
  ));

CREATE POLICY "Un user envoie dans ses conversations"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_id
      AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
    )
  );
```

---

## 7. Modules Fonctionnels

```
┌────────────────────────────────────────────────────────────────────────┐
│                          MASKANI — MODULES                              │
├─────────────────┬────────────────┬─────────────────┬───────────────────┤
│  🔍 RECHERCHE   │  📋 ANNONCES   │   🗺️  CARTE      │  💬 MESSAGERIE    │
│                 │                │                  │                   │
│  Full-text FR+AR│  CRUD complet  │  Mapbox GL JS    │  Realtime WS      │
│  Filtres avancés│  Multi-photos  │  Markers prix    │  Conversations    │
│  Tri & pagination│ Score qualité  │  Clustering      │  Lu / Non lu      │
│  Géo (rayon km) │  Modération    │  Vue split       │  Notifications    │
│  Autocomplete   │  ISR 5min SEO  │  Géocodage adres.│  Historique       │
├─────────────────┼────────────────┼─────────────────┼───────────────────┤
│  🏢 AGENCES     │  🏗️  PROJETS   │   🤖 IA          │  💰 MONÉTISATION  │
│                 │   NEUFS        │                  │                   │
│  Profil complet │  Promoteurs    │  Estimation prix │  Stripe one-time  │
│  Dashboard leads│  Galerie/plans │  3 niveaux :     │  Abonnements      │
│  Gestion agents │  Disponibilité │  SQL→OpenAI→ML   │  Lead fees        │
│  Avis & notes   │  Livraison     │  Smart search    │  Display ads      │
│  Abonnements    │  Pré-vente     │  Auto-desc (IA)  │  API B2B          │
├─────────────────┼────────────────┼─────────────────┼───────────────────┤
│  📊 MARCHÉ      │  🔔 ALERTES    │   👤 AUTH         │  🛡️  ADMIN        │
│                 │                │                  │                   │
│  Prix/m² live   │  Saved search  │  Email + password│  Modération       │
│  Par quartier   │  Fréquence     │  Google OAuth    │  File annonces    │
│  Tendances      │  Email (Resend)│  Onboarding rôle │  Signalements     │
│  Historique     │  Alertes live  │  Vérification    │  Stats globales   │
│  API B2B        │  Push (V3 PWA) │  Session JWT     │  Gestion users    │
└─────────────────┴────────────────┴─────────────────┴───────────────────┘
```

---

## 8. Architecture Frontend

### Stratégie de rendu par page

| Route | Rendu | Revalidation | Raison |
|-------|-------|:------------:|--------|
| `/` Homepage | SSG + ISR | 1h | SEO maximal |
| `/annonces` | SSR | — | Filtres URL dynamiques |
| `/annonces/[slug]` | ISR | 5 min | SEO critique, contenu variable |
| `/agences` | ISR | 1h | Annuaire |
| `/agences/[slug]` | ISR | 30 min | Profil agence |
| `/marche/[city]` | ISR | 24h | Stats marché quotidiennes |
| `/projets-neufs` | ISR | 1h | — |
| `/estimation` | CSR | — | Interactif, pas de SEO |
| `/dashboard/*` | CSR | — | Auth required |
| `/messages/*` | CSR | — | Realtime |
| `/admin/*` | CSR | — | Auth admin required |

### State Management

```typescript
// store/searchStore.ts — Zustand
interface SearchState {
  query:      string
  type:       string | null
  transaction: 'vente' | 'location'
  city:       string | null
  priceMin:   number | null
  priceMax:   number | null
  bedrooms:   number | null
  areaMin:    number | null
  features:   string[]
  sort:       'recent' | 'price_asc' | 'price_desc'
  page:       number
  viewMode:   'grid' | 'list' | 'map' | 'split'
  mapBounds:  MapBounds | null
  setFilter:   (key: string, value: any) => void
  resetFilters: () => void
  setViewMode: (mode: ViewMode) => void
}
```

### SEO — Structured Data (annonce)

```typescript
// app/[locale]/annonces/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const listing = await getListing(params.slug)
  return {
    title: `${listing.title} — ${listing.city} | Maskani`,
    description: listing.description?.slice(0, 160),
    openGraph: { images: [listing.listing_images[0]?.url] }
  }
}

// JSON-LD Schema.org RealEstateListing
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateListing',
  name: listing.title,
  price: listing.price / 100,
  priceCurrency: 'MAD',
  address: { '@type': 'PostalAddress', addressLocality: listing.city },
  floorSize: { '@type': 'QuantitativeValue', value: listing.area, unitCode: 'MTK' }
}
```

---

## 9. Architecture Backend & API

### Conventions REST

```
GET    /api/listings              → Recherche (query params)
POST   /api/listings              → Créer une annonce       [auth]
GET    /api/listings/[id]         → Détail (public si active)
PUT    /api/listings/[id]         → Modifier                [owner | admin]
DELETE /api/listings/[id]         → Archiver                [owner | admin]
POST   /api/listings/[id]/contact → Initier conversation    [auth]
POST   /api/listings/[id]/boost   → Booster (Stripe)        [auth]

POST   /api/estimation            → Estimation prix IA      [auth]

GET    /api/market/[city]         → Données marché
GET    /api/market/[city]/[district] → Données par quartier

POST   /api/alerts                → Créer alerte            [auth]
GET    /api/alerts                → Mes alertes             [auth]
DELETE /api/alerts/[id]           → Supprimer alerte        [auth]

POST   /api/upload                → Upload image            [auth]

POST   /api/stripe/checkout       → Session paiement        [auth]
POST   /api/stripe/webhook        → Webhook Stripe          [stripe-signature]
```

### Structure type d'un Route Handler

```typescript
// app/api/listings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { listingSearchSchema } from '@/lib/validations/search'
import { buildSearchQuery } from '@/lib/search/buildQuery'
import { rateLimit } from '@/lib/upstash'

export async function GET(req: NextRequest) {
  // 1. Rate limiting
  const { success } = await rateLimit(req.ip ?? 'anon', 100, '1m')
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  // 2. Validation des paramètres
  const params = listingSearchSchema.safeParse(
    Object.fromEntries(new URL(req.url).searchParams)
  )
  if (!params.success) {
    return NextResponse.json({ error: params.error.flatten() }, { status: 400 })
  }

  // 3. Query Supabase
  const supabase = createSupabaseServerClient()
  const { data, error, count } = await buildSearchQuery(supabase, params.data)

  if (error) {
    console.error('[listings GET]', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }

  // 4. Cache headers (CDN Vercel)
  return NextResponse.json(
    { listings: data, total: count },
    { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } }
  )
}
```

---

## 10. Moteur de Recherche & Géospatial

### Stratégie

- **MVP** : PostgreSQL full-text (tsvector + GIN) + PostGIS — coût zéro, suffit à 100K annonces
- **V2** : Upgrade vers Typesense (self-hosted sur Fly.io) si volume > 100K et latence > 300ms
- **V3** : Search sémantique OpenAI embeddings pour "appartement lumineux avec vue" → résultats intelligents

### Query Builder

```typescript
// lib/search/buildQuery.ts
export function buildSearchQuery(supabase: SupabaseClient, f: SearchFilters) {
  let q = supabase
    .from('listings')
    .select(`
      id, slug, title, title_ar, price, area, bedrooms, bathrooms, city, district,
      type, transaction, is_premium, is_featured, is_verified, quality_score,
      published_at, views_count,
      listing_images ( url, position, is_primary )
    `, { count: 'exact' })
    .eq('status', 'active')

  // Filtres de base
  if (f.type)        q = q.eq('type', f.type)
  if (f.transaction) q = q.eq('transaction', f.transaction)
  if (f.city)        q = q.ilike('city', `%${f.city}%`)
  if (f.price_min)   q = q.gte('price', f.price_min)
  if (f.price_max)   q = q.lte('price', f.price_max)
  if (f.bedrooms)    q = q.gte('bedrooms', f.bedrooms)
  if (f.area_min)    q = q.gte('area', f.area_min)
  if (f.area_max)    q = q.lte('area', f.area_max)
  if (f.is_verified) q = q.eq('is_verified', true)

  // Équipements (JSONB)
  if (f.features?.length) {
    f.features.forEach(feat => {
      q = q.contains('features', { [feat]: true })
    })
  }

  // Recherche textuelle (full-text FR)
  if (f.q) {
    q = q.textSearch('search_vector', f.q, {
      type: 'websearch',
      config: 'french'
    })
  }

  // Recherche géospatiale (rayon en km autour d'un point)
  if (f.lat && f.lng && f.radius_km) {
    q = q.rpc('listings_within_radius', {
      lat: f.lat, lng: f.lng, radius_km: f.radius_km
    })
  }

  // Tri : premium et featured toujours en premier
  q = q.order('is_featured', { ascending: false })
       .order('is_premium',  { ascending: false })

  const sortMap: Record<string, { col: string; asc: boolean }> = {
    recent:     { col: 'published_at', asc: false },
    price_asc:  { col: 'price', asc: true },
    price_desc: { col: 'price', asc: false },
    area_desc:  { col: 'area', asc: false },
  }
  const sort = sortMap[f.sort ?? 'recent']
  q = q.order(sort.col, { ascending: sort.asc })

  // Pagination
  const page  = f.page  ?? 1
  const limit = f.limit ?? 24
  q = q.range((page - 1) * limit, page * limit - 1)

  return q
}
```

### Fonction PostGIS

```sql
-- supabase/migrations/02_functions.sql
CREATE OR REPLACE FUNCTION listings_within_radius(
  lat      FLOAT,
  lng      FLOAT,
  radius_km FLOAT
)
RETURNS SETOF listings
LANGUAGE sql STABLE AS $$
  SELECT * FROM listings
  WHERE status = 'active'
    AND ST_DWithin(
      location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::GEOGRAPHY,
      radius_km * 1000
    )
  ORDER BY
    ST_Distance(location, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::GEOGRAPHY);
$$;
```

---

## 11. Messagerie Temps Réel

### Architecture

```
Client A (acheteur)                       Client B (vendeur)
        │                                         │
        │  supabase.channel('conv:[id]')          │
        │  .on('postgres_changes', INSERT, ...)   │
        ├─────────────────────────────────────────►│
        │           WebSocket (Supabase Realtime)  │
        │◄────────────────────────────────────────┤
        │                                         │
     INSERT messages                           INSERT messages
     → RLS valide sender_id                    → RLS valide sender_id
     → Realtime broadcast auto                 → Realtime broadcast auto
```

### Hook

```typescript
// hooks/useMessages.ts
export function useMessages(conversationId: string) {
  const [messages, setMessages] = useState<MessageWithSender[]>([])
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    // Charger l'historique
    supabase
      .from('messages')
      .select('*, sender:profiles!sender_id(full_name, avatar_url)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .then(({ data }) => setMessages(data ?? []))

    // Écouter les nouveaux messages
    const channel = supabase
      .channel(`conv:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, ({ new: msg }) => {
        setMessages(prev => [...prev, msg as MessageWithSender])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [conversationId])

  const send = async (content: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('messages').insert({ conversation_id: conversationId, content, sender_id: user!.id })
  }

  return { messages, send }
}
```

---

## 12. Module IA & Estimation

### Stratégie en 3 phases progressives

```
Phase 1 — SQL statistique        Phase 2 — OpenAI              Phase 3 — ML custom
(MVP — coût zéro)                (V2 — ~0.01$/call)            (V3 — coût fixe)
─────────────────────────        ──────────────────            ─────────────────
AVG(price_sqm) par               GPT-4o + contexte             Modèle entraîné sur
  ville / type / quartier        marché + features             les données Maskani
Confiance : LOW → MEDIUM         Confiance : HIGH              Confiance : VERY HIGH
Livraison : semaine 8            Livraison : semaine 18        Livraison : V3
```

### Phase 1 — Estimation SQL (MVP)

```typescript
// lib/ai/estimation.ts
export async function estimatePrice(p: EstimationInput) {
  const supabase = createSupabaseServerClient()

  // Chercher les stats du quartier, puis de la ville si absent
  const { data } = await supabase
    .from('market_stats')
    .select('avg_price_sqm, median_price, count, period')
    .eq('city', p.city)
    .eq('type', p.type)
    .eq('transaction', p.transaction)
    .order('computed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!data || data.count < 5) {
    return { error: 'Données insuffisantes pour cette zone' }
  }

  const base = data.avg_price_sqm * p.area

  // Ajustements selon les features
  const multipliers = {
    pool: 1.12, elevator: 1.06, parking: 1.05,
    garden: 1.08, terrace: 1.07, security: 1.04
  }
  let adjusted = base
  p.features?.forEach(f => {
    if (multipliers[f]) adjusted *= multipliers[f]
  })

  const confidence = data.count >= 50 ? 'high' : data.count >= 15 ? 'medium' : 'low'
  return {
    price_low:   Math.round(adjusted * 0.88),
    price_mid:   Math.round(adjusted),
    price_high:  Math.round(adjusted * 1.14),
    price_sqm:   data.avg_price_sqm,
    confidence,
    sample_size: data.count,
    period:      data.period,
    method:      'statistical'
  }
}
```

### Phase 2 — OpenAI GPT-4o

```typescript
export async function estimatePriceAI(p: EstimationInput) {
  const [stats, comparables] = await Promise.all([
    getMarketStats(p.city, p.type, p.transaction),
    getComparableListings(p)          // 5 annonces similaires récentes
  ])

  const { choices } = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `Expert immobilier marocain. JSON uniquement :
        { price_low, price_mid, price_high, reasoning_fr, reasoning_ar, confidence }`
      },
      {
        role: 'user',
        content: JSON.stringify({ property: p, market: stats, comparables })
      }
    ]
  })

  return JSON.parse(choices[0].message.content!)
}
```

---

## 13. Internationalisation FR + AR (RTL)

### Principe : infrastructure dès le jour 1, activation AR en Phase 2

L'infrastructure i18n est en place dès le départ pour éviter un refacto coûteux.
Le lancement se fait en **français uniquement**. Les chaînes arabes sont traduites en parallèle.
L'arabe est activé en Phase 2 quand les traductions sont complètes.

### Configuration next-intl

```typescript
// i18n/routing.ts
import { defineRouting } from 'next-intl/routing'
export const routing = defineRouting({
  locales: ['fr', 'ar'],
  defaultLocale: 'fr',
  localePrefix: 'always'   // /fr/annonces  et  /ar/إعلانات
})

// middleware.ts — Intégration
export default createMiddleware(routing)
export const config = { matcher: ['/((?!api|_next|.*\\..*).*)'] }
```

### Layout avec direction RTL automatique

```typescript
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'

export default async function LocaleLayout({ children, params: { locale } }) {
  if (!['fr', 'ar'].includes(locale)) notFound()
  const messages = await import(`@/i18n/messages/${locale}.json`)
  const isRTL = locale === 'ar'

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body className={cn(
        fontSans.variable,
        fontDisplay.variable,
        isRTL && 'font-arabic'
      )}>
        <NextIntlClientProvider locale={locale} messages={messages.default}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

### CSS — Propriétés logiques (RTL-ready)

```css
/* ✅ À utiliser — s'inverse automatiquement en RTL */
.card { padding-inline-start: 1rem; }         /* = padding-left en LTR */
.card { margin-inline-end: 0.5rem; }          /* = margin-right en LTR */
.card { border-inline-start: 2px solid; }     /* = border-left en LTR */

/* ❌ À éviter — ne s'inverse pas */
.card { padding-left: 1rem; }
.card { margin-right: 0.5rem; }

/* Tailwind RTL classes */
<div className="text-start rtl:text-end">     /* text-left en LTR, text-right en RTL */
<div className="ms-4">                         /* margin-inline-start */
```

### Structure messages i18n

```json
// i18n/messages/fr.json (extrait)
{
  "search": {
    "placeholder_city": "Ville, quartier...",
    "buy": "Acheter",
    "rent": "Louer",
    "results": "{count, plural, =0 {Aucun résultat} one {# annonce} other {# annonces}}"
  },
  "listing": {
    "bedrooms": "{n, plural, one {# chambre} other {# chambres}}",
    "price": "{price, number, ::currency/MAD}"
  }
}
```

```json
// i18n/messages/ar.json (extrait)
{
  "search": {
    "placeholder_city": "المدينة، الحي...",
    "buy": "شراء",
    "rent": "إيجار",
    "results": "{count} إعلان"
  },
  "listing": {
    "bedrooms": "{n} غرف",
    "price": "{price} درهم"
  }
}
```

---

## 14. Monétisation

### Vue d'ensemble des revenus

| Flux | Mécanisme | Implémentation | Phase |
|------|-----------|----------------|-------|
| **Boost annonce** | One-time 99–299 MAD, `is_featured=true` 30j | Stripe Checkout | MVP |
| **Annonce Premium** | Badge + top search + stats visibilité | Stripe Checkout | MVP |
| **Abonnement Agence** | Monthly/annual, 3 plans | Stripe Subscriptions | V2 |
| **Lead qualifié** | Commission sur mise en relation vérifiée | Stripe + webhook | V2 |
| **Display Advertising** | CPM/CPC, Google AdSense ou direct | AdSense | V3 |
| **API B2B données** | Prix/m² par quartier, API key + quota | Stripe + Upstash | V3 |

### Plans agences

```typescript
// lib/stripe/plans.ts
export const AGENCY_PLANS = {
  basic: {
    name: 'Basic',
    price_mad_monthly: 79900,         // 799 MAD / mois
    price_mad_annual:  719100,        // 7 191 MAD / an (-10%)
    stripe_monthly_id: 'price_xxx',
    stripe_annual_id:  'price_yyy',
    limits: {
      active_listings:   20,
      featured_listings:  2,
      team_members:       1,
      analytics:         false,
      verified_badge:    false,
    }
  },
  pro: {
    name: 'Pro',
    price_mad_monthly: 199900,
    price_mad_annual:  1799100,
    stripe_monthly_id: 'price_aaa',
    stripe_annual_id:  'price_bbb',
    limits: {
      active_listings:   100,
      featured_listings:  10,
      team_members:        5,
      analytics:          true,
      verified_badge:     true,
    }
  },
  enterprise: {
    name: 'Enterprise',
    price_mad_monthly: 499900,
    price_mad_annual:  4499100,
    stripe_monthly_id: 'price_ccc',
    stripe_annual_id:  'price_ddd',
    limits: {
      active_listings:   Infinity,
      featured_listings:  50,
      team_members:       Infinity,
      analytics:          true,
      verified_badge:     true,
      api_access:         true,
    }
  }
}
```

### Webhook Stripe

```typescript
// app/api/stripe/webhook/route.ts
export async function POST(req: NextRequest) {
  const sig  = req.headers.get('stripe-signature')!
  const body = await req.text()
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  const supabase = createSupabaseAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.CheckoutSession
      const { listing_id, type } = session.metadata!
      await supabase.from('orders').update({ status: 'paid' })
        .eq('stripe_session_id', session.id)
      if (type === 'listing_boost') {
        await supabase.from('listings').update({
          is_featured: true,
          expires_at: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString()
        }).eq('id', listing_id)
      }
      break
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const plan = sub.status === 'active' ? sub.metadata.plan : 'free'
      await supabase.from('profiles')
        .update({ subscription: plan })
        .eq('stripe_customer_id', sub.customer as string)
      break
    }
  }
  return NextResponse.json({ received: true })
}
```

---

## 15. Infrastructure & DevOps

### Pipeline CI/CD

```
Push GitHub (feature/xxx)
    │
    ├─→ GitHub Actions
    │     ├── pnpm install
    │     ├── tsc --noEmit          (type check)
    │     ├── eslint .              (lint)
    │     ├── vitest run            (tests unitaires)
    │     └── supabase db diff      (check migrations)
    │
    └─→ Vercel Preview Deploy → URL unique par PR

Merge vers main
    │
    └─→ Vercel Production Deploy (auto)
```

### Variables d'environnement

```bash
# .env.local  (jamais commité)

# ── Supabase ──────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...       # Server only — ne jamais exposer

# ── Mapbox ────────────────────────────────────────────
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...

# ── OpenAI ───────────────────────────────────────────
OPENAI_API_KEY=sk-proj-...

# ── Stripe ───────────────────────────────────────────
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ── Resend (emails) ──────────────────────────────────
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@maskani.ma

# ── Upstash Redis (rate limiting) ────────────────────
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# ── Analytics & Monitoring ───────────────────────────
NEXT_PUBLIC_POSTHOG_KEY=phc_...
SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=...

# ── App ──────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=https://maskani.ma
CRON_SECRET=secret_long_aleatoire        # Protège les routes /api/cron/*
```

### Cron Jobs Vercel

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/send-alerts",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/expire-listings",
      "schedule": "0 1 * * *"
    },
    {
      "path": "/api/cron/refresh-stats",
      "schedule": "0 3 * * 0"
    }
  ]
}
```

### Supabase Storage — Organisation des buckets

```
listing-images/
  └── {listing_id}/
        ├── {uuid}_0.webp      (primary)
        ├── {uuid}_1.webp
        └── ...
project-images/
  └── {project_id}/
        └── ...
agency-assets/
  └── {agency_id}/
        ├── logo.webp
        └── cover.webp
avatars/
  └── {user_id}/
        └── avatar.webp
```

---

## 16. Sécurité

### Checklist non-négociable

- **RLS activé** sur **toutes** les tables — principe du moindre privilège
- **`SUPABASE_SERVICE_ROLE_KEY`** uniquement côté serveur, jamais dans le client
- **Validation Zod** sur tous les inputs API (body, query params, path params)
- **Rate limiting** Upstash sur : `/api/listings` (POST), `/api/estimation`, `/api/listings/[id]/contact`
- **Validation Stripe Webhook** — vérification signature `stripe-signature` obligatoire
- **Upload images** — validation MIME type (whitelist WebP/JPEG/PNG), taille max 10 MB, pas d'exécution côté serveur
- **Annonces en `pending`** avant publication — modération avant activation
- **Headers sécurité** configurés dans `next.config.ts`
- **Secrets** — jamais dans le code, toujours en variables d'environnement

### Headers de sécurité

```typescript
// next.config.ts
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Content-Security-Policy', value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel.app",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "img-src 'self' data: blob: *.supabase.co *.mapbox.com images.unsplash.com",
    "connect-src 'self' *.supabase.co *.mapbox.com api.openai.com",
    "font-src 'self' fonts.gstatic.com",
  ].join('; ') }
]
```

### Middleware d'authentification

```typescript
// middleware.ts
export default async function middleware(req: NextRequest) {
  const { supabase, response } = createMiddlewareClient(req)
  const { data: { session } } = await supabase.auth.getSession()

  const isDashboard = req.nextUrl.pathname.includes('/dashboard')
  const isAdmin     = req.nextUrl.pathname.includes('/admin')
  const isCron      = req.nextUrl.pathname.includes('/api/cron')

  // Protéger les routes dashboard
  if (!session && isDashboard) {
    const locale = req.nextUrl.pathname.split('/')[1]
    return NextResponse.redirect(new URL(`/${locale}/connexion`, req.url))
  }

  // Protéger les cron jobs
  if (isCron) {
    const secret = req.headers.get('authorization')
    if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Vérifier le rôle admin
  if (isAdmin && session) {
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', session.user.id).single()
    if (!['admin', 'superadmin'].includes(profile?.role ?? '')) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook).*)']
}
```

---

## 17. Roadmap de Développement

### Phase 0 — Setup & fondations (Semaines 1–2)

- [ ] Scaffold Next.js 14 + TypeScript + Tailwind + shadcn/ui
- [ ] Supabase : projet, DB schema, migrations, RLS policies
- [ ] Auth : email/password + Google OAuth + onboarding rôle
- [ ] Design system : tokens couleurs, typographies, composants de base
- [ ] next-intl : routing FR + AR en place, traductions FR complètes
- [ ] CI/CD : GitHub Actions + Vercel preview deploys

### Phase 1 — Core MVP (Semaines 3–8)

- [ ] Homepage : hero + search + annonces à la une
- [ ] Page `/annonces` : recherche SSR + filtres + pagination
- [ ] Page détail annonce : ISR + galerie + contact
- [ ] CRUD annonces : formulaire multi-step + upload photos Supabase Storage
- [ ] Carte Mapbox : markers + clustering + vue split
- [ ] Profils utilisateurs + tableau de bord basique
- [ ] Modération back-office (file d'attente admin)

### Phase 2 — Features Complètes (Semaines 9–14)

- [ ] Messagerie temps réel (Supabase Realtime)
- [ ] Alertes email : saved searches + cron + Resend
- [ ] Dashboard agences : stats, annonces, leads, équipe
- [ ] Projets neufs : CRUD promoteurs + page liste/détail
- [ ] Avis & notes agences
- [ ] Vérification annonces + badges qualité
- [ ] SEO avancé : sitemap dynamique, structured data JSON-LD
- [ ] Activation langue arabe (RTL)

### Phase 3 — Monétisation & IA (Semaines 15–22)

- [ ] Stripe : boost annonces + annonces premium
- [ ] Stripe : abonnements agences (Basic/Pro/Enterprise)
- [ ] Estimation prix IA Phase 1 (SQL) + Phase 2 (OpenAI)
- [ ] Module données marché : prix/m² + tendances + historique
- [ ] Recommandations personnalisées (based on favorites + searches)
- [ ] Analytics PostHog + dashboards métriques
- [ ] Sentry monitoring production

### Phase 4 — Scale (Roadmap longue)

- [ ] API B2B données marché (key + rate limiting)
- [ ] Search sémantique (OpenAI embeddings ou Typesense)
- [ ] Notifications push (PWA)
- [ ] Estimation IA Phase 3 (modèle ML custom)
- [ ] Expansion géographique (Tunisie, Algérie)
- [ ] Application mobile native (si traction validée)

---

## 18. Règles & Conventions

### Git Flow

```
main          ── Production (Vercel auto-deploy)
develop       ── Staging (preview deploy)
feature/xxx   ── Nouvelles fonctionnalités
fix/xxx       ── Correctifs
chore/xxx     ── Config, dépendances, refacto
```

### Commits (Conventional Commits)

```bash
feat: ajouter la carte interactive Mapbox sur la page search
fix: corriger le filtre prix en mode location
feat(ai): intégrer l'estimation OpenAI Phase 2
chore: mettre à jour Supabase JS vers v2.45
feat(i18n): activer la langue arabe avec RTL
fix(auth): redirection post-login selon le rôle
```

### Naming

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Composants | PascalCase | `ListingCard.tsx` |
| Hooks | camelCase + `use` | `useListings.ts` |
| Utilitaires | camelCase | `buildQuery.ts` |
| Types | PascalCase | `ListingFilters` |
| API routes | kebab-case | `/api/saved-searches` |
| Variables | camelCase | `pricePerSqm` |
| Tables DB | snake_case | `listing_images` |
| Env vars | SCREAMING_SNAKE_CASE | `STRIPE_SECRET_KEY` |
| Slugs URL | kebab-case | `appartement-vue-mer-tanger` |

### Performance Budget

| Métrique | Cible | Outil de mesure |
|----------|-------|----------------|
| LCP | < 2.5s | Vercel Speed Insights |
| INP | < 200ms | Chrome DevTools |
| CLS | < 0.1 | Lighthouse |
| Bundle JS initial | < 150 KB gzip | `next build --analyze` |
| Images | WebP uniquement | next/image |
| Appels DB par page | < 3 | Supabase logs |

### Génération des types Supabase

```bash
# À relancer après chaque migration
npx supabase gen types typescript --project-id xxx > types/database.ts
```

---

## 19. Décisions d'Architecture (ADR)

### ADR-001 — Supabase remplace PlanetScale

**Contexte** : PlanetScale est basé sur MySQL. MySQL ne supporte pas l'extension PostGIS, indispensable pour la recherche géospatiale (rayon autour d'un point, cartes thermiques).

**Décision** : Supabase (PostgreSQL 15 + PostGIS) pour la base de données. PlanetScale est abandonné.

**Conséquences** : Géospatial natif et performant. Auth + Realtime + Storage intégrés. Migrations SQL classiques. Pas de support des jointures MySQL-style (inexistant en pratique).

---

### ADR-002 — Next.js App Router (pas Pages Router)

**Contexte** : Le Pages Router est en maintenance. L'App Router est l'avenir de Next.js avec les Server Components, le streaming et l'ISR natif amélioré.

**Décision** : App Router dès le départ malgré la courbe d'apprentissage.

**Conséquences** : Moins de JS envoyé au client (Server Components), meilleur SEO, patterns de data fetching modernes. La documentation est parfois incomplète pour les edge cases.

---

### ADR-003 — Pas de Prisma en MVP

**Contexte** : Supabase génère des types TypeScript depuis le schéma DB (`supabase gen types`). Prisma ajoute une couche d'abstraction et un processus de build supplémentaire.

**Décision** : Client Supabase JS + types auto-générés. Prisma pourra être introduit en V2 si la complexité des requêtes le justifie.

**Conséquences** : Stack allégée, requêtes proches du SQL, régénération des types après chaque migration.

---

### ADR-004 — Estimation IA en 3 phases

**Contexte** : Développer un modèle ML custom seul dès le MVP est irréaliste (data insuffisante, temps, coût).

**Décision** : Phase 1 statistique (SQL AVG, coût zéro), Phase 2 OpenAI (~0.01$/call), Phase 3 modèle custom entraîné sur les données Maskani.

**Conséquences** : Time-to-market court. Upgrade progressif sans refonte. La précision augmente avec le volume de données.

---

### ADR-005 — i18n infrastructure J1, activation AR en Phase 2

**Contexte** : Refactoriser une codebase Next.js pour ajouter l'i18n après coup est très coûteux. Mais traduire et tester le RTL en même temps que le core MVP ralentirait trop la livraison.

**Décision** : next-intl installé et configuré dès le setup. Toutes les chaînes de texte passent par les messages i18n. Les fichiers `ar.json` sont préparés. Le routing `/ar/*` est activé en Phase 2 quand les traductions sont validées.

**Conséquences** : Pas de refacto majeur pour l'arabe. Lancement FR plus rapide. Quelques semaines de délai sur l'activation AR, acceptable.

---

### ADR-006 — Mapbox plutôt que Google Maps

**Contexte** : Google Maps est dominant mais cher à l'échelle. Mapbox offre un pricing plus favorable pour les startups (50K loads/mois gratuits), les tiles peuvent être personnalisés, et l'API est très puissante.

**Décision** : Mapbox GL JS pour toute la cartographie.

**Conséquences** : Économies significatives. Style de carte personnalisable au branding Maskani. Nécessite un token Mapbox public (exposé côté client, normal — restreindre aux domaines autorisés dans le dashboard Mapbox).

---

*Document maintenu par l'équipe Maskani — v1.0 — 2026*
*Toute décision d'architecture majeure doit faire l'objet d'un nouvel ADR.*
