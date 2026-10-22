# Envelope hero assets

Drop files here with these exact names. The component (`src/components/envelope/PhotoEnvelopeHero.tsx`)
loads them automatically and falls back to a CSS-drawn envelope if any file is missing — nothing breaks
if you add these one at a time.

| File | Purpose | Spec |
|---|---|---|
| `floral-bg.jpg` | Full-bleed background behind the envelope | 1080×1920 (9:16 vertical), JPEG/WebP, soft/bokeh edges so text stays legible over it |
| `envelope-body.png` | Closed envelope base | Transparent PNG, ~1000×700, top-down macro shot |
| `envelope-flap.png` | Top triangle flap, separate layer | Transparent PNG, same width as body, flap only (top ~45% of envelope height) — this layer animates open via `rotateX` |
| `wax-seal.png` | Seal medallion | Transparent PNG, ~400×400, circular, centered subject |
| `card-front.jpg` (optional) | Card background revealed after open, if you want a photo behind the names instead of flat cream | 1080×1920, JPEG |

Palette to match: warm ivory/cream base (`#faf6ee`), Royal Gold accent (`#b8860b`), deep burgundy seal wax — matches `docs/design.md`.
