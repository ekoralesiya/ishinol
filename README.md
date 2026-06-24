# ISHINOL Indonesia — Premium Corporate Website

A production-ready, multilingual corporate website and headless CMS for **ISHINOL Indonesia**, the official distributor and trademark holder of ISHINOL premium Japanese stone, marble and granite surface-protection coatings.

Designed to feel like a global luxury brand (Apple / Tesla / Dyson), fully content-managed through an admin panel — **no source edits required** to change content.

---

## ✨ Features

- **Premium, animated UI** — white-dominant, gold-accented, marble-inspired, glassmorphism, Framer Motion transitions, full-screen sections.
- **Bilingual (ID / EN)** with `next-intl`, SEO-friendly localized URLs (`/id/produk`, `/en/products`), browser-language detection, cookie persistence, and a header language switcher.
- **Public pages** — Home, About, Products (+ detail), Portfolio (+ detail), News (+ detail), Video Gallery, Download Center, Contact.
- **Floating actions** — animated WhatsApp sales button (`+62 856-9777-7292`) and a live-chat widget.
- **Admin CMS** (`/admin`) — dashboard, home/hero, products, portfolio, news, media, videos, downloads, testimonials, leads, chat, users, SEO, and site settings. All content is bilingual.
- **AI Content Assistant** — generate/rewrite/translate product copy, articles, SEO metadata and FAQs (Claude API).
- **Role-based access control** — Super Admin / Admin / Editor.
- **SEO** — dynamic metadata, canonical + `hreflang`, Open Graph, Twitter cards, JSON-LD, `sitemap.xml`, `robots.txt`.
- **Security** — hashed passwords (bcrypt), Auth.js sessions, input validation (Zod), rate limiting, honeypot, audit logging, security headers.
- **Resilient data layer** — every page falls back to curated demo content if the database is empty/unavailable, so the site builds and renders out of the box.

## 🧱 Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS, shadcn-style UI (Radix), Framer Motion |
| i18n | next-intl |
| Auth | Auth.js (NextAuth v5), JWT sessions, RBAC |
| Database | PostgreSQL + Prisma ORM |
| AI | Anthropic Claude API |
| Deploy | Docker (standalone) / Vercel |

## 🚀 Quick Start (local)

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env
#   → set DATABASE_URL and AUTH_SECRET (openssl rand -base64 32)

# 3. Database
npm run prisma:generate
npm run prisma:migrate      # create schema
npm run prisma:seed         # load demo content + admin user

# 4. Run
npm run dev                 # http://localhost:3000
```

Default admin (from seed / `.env`):

- **URL:** `http://localhost:3000/admin`
- **Email:** `admin@ishinol.co.id`
- **Password:** `Ishinol#2026`

> The site renders with built-in demo content even **without** a database — useful for a first build or static preview.

## 🐳 Run with Docker

```bash
cp .env.example .env        # set AUTH_SECRET at minimum
docker compose up --build
# web → http://localhost:3000 , postgres → localhost:5432
```

After the stack is up, seed the database:

```bash
docker compose exec web npx prisma db seed
```

## 📁 Project Structure

```
prisma/
  schema.prisma        # all data models (bilingual content)
  seed.ts              # demo content + admin user
messages/
  id.json, en.json     # UI translations
src/
  i18n/                # routing, navigation, request config
  middleware.ts        # locale routing + admin/api bypass
  auth.ts              # Auth.js (credentials + RBAC)
  lib/                 # prisma, queries (resilient), seo, rbac, utils, validations
  components/
    ui/                # shadcn-style primitives
    layout/            # header, footer, language switcher
    sections/          # hero, before/after, testimonials, ...
    cards/             # product / project / article / video cards
    floating/          # WhatsApp + live chat
    admin/             # admin shell, forms, AI assist
  app/
    [locale]/          # public, localized pages
    admin/             # CMS (not localized)
    api/               # auth, leads, chat, ai
    sitemap.ts, robots.ts
```

## 🔑 Environment Variables

See [`.env.example`](./.env.example). Key values: `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `ANTHROPIC_API_KEY` (optional, enables AI assistant).

## 📦 Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (runs `prisma generate`) |
| `npm start` | Start production server |
| `npm run prisma:migrate` | Create/apply dev migration |
| `npm run prisma:deploy` | Apply migrations (production) |
| `npm run prisma:seed` | Seed demo content |
| `npm run lint` / `npm run typecheck` | Quality checks |

## 📖 Deployment

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for Vercel and Docker/VPS deployment guides.

---

ISHINOL® is a registered trademark of KONSHO Co., Ltd., Japan. This website is operated by the official Indonesian distributor. Product information references the official ISHINOL Japan site ([konsho.co.jp](https://www.konsho.co.jp/en/)).
