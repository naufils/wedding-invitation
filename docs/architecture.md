# Evermint — Architecture

## 4.2 Multi-tenancy Model
Single Next.js app, subdomain-based tenant resolution. Middleware reads `Host` header, extracts subdomain, resolves to `wedding_id`, injects into request context. Content stored as structured JSON per wedding (not free-text HTML) — template renderer stays consistent, safe from malformed input.

## 4.3 Data Model
```
users            id, email, name, auth_provider, created_at
weddings         id, user_id (FK), subdomain_slug (unique), couple_names (jsonb), wedding_date,
                 theme_config (jsonb), status (draft|published), drive_folder_id,
                 drive_refresh_token (encrypted), payment_status, created_at, updated_at
events           id, wedding_id (FK), name, date, time, venue_name, venue_address, lat, lng,
                 dress_code, order_index
rsvps            id, wedding_id (FK), guest_name, phone_or_email, attending_status,
                 event_ids (array), guest_count, dietary_notes, submitted_at
media_uploads    id, wedding_id (FK), uploaded_by_guest_name, file_type, storage_key (R2),
                 drive_file_id (nullable), drive_sync_status (pending|synced|failed),
                 file_size, created_at
gallery_photos   id, wedding_id (FK), storage_key, caption, order_index, uploaded_by (couple|guest)
```

## 4.4 Guest Upload Pipeline
1. Client uploads direct to R2 via presigned URL, chunked/resumable (tus) — never proxy large files through Next.js server
2. On completion, API writes `media_uploads` row, status `pending`
3. BullMQ job attempts Drive push via stored refresh token
4. Success → `synced`. Failure (expired token/quota/revoked) → `failed`, surfaced in dashboard "Reconnect Drive"
5. R2 copy always retained — Drive is convenience sync, never sole copy

## 4.5 Google OAuth / Drive Verification
Start Google OAuth consent screen verification day one, parallel with build. Takes 2-6 weeks; unverified apps cap 100 test users + scary warning screen for guests. Scheduling dependency — blocking task, not launch-week afterthought.

## 4.6 Performance Budget
- Three.js bundle lazy-loaded only on invitation route, code-split from dashboard/marketing
- Device-tier detection on load (WebGL support + hardware heuristic) → routes full 3D or CSS/Framer fallback, same narrative beats either way
- Target LCP < 2.5s on 4G mid-range Android
- Images via Next.js Image + R2, WebP/AVIF with fallback

## 4.7 Secrets
`.env` locally, real secrets manager in prod (Vercel env vars / Doppler). Never commit Drive OAuth client secrets or Razorpay keys.
