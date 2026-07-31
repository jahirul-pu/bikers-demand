# Bikers Demand — Implementation Plan

## Overview

Build a mobile-first motorcycle accessories e-commerce platform for the Bangladesh market. The platform carries owned inventory across four categories (Riding Gear, Parts & Mods, Electronics, Merchandise), with a bike-compatibility filter as the core differentiator. Bangladesh-native payments (COD, bKash, Nagad, Rocket, BanglaQR) and logistics are first-class requirements.

This is a **greenfield project** — created strictly adhering to [design.md](design.md) and [prd.md](prd.md).

---

## User Scope & Configuration Decisions

- **Phased Roadmap**: 
  - **Phase 1**: Landing page & design system (Completed)
  - **Phase 2**: Landing page components & interactive bike selector (Completed)
  - **Phase 3**: Database schema & local PostgreSQL (Completed)
  - **Phase 4**: Next.js API routes & backend logic (Next step)
  - **Phase 5**: Storefront catalog & checkout flow (COD active)
  - **Phase 6**: User accounts, My Garage & order tracking
  - **Phase 7**: Admin management panel & claims workflow
  - **Phase 8**: Content & policy pages
- **Styling**: Tailwind CSS v4 + Google Fonts (`Barlow Condensed`, `Inter`, `Space Mono`)
- **Backend Architecture**: Next.js API Routes + Prisma ORM + Local PostgreSQL
- **Media Storage**: S3-compatible storage
- **Authentication**: NextAuth.js (phone/email + password)
- **Payment Method**: Cash on Delivery (COD) as primary live option for v1

---

## Proposed Tech Stack (per PRD Section 8.2)

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14+ (App Router) + TypeScript | SSR for SEO + mobile performance |
| Styling | Tailwind CSS | Per PRD recommendation |
| Database | PostgreSQL + Prisma ORM | Relational model for bike↔product compatibility |
| Search | Postgres full-text search (v1) | Upgrade to Meilisearch later if needed |
| Auth | NextAuth.js | Phone/email + password |
| Image hosting | S3-compatible storage | Product images + claim evidence |
| Hosting | Vercel + managed Postgres | Low ops overhead |
| Fonts | Barlow Condensed, Inter, Space Mono | Per design.md |

---

## Proposed Changes

### Phase 1: Project Scaffolding & Design System (Completed)

#### [NEW] Project initialization

- Initialize Next.js 14+ with App Router, TypeScript, Tailwind CSS, ESLint
- Configure `tailwind.config.ts` with the design system tokens from [design.md](design.md):
  - Colors: Asphalt (#15171A), Asphalt 2 (#1E2125), Steel (#8A8D91), Steel Light (#B7BABE), Off White (#F2F1EC), Plate Yellow (#E8B93A), Ignition Red (#E23434)
  - Fonts: Barlow Condensed (display), Inter (body), Space Mono (mono)
- Set up Google Fonts via `next/font`
- Configure base globals.css with dark theme defaults

#### [NEW] `src/app/layout.tsx`

- Root layout with fonts, metadata (SEO title/description), dark theme
- Responsive viewport configuration (mobile-first, 360px minimum)

---

### Phase 2: Landing Page Components (design.md sections 1–10) (Completed)

#### [NEW] `src/components/layout/UtilityBar.tsx`

- Scrolling or static bar: "Nationwide Cash on Delivery", "Mobile Banking Support", shipping info
- Dark background with Steel text, subtle animation

#### [NEW] `src/components/layout/Header.tsx`

- Brand logo "Bikers Demand" in Barlow Condensed
- Search bar with autocomplete
- Account, Favorites, Cart icons with badge counts
- Mobile hamburger menu

#### [NEW] `src/components/layout/Navigation.tsx`

- Category nav: Riding Gear, Parts & Mods, Electronics, Merchandise, Brands, Help
- Active state styling with Ignition Red accent

#### [NEW] `src/components/landing/BikeSelectionStrip.tsx`

- Motorcycle number plate styled element (Plate Yellow background, industrial font)
- "Compatible with: [Bike Model]" message
- "Change Bike" action button

#### [NEW] `src/components/landing/HeroSection.tsx`

- Headline: "Shop by your bike. Not by guesswork." (Barlow Condensed, large)
- Subtext: "Add your bike once. See only the parts, mods and accessories that actually fit."
- Primary CTA: "Add Your Bike" → opens bike selector modal (Ignition Red button)
- Secondary CTA: "Browse All Gear" → scrolls to category grid (outlined button)

#### [NEW] `src/components/landing/CategoryGrid.tsx`

- 4-column grid (2×2 on mobile): Riding Gear, Parts & Mods, Electronics, Merchandise

#### [NEW] `src/components/landing/ProductCard.tsx`

- Reusable card component used in multiple sections
- Fields: product image, fit badge ("✓ Fits your bike"), brand, title, price (BDT/Tk), stock indicator

#### [NEW] `src/components/landing/CompatibleProducts.tsx`

- Section: "Compatible with Your [Bike Model]"
- 4 product cards dynamically filtered by active bike model

#### [NEW] `src/components/landing/RidingGearSection.tsx`

- Section: "Riding Gear — Universal Fit"
- Certified helmets (ECE 22.06 / DOT), armored jackets, gloves

#### [NEW] `src/components/landing/TrustSection.tsx`

- 4-column icon grid: Genuine Parts, Confirmed Compatibility, Tk 60/130 Delivery, COD
- Parts & Mods Return Policy Notice box (PRD Section 4.5)

#### [NEW] `src/components/layout/Footer.tsx`

- Copyright: "© 2026 Bikers Demand" & version notice

#### [NEW] `src/components/landing/BikeSelectorModal.tsx`

- Interactive modal to pick Brand (Yamaha, Honda, Suzuki, Bajaj, TVS) → Model → Variant

#### [NEW] `src/app/page.tsx`

- Assemble all 10 landing page components in order

---

### Phase 3: Database Schema & Prisma Models (Completed)

#### [NEW] `prisma/schema.prisma`

Core models:

```
User              — id, name, email, phone, password_hash, role (CUSTOMER | ADMIN)
Address           — id, user_id, label, line1, line2, city, zone (DHAKA | OUTSIDE_DHAKA), phone
BikeModel         — id, brand, model, variant, cc, year_from, year_to
UserBike          — id, user_id, bike_model_id (My Garage)
Category          — id, name, slug, parent_id (self-referencing for subcategories)
Product           — id, name, slug, description, category_id, brand, price, compare_price,
                    stock_qty, sku, images[], size_options[], certification, 
                    warranty_flag, warranty_duration, is_active
ProductCompatibility — product_id, bike_model_id (many-to-many join table)
Cart              — id, user_id (nullable for guest), session_id
CartItem          — id, cart_id, product_id, quantity, selected_size
Order             — id, user_id, address_id, status (PLACED → CONFIRMED → PACKED → 
                    SHIPPED → OUT_FOR_DELIVERY → DELIVERED → FAILED → RETURNED),
                    payment_method, payment_status, subtotal, delivery_charge, total,
                    notes, created_at
OrderItem         — id, order_id, product_id, quantity, unit_price, size
Wishlist          — id, user_id, product_id
Coupon            — id, code, discount_type, discount_value, min_order, expires_at, is_active
Claim             — id, order_id, order_item_id, type (WRONG_ITEM | COUNTERFEIT), 
                    evidence_urls[], status (PENDING → REVIEWING → APPROVED → REJECTED),
                    admin_notes, created_at
```

---

### Phase 4: API Routes (Next.js App Router)

- Auth routes (`src/app/api/auth/[...nextauth]/route.ts`)
- Products API (`src/app/api/products/route.ts`)
- Bikes API (`src/app/api/bikes/route.ts`)
- Cart API (`src/app/api/cart/route.ts`)
- Checkout API (`src/app/api/checkout/route.ts`)
- User Garage API (`src/app/api/user/garage/route.ts`)
- Admin Management APIs (`src/app/api/admin/*`)

---

### Phase 5: Storefront Pages

- Category Browse (`src/app/category/[slug]/page.tsx`)
- Product Detail (`src/app/product/[slug]/page.tsx`)
- Cart Page (`src/app/cart/page.tsx`)
- Checkout Page (`src/app/checkout/page.tsx`)
- Search Results (`src/app/search/page.tsx`)

---

### Phase 6: User Account Panel (PRD Section 4.1a)

- My Garage (`src/app/account/garage/page.tsx`)
- Compatible Parts view (`src/app/account/compatible/page.tsx`)
- Order History & Live Tracking (`src/app/account/orders/page.tsx`)
- Replacement Evidence Claim Upload (`src/app/account/orders/[id]/page.tsx`)

---

### Phase 7: Admin Panel

- Products & Inventory (`src/app/admin/products/page.tsx`)
- Bike Registry Matrix (`src/app/admin/bikes/page.tsx`)
- Order Status Pipeline (`src/app/admin/orders/page.tsx`)
- Evidence Claim Queue (`src/app/admin/claims/page.tsx`)

---

### Phase 8: Content & Policy Pages (PRD Section 5)

- Return Policy (`src/app/(content)/returns/page.tsx`)
- Warranty Policy (`src/app/(content)/warranty/page.tsx`)
- Shipping Policy (`src/app/(content)/shipping/page.tsx`)
- Privacy Policy (`src/app/(content)/privacy/page.tsx`)

---

## File & Component Summary

| Phase | Files | Description |
|---|---|---|
| 1 — Scaffolding | ~5 config files | Next.js init, Tailwind config, fonts, globals |
| 2 — Landing Page | ~12 components + 1 page | All 10 design sections as components |
| 3 — Database | 2 files (schema + seed) | Full Prisma schema with bike compatibility model |
| 4 — API Routes | ~12 route files | Products, bikes, cart, checkout, orders, admin |
| 5 — Storefront | ~5 pages | Category, product, cart, checkout, search |
| 6 — User Account | ~7 pages | My Garage, compatible parts, orders, wishlist, addresses |
| 7 — Admin Panel | ~7 pages | Products, orders, bikes, claims, coupons, reports |
| 8 — Content Pages | ~7 pages | About, FAQ, policies |
| **Total** | **~58 files** | |

---

## Verification Plan

### Automated Tests
- `npx prisma validate` — schema validation
- `npx prisma db push` — database sync test
- `npm run build` — full Next.js production build (catches type errors, broken imports)

### Manual Verification
- **Responsive testing**: Browser DevTools at 360px, 768px, 1024px, 1440px breakpoints
- **Landing page**: All 10 sections render correctly, animations smooth, CTAs functional
- **Bike selector**: Cascading dropdowns work, selection persists across pages
- **Product flow**: Browse → filter by bike → view product → add to cart → checkout
