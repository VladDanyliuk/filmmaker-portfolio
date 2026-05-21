# Filmmaker Portfolio

A production-ready cinematic portfolio website built with Next.js 15, Sanity CMS, Tailwind CSS, and Framer Motion.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| CMS | Sanity v3 |
| Animations | Framer Motion |
| Deployment | Vercel |

---

## Project Structure

```
filmmaker-portfolio/
├── app/
│   ├── (site)/               # Main website routes
│   │   ├── page.tsx          # Home
│   │   ├── about/page.tsx
│   │   ├── services/page.tsx
│   │   ├── work/page.tsx
│   │   └── contact/page.tsx
│   ├── studio/               # Sanity Studio (embedded)
│   ├── layout.tsx
│   ├── globals.css
│   └── not-found.tsx
├── components/
│   ├── layout/               # Navbar, Footer
│   ├── sections/             # HeroSection, CTASection
│   ├── ui/                   # ServiceCard, GalleryGrid, VideoEmbed, ContactForm, TextBlock
│   └── motion/               # RevealOnScroll, PageTransition
├── sanity/
│   ├── schemaTypes/          # Sanity document schemas
│   └── lib/                  # client.ts, queries.ts, image.ts
├── lib/
│   └── types.ts              # Shared TypeScript types
└── public/
    ├── fonts/                # Clash Display + Neue Montreal woff2 files
    └── video/                # hero.mp4 (add your own)
```

---

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in your Sanity project credentials:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_token   # only needed for mutations
```

**To get your Project ID:**
1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Create a new project (or use existing)
3. Copy the Project ID from the dashboard

### 3. Add fonts

Download and place in `public/fonts/`:
- `ClashDisplay-Variable.woff2` — from [Fontshare](https://www.fontshare.com/fonts/clash-display)
- `NeueMontreal-Regular.woff2`
- `NeueMontreal-Medium.woff2` — from [Pangram Pangram](https://pangrampangram.com/products/neue-montreal)

### 4. Add hero video (optional)

Place your hero video at `public/video/hero.mp4`. On mobile, a fallback image from Sanity is used instead.

### 5. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the website.

---

## Sanity Studio

The Sanity Studio is embedded at `/studio`. Access it at:

```
http://localhost:3000/studio
```

### Content to populate in Studio

1. **Site Settings** (singleton) — hero headline, subtitle, CTA buttons, hero video path, fallback image, contact email, social URLs

2. **Pages** — create pages with slugs:
   - `about`
   - `services`
   - `contact`
   - `work`

3. **Services** — add services with title, description, and order number

4. **Projects** — add projects with title, category, cover image, optional YouTube URL, year, client. Check "Featured" to show on home page.

---

## Form Submission

The contact form (`components/ui/ContactForm.tsx`) uses a mock submission by default. To wire up a real service:

**Option A — Formspree:**
```bash
npm install @formspree/react
```
Replace the `handleSubmit` function with Formspree's `useForm` hook.

**Option B — Resend:**
Create `app/api/contact/route.ts` and call Resend from it.

---

## Deployment (Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/filmmaker-portfolio.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Add environment variables (same as `.env.local`)
4. Deploy

### 3. Configure Sanity CORS

In [sanity.io/manage](https://sanity.io/manage) → your project → API → CORS Origins:
- Add your Vercel URL: `https://your-site.vercel.app`
- Add `http://localhost:3000` for local dev

---

## Customisation

| What | Where |
|------|-------|
| Colors | `tailwind.config.ts` + `app/globals.css` CSS vars |
| Fonts | `app/globals.css` @font-face + `tailwind.config.ts` fontFamily |
| Nav links | `components/layout/Navbar.tsx` `navLinks` array |
| Footer | `components/layout/Footer.tsx` |
| Hero animations | `components/sections/HeroSection.tsx` |
| CMS schemas | `sanity/schemaTypes/` |
| GROQ queries | `sanity/lib/queries.ts` |

---

## Notes

- All page text is CMS-driven via Sanity. No hardcoded copy except structural labels.
- Hero video is replaced with a static image on mobile (performance + autoplay restrictions).
- Gallery has client-side category filtering and a YouTube lightbox.
- `revalidate = 60` on all pages — content updates appear within 60 seconds.
