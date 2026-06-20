# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev          # Start local dev server on localhost:3000
npm run build        # Production build (runs ESLint + TypeScript checks — both must pass)
npm run lint         # ESLint only
npm run typecheck    # TypeScript check (tsc --noEmit)
```

After changing `.env.local` or installing packages, restart the dev server.

## Deployment

- **Local → Production**: `git add . && git commit -m "..." && git push origin main`
- Firebase App Hosting auto-deploys on push to `main` (backend: `latam-awards`, project: `apex-vote`)
- **Secrets**: Stored in Google Secret Manager, defined in `apphosting.yaml`. Add new secrets with:
  ```bash
  firebase apphosting:secrets:set SECRET_NAME --project apex-vote
  firebase apphosting:secrets:grantaccess SECRET_NAME --backend latam-awards --project apex-vote
  ```
- **Firestore rules**: `firebase deploy --only firestore:rules --project apex-vote`
- **Firestore indexes**: `firebase deploy --only firestore:indexes --project apex-vote`
- `apphosting.yaml` has `maxInstances: 1` — single Cloud Run instance, cold starts are possible

## Architecture

Next.js 15 App Router app. Dark theme, Spanish-language. No test suite.

### Data Flow

- **Server Actions** (`src/app/actions.ts`) are the single entry point for all mutations from client components. They use `adminDb` (Firebase Admin SDK) exclusively.
- **Stores** (`src/lib/*-store.ts`) handle Firestore CRUD via `adminDb`. Never import from stores in client components — always go through `actions.ts`.
- **Real-time listeners**: Admin pages and the `/aliado/dashboard` use `onSnapshot` directly from `src/lib/firebase.ts` (client SDK). This is intentional — server actions don't support streaming.
- **`'use server'`** files must never import `db` (client SDK). **`'use client'`** files must never import `adminDb`.

### Firebase Setup

- `firebase-applet-config.json` — client-side Firebase config (hardcoded, not from env vars)
- `src/lib/firebase.ts` — client SDK (`db`, `auth`) for browser
- `src/lib/firebase-admin.ts` — Admin SDK (`adminDb`, `adminAuth`). Reads `FIREBASE_SERVICE_ACCOUNT` env var (full JSON, single line)

### Stripe Payment Flows

Two separate flows coexist — do not mix them:

1. **PaymentIntent flow** (`/api/create-payment-intent` → `PaymentModal` → `CheckoutForm`): Used for ticket purchases from `/tickets`. Two-step modal: Step 1 collects buyer info (name, country, whatsapp, participationStatus); Step 2 shows Stripe Elements. Buyer info is passed as `metadata` on the PaymentIntent. The webhook (`/api/webhooks/stripe`) saves a `registrations` document on `payment_intent.succeeded`.

2. **Checkout Session flow** (`/api/checkout`): Redirects to Stripe-hosted checkout page. Legacy flow, less used.

**Webhook body handling**: The route uses `Buffer.from(await req.arrayBuffer())` — **never change this to `req.text()` or `req.json()`**. Stripe's HMAC-SHA256 verification requires the exact raw bytes. UTF-8 decoding via `req.text()` subtly alters the payload and breaks signature verification with "no signatures found matching."

**Coupon resolution order** (in `/api/create-payment-intent`):
1. Firestore `coupons` collection (custom, partner-linked, max 30% discount hard-coded)
2. Stripe promotion codes
3. Stripe coupons directly
If a Firestore coupon matches, Stripe-side discounts are skipped entirely.

### Partner / Affiliate System

- Partners apply at `/aliado/dashboard` (Google login required). Status lifecycle: `pending → active | rejected`, `active ↔ suspended`.
- Approval/rejection triggers email via `sendPartnerApprovalEmail` / `sendPartnerRejectionEmail` in `src/lib/email.ts`. Uses `updatePartnerStatusAction` server action (writes to both `partners/{id}` and `users/{id}`).
- `AffiliateTracker` component (`src/components/affiliate-tracker.tsx`): reads `?ref=` and `?coupon=` from the URL on any page load and persists them to `localStorage` (`affiliate_ref`, `applied_coupon`). `PaymentModal` reads these values to pre-fill the coupon and pass `partnerId` to the payment intent.
- Partner referral links: `https://awards.pro-latam.org/tickets?ref=REFERRALCODE&coupon=COUPONCODE`
- Partner click counts are incremented via `trackReferralAction` in `actions.ts`, deduplicated per session via `sessionStorage`.

### Admin Panel (`/admin`)

Protected by `AdminGuard` component — checks Firebase Auth against hardcoded list: `['arrucha@theglobal.school', 'roberto@pro-latam.org']`.

| Page | Path | Data source |
|---|---|---|
| Nominations | `/admin/requests` | `nominationRequests` collection |
| Attendees | `/admin/attendees` | `free_registrations` + `registrations` (two tabs) |
| Partners | `/admin/partners` | `partners` collection |
| Payments | `/admin/payments` | Stripe API via `admin/payments/stripe-actions.ts` |

### Key Types (`src/lib/data.ts`)

- `Nominee` — approved finalist on `/vota` and `/nominados/[id]`
- `NominationRequest` — raw form submission (`profilePhotoUrl` stored as data URI)
- `categories` is `as const` (readonly tuple). Always type props as `readonly string[]`, never `string[]`
- `edition` values: `'2025'` for past editions; `'2026'` for current (Vienna + Madrid venues)
- Categories are split by venue: `viennaCategories2026` (social focus) and `madridCategories2026` (business focus)

### Vote Anti-Duplication

`vote-store.ts` uses two layers: an in-memory `Set<string>` (fast cache, resets on cold start) and Firestore `voted_ips` collection (persistent). The Firestore transaction is the source of truth. IPs are sanitized via `sanitizeId()` before use as document IDs.

### Email (`src/lib/email.ts`)

Nodemailer with Acumbamail SMTP. Single lazy-initialized transporter. All email functions follow the same pattern: build HTML string → `transporter.sendMail()`. SMTP config reads from `ACUMBAMAIL_SMTP_*` env vars (with `EMAIL_*` fallbacks).

### Firebase Storage Assets (`src/lib/assets.ts`)

Three helpers for different storage paths:
- `getAssetUrl(filename)` — root of `apex-vote.firebasestorage.app` bucket (most images)
- `getLogoUrl(filename)` — under `public/Logos/` path
- `getSliderImageUrl(filename)` — under `public/Photo Slider/` path

A small `LOCAL_ASSETS` allowlist serves SVGs from `/public` instead of Storage.

### Internationalization

`LanguageContext` (`src/context/LanguageContext.tsx`) provides ES/EN toggle. Translations in `src/lib/translations/es.ts` and `en.ts`. Most UI is Spanish-only; EN translations exist for some public-facing sections.

### Firestore Collections

| Collection | Purpose |
|---|---|
| `nominees` | Approved finalists (public read) |
| `nominationRequests` | Raw form submissions (admin only) |
| `votes` | Historical vote log |
| `voted_ips` | IP deduplication (doc ID = sanitized IP) |
| `registrations` | Paid ticket purchases — written by Stripe webhook only |
| `free_registrations` | Free event registrations |
| `coupons` | Discount codes linked to partners (max 30% for non-admins) |
| `partners` | Affiliate partner profiles |
| `users` | Mirrors partner role on approval (`{ role: 'partner' }`) |

### Environment Variables

Required in `.env.local` for local dev (all are in Google Secret Manager for production):
- `FIREBASE_SERVICE_ACCOUNT` — full service account JSON as single line
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- `ACUMBAMAIL_SMTP_HOST`, `ACUMBAMAIL_SMTP_PORT`, `ACUMBAMAIL_SMTP_USER`, `ACUMBAMAIL_SMTP_PASS`, `ACUMBAMAIL_FROM_EMAIL`
