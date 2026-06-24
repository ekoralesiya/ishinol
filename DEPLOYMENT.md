# Deployment Guide — ISHINOL Indonesia

This guide covers deploying the ISHINOL Indonesia website to **Vercel** and to a **Docker / VPS** environment.

---

## 1. Prerequisites

- A PostgreSQL 14+ database (Neon, Supabase, RDS, or self-hosted).
- `AUTH_SECRET` — generate with `openssl rand -base64 32`.
- (Optional) `ANTHROPIC_API_KEY` to enable the AI content assistant.

Required environment variables (see `.env.example`):

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `AUTH_SECRET` | ✅ | Auth.js JWT signing secret |
| `AUTH_TRUST_HOST` | ✅ | Set to `true` |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Public URL (SEO, canonical, OG) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | ✅ | Sales WhatsApp (digits only) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | — | Initial super-admin |
| `ANTHROPIC_API_KEY` / `AI_MODEL` | — | AI assistant |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | — | Google Analytics 4 |

---

## 2. Deploy to Vercel

1. **Import** the repository into Vercel.
2. **Environment Variables** — add all required variables from the table above for the *Production* (and *Preview*) environments.
3. **Build Command** — leave default (`npm run build`; it runs `prisma generate`).
4. **Database migrations** — run once against your production DB:
   ```bash
   DATABASE_URL="<prod-url>" npx prisma migrate deploy
   DATABASE_URL="<prod-url>" npx prisma db seed   # optional: demo content + admin
   ```
   Tip: add `prisma migrate deploy` to a Vercel *Deploy Hook* or run it from CI before promoting.
5. **Deploy.** Vercel handles SSR, image optimization, and CDN automatically.

> Use a pooled connection string (e.g. Neon/Supabase pooler) for serverless runtimes.

---

## 3. Deploy with Docker (VPS / self-hosted)

The repo ships a multi-stage `Dockerfile` (Next.js standalone output) and a `docker-compose.yml` with PostgreSQL.

```bash
# On the server
git clone <repo> && cd ishinol
cp .env.example .env
#   → set AUTH_SECRET, NEXT_PUBLIC_SITE_URL, NEXTAUTH_URL (your domain)

docker compose up --build -d

# First-time DB setup
docker compose exec web npx prisma migrate deploy
docker compose exec web npx prisma db seed
```

The app listens on port **3000**. Put it behind Nginx/Caddy for TLS:

```nginx
server {
  server_name ishinol.co.id;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

### Build the image standalone

```bash
docker build -t ishinol-web .
docker run -p 3000:3000 --env-file .env ishinol-web
```

---

## 4. Post-deploy checklist

- [ ] Run `prisma migrate deploy` and `prisma db seed`.
- [ ] Sign in at `/admin` and **change the seeded admin password** (Users module).
- [ ] Update **Site Settings** (logo, contact, social links, GA ID).
- [ ] Verify `https://<domain>/sitemap.xml` and `/robots.txt`.
- [ ] Submit the sitemap to Google Search Console.
- [ ] Confirm the WhatsApp button opens the correct number.
- [ ] Run Lighthouse — target > 90 across Performance/SEO/Best Practices/Accessibility.

---

## 5. Database migrations workflow

```bash
# During development, after editing prisma/schema.prisma:
npm run prisma:migrate -- --name <change>

# In production:
npm run prisma:deploy
```

## 6. Backups

Schedule regular PostgreSQL backups (e.g. `pg_dump`) and store uploaded media (in `public/uploads`) on durable storage or migrate to an object store (S3/R2) for scale.
