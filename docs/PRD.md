# Evermint — Product Requirements

## 1.1 Vision
Redefine wedding invitation as cinematic digital experience — not templated e-card. One flagship template, obsessively crafted, vs volume-over-depth players (InvitingYou, SitesPlaced, DesiEvite). Premium feel, accessible one-time price (~₹1,500).

## 1.2 Target User
Indian couples, multi-event weddings (haldi/mehndi/sangeet/wedding/reception), tech-comfortable, share via WhatsApp, want personal-crafted feel not mass-template.

## 1.3 Core Differentiators
1. Envelope-unfold ritual — cinematic first-touch (WebGL/Three.js), not static load
2. One flagship template, not 200 mediocre — every pixel intentional
3. Guest photo/video → synced to couple's own Google Drive — no competitor has this
4. Most premium features unlocked default at ₹1,500 — no tiered paywall on core

## 1.4 Phase 1 Scope (MVP — pitch-ready, not rough draft)

**In scope:**
- Single premium template, customizable (colors, type, images, music, content)
- Envelope-unfold hero (WebGL primary, CSS/Framer fallback)
- Subdomain per couple (`riyaandaarav.[product].com`)
- Sections: couple details, Our Story, event timeline (multi-event), venue+maps, RSVP, gallery, guest upload, countdown, contact/FAQ, dress code
- Background music, gesture-gated autoplay
- Haptic feedback (Android, progressive enhancement)
- Guest upload → storage buffer → async Drive sync
- Couple-facing no-code editor/dashboard
- One-time Razorpay payment (₹1,500)
- Mobile-first, WhatsApp share optimization (OG tags)

**Out of scope Phase 1 (Phase 2+):**
Multiple templates, AI-generated copy, multilingual, custom domains, digital guest books/live gallery/livestream, QR check-in, gift registry, AI photo organize, analytics dashboard.

## 1.5 Success Criteria
- Signup → paid → published under 30min
- Envelope-open demos well enough to BE the sales pitch
- Guest: WhatsApp link → unfold → RSVP → upload photo, one mobile session, no app install
- Smooth on 3yr-old mid-range Android, not just flagship
