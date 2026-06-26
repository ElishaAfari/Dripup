# Atelier by Dripup

Atelier is a mobile-first fashion lifestyle super-app scaffold: TikTok/Facebook-style social discovery, marketplace commerce, AI studio workflows, realtime chat/live, smart-sized auctions, guild orders, phygital passports, and collaborative moodboards.

## Stack

- React 18, Vite, TypeScript
- Tailwind CSS design system in `tailwind.config.ts`, tuned to the official blue, green, white, and black brand palette
- Framer Motion for page transitions, list entrances, gestures, counters, modals, and cards
- React Router, TanStack Query, Zustand
- Supabase Postgres/Auth/Realtime/Storage/Edge Functions
- pgvector for embeddings and similarity matching
- Paystack, MTN Mobile Money, and Stripe Connect payment scaffolding

## Run Locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and set the `VITE_` variables when connecting to Supabase. Without Supabase env values, the UI runs against local seeded demo data and Edge Function calls return mock responses.

## Supabase

The migration at `supabase/migrations/202606240001_atelier_foundation.sql` creates all requested core tables with timestamps, soft-delete columns, indexes, triggers, and RLS enabled. It also enables `pgvector`, creates media buckets, and adds `match_vendors_by_embedding()`.

Apply locally:

```bash
supabase start
supabase db reset
```

Generate project-specific types after your local database is running:

```bash
npm run supabase:types
```

`src/types/database.ts` is a checked-in generated-style baseline so the client is typed before a Supabase project exists.

## Edge Functions

All secret-bearing work lives in `supabase/functions/*`, guarded by JWT validation, role checks, and rate limiting.

| Function | Purpose | Key env vars |
| --- | --- | --- |
| `generate-design` | Text-to-image Dream-to-Draft sketches, writes `designs` | `IMAGE_PROVIDER`, `IMAGE_API_KEY`, `IMAGE_MODEL` |
| `remix-garment` | Image-to-image upcycling proposals, writes `remixes` | `IMAGE_TO_IMAGE_PROVIDER`, `IMAGE_API_KEY`, `REPLICATE_IMAGE_TO_IMAGE_VERSION` |
| `estimate-cost` | Yardage, trims, labour, total quote | `LLM_API_KEY` optional refinement |
| `estimate-measurements-cleanup` | Cleans raw pose keypoints into saved measurement fields | none required |
| `place-bid` | Server-side smart-size validation before accepting bids | `SUPABASE_SERVICE_ROLE_KEY` |
| `escrow-capture` | Payment capture and escrow ledger entry | `PAYSTACK_SECRET_KEY`, `MTN_MOMO_API_KEY`, `STRIPE_SECRET_KEY` |
| `escrow-release` | Dual-approval milestone release ledger entry | payment provider keys |
| `payment-webhook` | Paystack/MoMo/Stripe webhook reconciliation | provider webhook secrets |
| `embed-content` | Creates pgvector rows | `EMBEDDINGS_API_KEY`, `EMBEDDINGS_MODEL` |
| `match-vendors` | Calls vector matching RPC | none beyond Supabase keys |
| `rtc-token` | Issues hosted SFU/WebRTC room tokens | `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `DAILY_API_KEY`, `MEDIASOUP_SIGNALING_SECRET` |

Deploy example:

```bash
supabase functions deploy generate-design
supabase secrets set IMAGE_PROVIDER=openai IMAGE_API_KEY=...
```

## Feature Map

- Auth-first entry: `/`, `/auth`, `/login`, `/signup`, `/phone-login`, `/forgot-password`
- Protected platform shell: `/app`
- Social core: `/app`, `/app/reels`, `/app/search`, `/app/profile/:id`
- Messaging and live: `/app/messages`, `/app/live`
- AI studio: `/app/studio` with Dream-to-Draft, measurement capture, estimator, remix
- Commerce: `/app/commerce`, `/app/auctions`, `/app/guild-orders`
- Phygital and wardrobe: `/app/passport/:passportId`, `/app/wardrobe`
- Moodboards: `/app/moodboards`

The platform shell is guarded by Supabase Auth when configured. In local mock mode, the auth page creates a session-scoped preview login so the app remains runnable without exposing provider keys in the browser.

## Escrow Note

Real escrow can be regulated financial activity. Production operation must be handled through a licensed payment or escrow partner. This repo models the ledger, milestone state machine, proof uploads, dual approvals, provider capture, and payout calls so the app can integrate with a compliant partner rather than holding funds itself.

## Architecture Notes

- The browser only receives `VITE_SUPABASE_ANON_KEY`; provider and payment secrets stay in Edge Functions.
- UI data currently ships with rich seed fixtures so every route is demonstrable out of the box.
- Supabase Realtime is the intended transport for chat, presence, live viewer counts, bid ticker updates, and moodboard matches.
- WebRTC provider selection is abstracted by `VITE_RTC_PROVIDER`; mock mode runs locally, hosted SFU token minting should live in an Edge Function.
- Media buckets separate public assets from private generated designs, remixes, and proof uploads.
