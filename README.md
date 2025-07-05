# URL Shortener - NestJS Application

A full-stack URL shortener application built with NestJS, TypeScript, Prisma, and PostgreSQL.

## Objectif du test

L'objectif de ce test pratique est de développer une application full-stack complète : un **réducteur d'URL**.

## Contexte du projet

Vous devez créer un service web permettant aux utilisateurs de soumettre une URL "longue" et d'obtenir en retour une URL "courte" unique. Lorsqu'un utilisateur visite cette URL courte, il doit être redirigé vers l'URL originale correspondante.

## Architecture

### Backend - NestJS (TypeScript)
- **Clean Code** architecture avec modules, contrôleurs, services
- **PostgreSQL** database avec **Prisma ORM**
- **Validation** des données d'entrée
- **Tests unitaires** complets

### API Endpoints

#### POST /api/url
Crée une nouvelle URL raccourcie

**Request Body:**
```json
{
  "originalUrl": "https://example.com/very/long/url"
}
```

**Response:**
```json
{
  "id": 1,
  "originalUrl": "https://example.com/very/long/url",
  "shortCode": "abc123",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

#### GET /:shortCode
Redirige vers l'URL originale

**Response:** Redirection HTTP 302 vers l'URL originale

## Installation et Configuration

### Prérequis
- Node.js (le plus récent)
- PostgreSQL
- npm ou yarn

### Installation

1. Clonez le repository
```bash
git clone <repository-url>
cd url-shortener-manasseh
```

2. Installez les dépendances
```bash
npm install
```

3. Configuration de la base de données
   - Copiez `.env.example` vers `.env`
   - Configurez la `DATABASE_URL` dans le fichier `.env`

```bash
cp .env.example .env
```

4. Générez le client Prisma et synchronisez la base de données
```bash
npm run db:generate
npm run db:push
```

## Scripts disponibles

### Développement
```bash
# Démarrer en mode développement
npm run start:dev

# Démarrer en mode production
npm run start:prod

# Build du projet
npm run build
```

### Base de données
```bash
# Générer le client Prisma
npm run db:generate

# Pousser le schéma vers la DB
npm run db:push

# Créer une migration
npm run db:migrate

# Ouvrir Prisma Studio
npm run db:studio
```

### Tests
```bash
# Tests unitaires
npm run test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:cov

# Tests e2e
npm run test:e2e
```

### Code Quality
```bash
# Linting
npm run lint

# Formatage du code
npm run format
```

## Structure du projet

```
src/
├── app.module.ts           # Module principal
├── main.ts                 # Point d'entrée de l'application
├── database/               # Module de base de données
│   ├── database.module.ts
│   └── database.service.ts
└── url/                    # Module URL
    ├── dto/
    │   └── create-url.dto.ts
    ├── entities/
    │   └── url.entity.ts
    ├── url.controller.ts
    ├── url.service.ts
    ├── url.module.ts
    └── *.spec.ts           # Tests unitaires
```

## Fonctionnalités implémentées

**API REST** avec NestJS  
**Validation** des URLs avec class-validator  
**Base de données** PostgreSQL avec Prisma  
**Génération de codes courts** sécurisée avec crypto  
**Gestion des collisions** de codes courts  
**Tests unitaires** complets avec mocks  
**Architecture Clean Code** avec séparation des responsabilités  
**Redirection automatique** vers l'URL originale  
**Gestion d'erreurs** appropriée  

## Technologies utilisées

- **NestJS** - Framework Node.js progressif
- **TypeScript** - JavaScript avec typage statique
- **Prisma** - ORM moderne pour TypeScript
- **PostgreSQL** - Base de données relationnelle
- **Jest** - Framework de tests
- **class-validator** - Validation des données
- **ESLint & Prettier** - Qualité et formatage du code
