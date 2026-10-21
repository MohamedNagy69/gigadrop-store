# GIGADROP — PC Games Marketplace (Cairo, Egypt) 🎮⚡

A complete, production-ready e-commerce platform for selling PC game data loaded onto physical hard drives and delivered across Cairo (priced at **1.00 EGP per GB**).

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling & UI**: Tailwind CSS + Material UI (MUI v5)
- **3D & Animations**: Three.js (WebGL Hero Sphere + 3D Parallax Calculator + Mobile Fallback) + GSAP
- **Database**: MySQL 8.4 + Prisma ORM
- **Auth**: NextAuth.js (Credentials + Google/Facebook OAuth)
- **State**: Zustand (Persisted Cart, Wishlist, Theme Dark/Light, Locale EN/AR)

## Demo Credentials
- **Super Admin Console (`/admin`)**: `admin@gigadrop.eg` / `Admin@123`
- **Customer Dashboard (`/dashboard`)**: `ahmed@gigadrop.eg` / `Customer@123`
- **Sample Tracking Orders (`/track`)**: `GD-2026-00001` or `GD-2026-00002` with phone `+20 101 234 5678`
- **Sample Promo Codes**: `CAIRO25` (25 EGP off), `GIGA10` (10% off), `DROP50` (50 EGP off)
- **Sample Referral Code**: `GIGA-AHMED24` (15% off)

## Quick Start
```bash
npm install --legacy-peer-deps
npx prisma db push
npm run db:seed
npm run dev
```
Open `http://localhost:3000`.
