# 🎬 Plateforme de Conférences Tech

Une plateforme moderne de gestion et de découverte de conférences inspirée de Netflix et Arte, développée avec Next.js 16 et React 19.

## ✨ Fonctionnalités

### Pour tous les utilisateurs

- 🏠 **Page d'accueil** - Découvrez les conférences avec un hero dynamique et une grille stylisée
- 🔍 **Détails de conférence** - Informations complètes : speakers, stakeholders, localisation OpenStreetMap
- ❤️ **Favoris** - Sauvegardez vos conférences préférées (stockage local, sans connexion requise)
- 🌓 **Thème clair/sombre** - Basculez entre les modes avec persistance système
- 📱 **Design responsive** - Interface adaptée mobile, tablette et desktop

### Pour les administrateurs

- 🔐 **Authentification JWT** - Connexion sécurisée avec gestion de rôles
- ➕ **Création de conférences** - Formulaire complet avec upload d'image ou URL
- ✏️ **Édition** - Modification de tous les champs y compris speakers et coordonnées
- 🗑️ **Suppression** - Gestion complète du cycle de vie
- 🎨 **Génération automatique de couleurs** - Extraction depuis les images avec optimisation dark mode
- 👥 **Gestion des utilisateurs** - Promotion/rétrogradation des rôles et suppression (avec protection anti-auto-modification)

### Pour les nouveaux utilisateurs

- 📝 **Inscription** - Création de compte avec validation Zod
- 🔑 **Connexion** - Authentification persistante avec redirection automatique

## 🚀 Technologies

### Frontend

- **Next.js 16.1.6** - App Router, Turbopack, React Server Components
- **React 19** - Dernière version avec transitions et suspense améliorés
- **TypeScript** - Typage strict pour la fiabilité
- **Tailwind CSS 4** - Styling moderne avec design tokens
- **shadcn/ui** - Composants accessibles et personnalisables
- **Zustand** - State management avec persistance localStorage
- **TanStack Query v5** - Gestion du cache et des requêtes serveur
- **react-hook-form + Zod** - Validation robuste des formulaires
- **Lucide React** - Icônes modernes et cohérentes
- **next-themes** - Gestion du thème avec support système

### Backend (attendu)

- **API REST** sur `http://localhost:4555`
- **MongoDB** - Base de données NoSQL
- **JWT** - Authentification par tokens Bearer

## 📦 Installation

### Prérequis

- Node.js 18+ et npm/yarn/pnpm
- Backend API fonctionnel sur le port 4555

### Frontend

```bash
cd frontend
npm install
npm run seed # (optionnel) Seed de données pour tests, ajoute des conférences et un admin par défaut
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

### Variables d'environnement

Créez un fichier `.env.local` dans `frontend/` :

```env
NEXT_PUBLIC_API_URL=http://localhost:4555
```

## 🗂️ Structure du projet

```yml
evaluation-react/
├── frontend/
│   ├── app/                    # Pages Next.js App Router
│   │   ├── (public)/          # Routes publiques (home, détails)
│   │   ├── (admin)/           # Routes admin protégées
│   │   ├── login/             # Page de connexion
│   │   ├── register/          # Page d'inscription
│   │   ├── favorites/         # Page des favoris
│   │   ├── error.tsx          # Gestion d'erreurs globale
│   │   └── layout.tsx         # Layout racine avec providers
│   ├── components/            # Composants React
│   │   ├── public/            # Composants publics (cards, hero, navbar)
│   │   ├── admin/             # Composants admin (forms, tables)
│   │   ├── shared/            # Composants partagés (logo, favorite-button)
│   │   └── ui/                # Composants shadcn/ui
│   ├── hooks/                 # Custom hooks React
│   │   ├── use-auth.ts        # Authentification
│   │   ├── use-conferences.ts # Gestion des conférences
│   │   └── use-users.ts       # Gestion des utilisateurs
│   ├── lib/                   # Utilitaires et helpers
│   │   ├── api.ts             # Client API avec intercepteur d'erreurs
│   │   └── auth.ts            # Helpers d'authentification
│   ├── services/              # Couche de services API
│   ├── store/                 # Stores Zustand
│   │   ├── auth-store.ts      # État d'authentification
│   │   └── favorites-store.ts # Gestion des favoris (localStorage)
│   └── types/                 # Définitions TypeScript
└── docker-compose.yml         # Configuration Docker (backend)
```

## 🎯 Pages

| Route                     | Description                        | Protection |
| ------------------------- | ---------------------------------- | ---------- |
| `/`                       | Page d'accueil avec hero et grille | Public     |
| `/conference/[id]`        | Détails d'une conférence           | Public     |
| `/favorites`              | Liste des favoris                  | Public     |
| `/login`                  | Connexion                          | Public     |
| `/register`               | Inscription                        | Public     |
| `/admin/conferences`      | Liste admin des conférences        | Admin      |
| `/admin/conferences/new`  | Création de conférence             | Admin      |
| `/admin/conferences/[id]` | Édition de conférence              | Admin      |
| `/admin/users`            | Gestion des utilisateurs           | Admin      |

## 🔐 Authentification

Le système utilise JWT avec les rôles suivants :

- **user** - Utilisateur standard (lecture seule)
- **admin** - Administrateur (CRUD complet)

Les tokens sont stockés dans `localStorage` et automatiquement attachés aux requêtes API.

## 🎨 Thème

Le système de thème supporte trois modes :

- **Light** - Thème clair
- **Dark** - Thème sombre (optimisé pour les couleurs extraites)
- **System** - Suit les préférences du système d'exploitation

## 📝 Gestion d'erreurs

Système multi-couches :

- `error.tsx` - Erreurs de rendu React
- `global-error.tsx` - Erreurs critiques
- `not-found.tsx` - Pages 404
- `ApiError` - Classe d'erreur API avec types
- Redirection automatique sur 401 (non authentifié)

## 🛠️ Scripts disponibles

```bash
npm run dev          # Développement avec Turbopack
npm run build        # Build production
npm run start        # Serveur production
npm run lint         # ESLint
npm run type-check   # Vérification TypeScript
npm run seed         # Seed de données (si implémenté)
```

## 🌈 Extraction de couleurs

Le système génère automatiquement 3 couleurs depuis les images de conférences :

- **Analyse Canvas** - Extraction des couleurs dominantes
- **Optimisation dark mode** - Ajustement de la luminosité
- **Fallback intelligent** - Couleurs par défaut si échec

## 📄 License

MIT

## 👤 Auteur

Développé dans le cadre d'une évaluation React/Next.js
