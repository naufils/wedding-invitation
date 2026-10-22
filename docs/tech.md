# Evermint — Tech Stack

## 4.1 Stack
- Framework: Next.js 14+ (App Router), TypeScript
- 3D/Envelope: Three.js + React Three Fiber + @react-three/drei
- 2D motion: Framer Motion (Motion) + GSAP (ScrollTrigger — all plugins free now)
- Lightweight decorative motion: Lottie via lottie-react
- Audio: Howler.js
- Database: PostgreSQL (Supabase/Neon/Railway)
- Cache/Queue: Redis + BullMQ (Drive sync jobs, thumbnail gen)
- Object storage: Cloudflare R2 (S3-compatible, zero egress — matters for media-heavy uploads)
- Payments: Razorpay (India-native, UPI)
- Auth: NextAuth.js/Auth.js (email + Google OAuth)
- Google Drive: Drive API v3, OAuth 2.0, refresh token encrypted at rest in Postgres
- Hosting: Vercel (Next.js-native) — reassess vs self-hosted VPS once media bandwidth cost measurable
- DNS/subdomains: wildcard DNS (`*.yourdomain.com`), resolved via Next.js middleware

## 5. Build Phases

**Phase 0 — Foundation (Wk1)**
Next.js+TS scaffold, Postgres schema/migrations, R2 bucket, wildcard DNS+middleware subdomain resolution, basic auth. Start Google OAuth verification parallel.

**Phase 1 — Core Invitation Renderer (Wk2-3)**
Content JSON → rendered page pipeline. All sections (story, timeline, venue/maps, countdown, RSVP, gallery) in Framer Motion/GSAP — doubles as WebGL fallback, build first. Subdomain routing working w/ dummy data.

**Phase 2 — Envelope Hero (Wk3-4)**
Blender-modeled envelope+seal (glTF export). R3F scene: idle → tap-to-open → unfold. Device-tier detection routes to Phase 1 fallback when needed. Haptics via Vibration API. Audio fade-in via Howler, gated on unfold gesture.

**Phase 3 — Couple Editor + Payment (Wk4-5)**
Onboarding wizard, live preview, Razorpay ₹1,500 one-time flow, publish (draft→live).

**Phase 4 — Guest Uploads + Drive Sync (Wk5-6)**
R2 presigned upload + tus client, BullMQ Drive sync queue, couple-side Drive OAuth connect, dashboard sync status/retry/media grid.

**Phase 5 — Dashboard Polish + RSVP Mgmt (Wk6)**
RSVP table+CSV export, overview stats, settings (subdomain, music, password protect).

**Phase 6 — Pre-launch Hardening**
Real mid-range Android device test (not just DevTools throttle), WhatsApp OG-tag preview test, concurrent-upload load test (wedding-day traffic sim), confirm OAuth verification complete.

## Open Decisions
- [ ] Product name + domain — placeholder till decided
- [ ] Hosting: Vercel vs self-hosted (revisit once bandwidth cost measurable) — **assumed Vercel for now**
- [ ] Password-protection: Phase 1 or 1.5 — **assumed Phase 1.5**
- [ ] Music library source: Pixabay vs YouTube Audio Library — **assumed Pixabay, confirm license terms per track before ship**
