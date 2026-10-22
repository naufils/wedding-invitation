# Evermint — User Flows

## 2.1 Couple Onboarding
Landing (live demo, envelope showcase) → "Create Your Invitation" CTA → Sign up (email/Google OAuth) → Wizard:
1. Names + wedding date (auto-suggest subdomain slug, editable)
2. Events (haldi/mehndi/sangeet/ceremony/reception — add/remove/rename)
3. Per-event: date, time, venue address (auto-geocode), dress code
4. Our Story (text + optional photos)
5. Theme (curated palette presets + custom override, font pairing presets, hero photo)
6. Music (own upload OR curated free-license library)
7. Gallery upload (initial photos)
8. Connect Google Drive (OAuth) — skippable, connect later
→ Live preview every step (split-screen/iframe) → Payment (Razorpay ₹1,500) → Publish → subdomain live → shareable link + WhatsApp share button → Dashboard: edit anytime, view RSVPs, view guest media, export guest list CSV

## 2.2 Guest Flow
WhatsApp link (rich preview: names + hero image) → tap → mobile browser → closed envelope (idle anim, monogram) → guest taps envelope → [haptic tick if supported] → seal breaks → flap opens → card unfolds → music fades in (only after gesture, never on load) → scroll-driven reveal: names → story → event timeline → venue/maps → countdown → RSVP (name, attending y/n/maybe, which events, guest count, dietary) → gallery view → "share your photos" upload widget (usable during/after wedding too) → contact/FAQ footer

## 2.3 Guest Upload Flow (Drive-synced)
Tap "add photos/videos" → multi-select picker (image+video) → chunked/resumable upload (tus — survives venue wifi drops) → lands in platform object storage FIRST (durable source of truth) → confirm shown immediately, never blocks on Drive sync → background job (BullMQ/Redis) pushes to couple's Drive folder → if token invalid/expired/quota-exceeded → file stays safe in storage, flagged in dashboard "pending sync — reconnect Drive" → dashboard shows live gallery + per-file sync status

## 2.4 Couple Dashboard Flow
Login → dashboard home → tabs: Overview | Edit Invitation | RSVPs | Guest Media | Settings
- Overview: view count, RSVP summary (y/n/maybe), days-to-wedding
- Edit Invitation: same wizard, live-editable, instant reflect on published site
- RSVPs: table, filter by event, CSV export
- Guest Media: grid of uploads, Drive sync status, manual retry, bulk download fallback
- Settings: subdomain, Drive connection, music, password-protect toggle
