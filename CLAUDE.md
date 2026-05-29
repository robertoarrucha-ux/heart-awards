# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev          # Start local dev server on localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check (tsc --noEmit)
npm run genkit:dev   # Start Genkit AI dev UI
```

After changing `.env.local` or installing packages, restart the dev server.

## Deployment

- **Local → GitHub**: `git add . && git commit -m "..." && git push origin main`
- **GitHub → Production**: Firebase App Hosting auto-deploys on push to `main` (backend: `latam-awards`, project: `apex-vote`)
- **Secrets**: Stored in Google Secret Manager, defined in `apphosting.yaml`. Add new secrets with `firebase apphosting:secrets:set SECRET_NAME --project apex-vote`, then grant access with `firebase apphosting:secrets:grantaccess SECRET_NAME --backend latam-awards --project apex-vote`
- **Firestore indexes**: `firebase deploy --only firestore:indexes --project apex-vote`

## Architecture

Next.js 15 App Router app with Firebase backend and Stripe payments. All UI is dark theme, Spanish-language.

### Data Flow
- **Server Actions** (`src/app/actions.ts`) are the single entry point for all data operations from client components. They call store functions and handle auth/validation.
- **Stores** (`src/lib/*-store.ts`) handle Firestore CRUD — always use `adminDb` (Firebase Admin SDK) for server-side, never `db` (client SDK) in `'use server'` files.
- **Client components** call server actions via `import { someAction } from '@/app/actions'`.

### Firebase Setup
- `firebase-applet-config.json` — client-side Firebase config (hardcoded, not from env vars)
- `src/lib/firebase.ts` — client SDK (`db`, `auth`) for browser-side Firestore listeners (`onSnapshot`)
- `src/lib/firebase-admin.ts` — Admin SDK (`adminDb`, `adminAuth`) for all server-side operations. Reads `FIREBASE_SERVICE_ACCOUNT` env var (full JSON, single line).
- Vote anti-duplication: tracked by IP in `voted_ips` Firestore collection inside a transaction in `vote-store.ts`. The in-memory `Set` is a cache only — the Firestore transaction is the source of truth.

### Payments
- Two parallel Stripe flows coexist:
  1. **PaymentIntent flow** (`/api/create-payment-intent` + `CheckoutForm`) — used in `PaymentModal`, handles custom Firestore coupons and Stripe coupons, saves registration via webhook.
  2. **Checkout Session flow** (`/api/checkout`) — redirects to Stripe-hosted checkout page.
- `STRIPE_WEBHOOK_SECRET` must match the webhook endpoint configured in the Stripe dashboard for `/api/webhooks/stripe`.
- `allow_promotion_codes` and `discounts` are mutually exclusive in Stripe — never pass both.

### Admin Panel (`/admin`)
- Protected by `AdminGuard` component which checks Firebase Auth against a hardcoded `adminEmails` list.
- Uses `onSnapshot` directly for real-time updates in the admin UI (not server actions).
- Nomination workflow: `pending → approved/rejected/archived`. Approving a nomination creates a `Nominee` document and sends an approval email via Acumbamail SMTP.

### Key Types (`src/lib/data.ts`)
- `Nominee` — approved finalist shown on `/vota` and `/nominados/[id]`
- `NominationRequest` — raw form submission, lives in admin panel
- `edition` field distinguishes years (`'2025'`, `'2026'`) and venues (`'vienna'`, `'madrid'`)

### Internationalization
- `LanguageContext` (`src/context/LanguageContext.tsx`) provides ES/EN toggle
- Translations in `src/lib/translations/es.ts` and `en.ts`

### Firestore Collections
| Collection | Purpose |
|---|---|
| `nominees` | Approved finalists (public) |
| `nominationRequests` | Raw form submissions (admin only) |
| `votes` | Historical vote log |
| `voted_ips` | IP deduplication (doc ID = sanitized IP) |
| `registrations` | Paid ticket purchases (from Stripe webhook) |
| `free_registrations` | Free event registrations |
| `coupons` | Custom discount codes linked to partners |
| `partners` | Affiliate partner profiles |

### Environment Variables
Required in `.env.local` for local dev:
- `FIREBASE_SERVICE_ACCOUNT` — full service account JSON as single line
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- `ACUMBAMAIL_SMTP_HOST/PORT/USER/PASS`, `ACUMBAMAIL_FROM_EMAIL`

Sync from production: `vercel env pull --environment=production .env.local` (then fix any empty values manually from Vercel dashboard).
