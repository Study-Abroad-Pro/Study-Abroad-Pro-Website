# Study Abroad Pro — website

Next.js 15 (App Router) · React Three Fiber · GSAP ScrollTrigger · Supabase (free plan) · Tailwind v4

The homepage is complete: hero, the three-turn globe sequence, and nine
content sections through to a working lead form. Country and course page
templates, the blog and the eligibility page follow in the next phases.

---

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. **No `.env` file is needed to run locally** —
without Supabase keys the lead route logs submissions to the terminal instead
of inserting them, so the whole homepage including the form is exercisable out
of the box. See **RUN-LOCALLY.md** for the full walkthrough and the common
first-run problems.

The globe sequence needs a desktop-sized window (≥1024px) with a mouse — on
touch or narrow screens it deliberately falls back to a static globe and a
card grid.

### Supabase

1. Create a free project.
2. Paste `supabase/schema.sql` into the SQL Editor and run it. It creates the
   tables, the row-level-security policies and seeds the six destinations.
3. Copy the project URL and both keys into `.env.local`.

The site never queries Supabase from the browser. Content pages are statically
generated and revalidated on a timer, so page views cost no database requests;
the only write path is `POST /api/leads`.

---

## The scroll sequence

All of it lives in `components/three/GlobeStage.tsx`. One fixed WebGL canvas is
shared by both sections, so the globe is never unmounted and there is no
context teardown at the handoff.

| Phase | Scroll | What happens |
|---|---|---|
| A | `#hero` pinned for `+=200%` | The globe spins three full turns. Snap points at 0, ⅓, ⅔ and 1 give the three scroll beats. Headline, flags and stat bar fade out over the first half, and the destinations heading fades up on the third turn so the screen is never empty. |
| B | `#destinations` `top bottom` → `top top` | The globe scales up, travels to centre and lands on Canada's longitude. |
| C | `#destinations` pinned for `+=600%` | One viewport-height per destination. The globe rotates to each country's longitude while its name card rises above it. |

GSAP tweens a plain object (`components/three/globeState.ts`); `useFrame` reads
it and writes to the Three.js objects. No React state is touched during the
scroll, which is why it holds frame rate.

### Tuning it

| Want | Where |
|---|---|
| Fewer/more turns in the hero | `HERO_TURNS` in `globeState.ts` |
| A shorter hero hold | `end: "+=200%"` on the Phase A ScrollTrigger |
| Globe size or position | `HERO_ANCHOR` / `STAGE_ANCHOR` in `globeState.ts` |
| Rotation order of countries | reorder `DESTINATIONS` in `content/site.ts` — targets are derived from `lon`, not hard-coded |
| Globe colour ramp, sun angle, relief depth, graticule | the `uC0`–`uC3`, `uSun`, `uRelief` uniforms and `fragmentShader` in `components/three/Globe.tsx` |

### Checking it without installing

`design-preview/hero-animation-preview.html` is the whole sequence rebuilt in a
single file with raw WebGL and no dependencies — double-click it. Append
`?s=4.5` to jump straight to a frame (0 = hero at rest, 2–3 = handoff,
3–9 = the six destinations). It shares the globe shader and every anchor value
with the React build, so it is a faithful reference, not a mockup.

### Accessibility and fallbacks

* `prefers-reduced-motion: reduce` — no pinning, no spin, static globe, cards
  render as a normal grid.
* Touch or `< 1024px` — no pinning; the globe idles slowly in the hero and
  fades out when the hero leaves.
* The render loop parks (`frameloop="never"`) once the sequence is off screen.

---

## Assets

Everything in `public/` is generated in-repo or derived from your own source
files:

* `textures/earth-bump.webp` (186 KB, 4096×2048) — elevation. Drives the
  relief shading; there is no colour map, so this is what draws the continents.
* `textures/earth-mask.webp` (112 KB, 2048×1024) — land/ocean mask. Separates
  the two tones and keeps the graticule engraved on water only.

Both are reduced from the source set in `Assests/59-earth/textures/` by
`scripts/build-earth-textures.py`. Sizes are power-of-two because the
standalone preview runs on WebGL1, which needs that for mipmaps and wrapping.
**Confirm the licence on that Blender asset before launch** — it is the one
thing in `public/` not generated in-repo.

* `hero/student.webp` — the traveller, matted out of the approved hero artwork
  by `scripts/cut-hero-traveller.py`. The crop stops at the contact line, so no
  photographed floor comes with him; the shadow under the shoes and wheels is
  generated from his own footprint, which is why it sits correctly on a CSS
  background instead of being a grey patch. The alpha feather width follows the
  source's local edge gradient — the artwork fades over ~28px at the shoulder
  but turns in 3px at the suitcase, and one fixed feather cannot serve both.
* `brand/logo-orange.webp`, `brand/logo-cream.webp` — transparent logo variants.
* `og-home.webp` — the original hero composition, used as the social card.

Editorial images (blog covers, student photos) belong in Supabase Storage, not
here. Upload pre-sized `-480` / `-960` / `-1600` variants with
`{ cacheControl: '31536000' }` and reference them through `next/image`.

---

## Environment

| Variable | Used by |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | read client, image host allowlist |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | read client (RLS-protected) |
| `SUPABASE_SERVICE_ROLE_KEY` | `/api/leads` only — never sent to the browser |
| `REVALIDATE_SECRET` | shared secret for the Supabase revalidation webhook |
| `NEXT_PUBLIC_SITE_URL` | canonical URLs, OG images, JSON-LD |

## Routes so far

### Homepage sections

In order: hero, globe sequence (six destinations), why-us, popular courses,
services, how it works, student stories, about, FAQ, free counselling, closing
CTA. Section copy and data live in `content/site.ts` — not in Supabase, because
it changes about once a year.

Two things in there are deliberately unfinished and marked as such:

* **`SITE.phone` / `whatsapp` / `email` / `address`** are obvious placeholders.
  Every contact point on the site reads from that one object.
* **`TESTIMONIALS_ARE_SAMPLES`** is `true`, so each story card renders a
  visible "Sample" marker and the section says plainly that the quotes are not
  real students. Replace `TESTIMONIALS` with consented quotes and set the flag
  to `false`; the markers disappear with no other change. The brief is explicit
  that student names, universities and outcomes must not be invented.

| Route | Purpose |
|---|---|
| `/` | Homepage — the full page |
| `/api/leads` | The only write path. zod validation, honeypot, rate limit. |
| `/api/revalidate` | Supabase Database Webhook target |
| `/api/health` | Cron keep-alive, so the free project never pauses |
