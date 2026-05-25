# StoreGenie — Claude Code Context

## What this project is
Next.js 15 app that lets shop owners build a full storefront visually — like Figma + Lovable. The main feature is a drag-and-drop visual page builder at `/builder`.

## Tech stack
- **Framework:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Drag-and-drop:** @dnd-kit/core + @dnd-kit/sortable
- **Auth + DB:** Supabase (auth.users, shops, products tables)
- **AI:** Gemini API (`GEMINI_API_KEY`) via `app/api/ai/route.ts`
- **Backend:** Express.js in `/backend/src/` (separate server, mostly unused now)

## Key files
| File | What it does |
|------|-------------|
| `app/builder/page.tsx` | The entire visual builder UI (~1300 lines) |
| `components/builder/Blocks.tsx` | All section components + ThemeContext + InlineEditContext |
| `app/api/ai/route.ts` | Gemini API: section edit mode + full-page rewrite mode |
| `supabase/migrations/001_initial_schema.sql` | shops + products tables with RLS |
| `app/store/[id]/page.tsx` | Public storefront renderer |

## Builder architecture
- **Left panel:** 3 tabs — Sections library (drag to canvas), Pages, Brand (color/font/radius)
- **Canvas:** Infinite zoom/pan canvas. Gray background, white page card (`data-page-card`). Drag gray background to pan, scroll wheel to pan, Ctrl+scroll to zoom.
- **Right panel:** 2 tabs — Properties (section fields + bg color), AI Chat (full-page rewrite via Gemini)
- **Floating toolbar:** Appears on section hover — type badge, ↑↓, drag handle, duplicate, ✦ AI, delete
- **Inline editing:** Double-click any text on canvas to edit it directly (`EditableText` component in Blocks.tsx)

## Data model
```ts
Page    = { id, name, sections: Section[] }
Section = { id, type: SectionType, props: Record<string, string>, style?: { bg?: string } }
GlobalTheme = { primaryColor, font, radius }
```

## Section types
navbar, hero, products, features, testimonials, about, contact, footer, banner, gallery, faq, pricing, newsletter

## Canvas pan/zoom
- State: `zoom`, `panX`, `panY` + stable refs mirrored via sync effects
- Wheel: non-passive `addEventListener` on `canvasRef` (can't use React onWheel — it's passive)
- Pan: drag gray background (not inside `[data-page-card]`), Space+drag, middle-mouse-drag
- Zoom controls: bottom-right floating bar — −, %, +, fit-to-screen

## AI integration
- **Section mode:** `POST /api/ai` with `{ prompt, sectionType, props }` → returns `{ props }`
- **Page mode:** `POST /api/ai` with `{ prompt, pages, mode: "page" }` → returns `{ pages, summary }`
- Both use `gemini-flash-latest` model

## 6 built-in templates
Minimal Boutique, Luxury Skincare, Streetwear Drop, Organic Market, Tech Gadgets, Jewelry Studio

## What was already built (don't redo these)

### Builder UI — `app/builder/page.tsx`
- Full Figma-like layout: left panel + infinite canvas + right panel
- **Left panel** — 3 tabs: Sections library (13 block types), Pages manager, Brand settings
- **Brand tab** — primary color picker, font selector (5 fonts), border radius presets, live preview
- **Infinite canvas** — zoom/pan with dot-grid background, page card with shadow, page tabs on canvas
- **Canvas pan** — drag gray background, Space+drag, middle-mouse-drag, scroll wheel to pan
- **Canvas zoom** — Ctrl+scroll zoom-to-cursor, floating zoom bar (−/+/fit/%), Ctrl+0 reset
- **Section hover toolbar** — type badge, ↑↓ move, drag handle, duplicate, ✦ AI, delete button
- **Inline editing** — double-click any text on canvas to edit it directly (no panel needed)
- **Right panel** — Properties tab (schema fields + section bg color + duplicate/delete) + AI Chat tab
- **AI Chat** — full-page rewrite via Gemini; describe a theme and it rewrites all section text
- **Undo/redo** — 20-step history, Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z
- **Keyboard shortcuts** — Ctrl+D duplicate, Delete/Backspace delete section
- **6 templates** — Minimal Boutique, Luxury Skincare, Streetwear Drop, Organic Market, Tech Gadgets, Jewelry Studio
- **Templates modal** — grid with mini wireframe previews, applies fresh IDs on use
- **DnD** — drag sections from library to canvas, drag to reorder sections

### Section components — `components/builder/Blocks.tsx`
- 13 section types: navbar, hero, products, features, testimonials, about, contact, footer, banner, gallery, faq, pricing, newsletter
- `ThemeContext` — cascades primaryColor, font, radius to all section buttons
- `InlineEditContext` — enables double-click text editing in all sections
- `EditableText` component — swaps between display tag and input/textarea on double-click
- `SectionRenderer` — maps type → component, passes sectionBg style override

### AI API — `app/api/ai/route.ts`
- Section mode: rewrites one section's props
- Page mode: rewrites all pages at once with a summary
- Uses `gemini-flash-latest` via `GEMINI_API_KEY`

### Supabase schema — `supabase/migrations/001_initial_schema.sql`
- `shops` table with RLS (public read, owner write)
- `products` table with RLS (public read, owner write)
- No `layouts` table yet — builder output currently only saves to localStorage

---

## What's NOT done yet (pending work)

### Phase 1 — Core (do these first)
1. **Save/Publish flow** — "Save" button only saves to localStorage. Need to wire to Supabase, and "Publish" to make `/store/[id]` render the builder layout. This turns it from a toy into a real product.
2. **Store page renderer** — `app/store/[id]/page.tsx` doesn't render builder layouts yet (shows old MongoDB-era product list).
3. **Image uploads** — Hero, About, Gallery sections show gray placeholder divs. Need Supabase Storage or similar.
4. **Preview button** — top bar "Preview" button does nothing yet. Should open full-screen no-UI preview.

### Phase 2 — Polish
5. **Section-level AI** — the ✦ button on each section opens chat but should target that specific section with context.
6. **Mobile optimization** — mobile toggle exists but sections aren't truly responsive yet.
7. **Custom domain** — let users point their own domain to their store.

### Phase 3 — Growth
8. **Product management in builder** — add/edit products directly from the canvas (not a separate dashboard).
9. **Analytics** — page views, CTA click tracking.
10. **Payments** — Razorpay or Stripe integration for actual selling.

## Env vars needed
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
```

## Commands
```bash
npm run dev     # start dev server
npm run build   # production build
npx tsc --noEmit  # type check only
```
