Product Requirements Document
Bikers Demand — Motorcycle Accessories E-Commerce Platform
Version: 0.2 (Draft)
Owner: Tusher
Market: Bangladesh
Status: Draft for review

1. Overview
1.1 Problem Statement
Bangladesh's motorcycle ownership base is growing rapidly, but riders sourcing accessories — riding gear, spare parts, electronics, and merchandise — face a fragmented market: scattered local shops with inconsistent stock, limited genuine or quality-verified options, and no dedicated online destination offering breadth, trust, and convenient delivery.
1.2 Product Vision
A dedicated online-only motorcycle accessories store carrying owned inventory across four categories — riding gear, parts & mods, electronics, and merchandise — built for Bangladeshi riders, with Bangladesh-native payment and logistics from day one.
1.3 Goals
    • Launch a trustworthy, fast, mobile-first online store for motorcycle accessories
    • Carry owned inventory (no dropshipping) to control quality and fulfillment speed
    • Support Bangladesh-specific payment (COD, bKash/Nagad/Rocket, BanglaQR) and logistics (Pathao or equivalent) norms
    • Build category structure that scales from gear to parts to electronics without becoming unnavigable
1.4 Non-Goals (v1)
    • Physical retail storefront
    • Custom/made-to-order parts or fitting services
    • International shipping
    • Marketplace/third-party seller listings
2. Target Users
Persona	Description	Needs
Daily Commuter	Rides a 100–150cc bike for daily commute	Affordable gear, basic parts, quick delivery
Enthusiast Rider	Owns a higher-cc bike, active in riding communities	Genuine parts, premium gear, mods/accessories
First-Time Buyer	New rider, often gifted or first bike purchase	Helmets, basic safety gear, guidance/education content
Mechanic / Small Garage	Buys parts in small bulk for customer jobs	Parts availability, possibly bulk pricing later
3. Product Catalog Structure
3.1 Top-Level Categories
    • Riding Gear — helmets, jackets, gloves, riding pants, boots, rain gear, knee/elbow guards
    • Parts & Mods — exhausts, mirrors, levers, foot pegs, chain & sprocket kits, brake components, body kits/fairings
    • Electronics — LED lighting, horns, phone mounts/chargers, GPS trackers, dash cams, battery accessories
    • Merchandise — branded apparel, keychains, stickers, riding backpacks/tank bags
3.2 Catalog Attributes (per product)
    • Compatible bike models/brands (critical for parts — needs a compatibility filter/matrix)
    • Brand (own-label vs. third-party brand carried)
    • Size (for gear: helmets, jackets, gloves, boots)
    • Certification/safety rating — mandatory for helmets, see 3.4 below
    • Stock quantity (owned inventory — real-time accuracy is critical)
    • Warranty terms (varies by category: gear vs. electronics vs. parts)
3.3 Bike Compatibility Filter (Parts & Mods, Electronics where applicable)
Confirmed for v1. Parts & Mods (and any Electronics items that are model-specific, e.g. fairing-mounted lighting) will use a structured make/model/year (or make/model/CC-variant, given BD market naming conventions) compatibility system rather than free-text or tags.
    • Data model: a bike registry (brand → model → variant/year) mapped many-to-many against products via a compatibility table — not tags or free-text matching
    • Frontend: a "Select Your Bike" filter on Parts & Mods category/search pages — optional, not a gate. Users can browse unfiltered or narrow results by selecting their bike
    • Once selected, the choice persists across the session and syncs with the user's saved bike(s) in their account (see Section 4.1a — User Panel) for logged-in users
    • Product page: explicit compatibility list shown (e.g. "Fits: Yamaha FZS-Fi v3, Yamaha FZS-Fi v2") so compatibility is visible even outside the filtered flow (e.g. shared links, search)
    • Admin: bike registry must be manageable independently of products, so new bike models can be added without a dev task, and products can be bulk-tagged against multiple compatible models
    • Riding Gear and Merchandise are exempt from this filter — sizing, not bike model, governs those categories
Positioning note: No current Bangladesh motorcycle accessories site offers a bike-specific compatibility filter. This is a deliberate differentiator and should be called out explicitly in marketing/homepage messaging (e.g. "Shop by your bike") rather than treated as a background feature.
3.4 Helmet Certification Standard
DOT (US) and ECE 22.05/22.06 (EU) certifications are the priority standard for helmets carried on Bikers Demand. BSTI certification is not required from suppliers.
    • Every helmet SKU must record its certification (DOT and/or ECE) as a mandatory catalog field — not optional metadata
    • Product page must display the certification mark/logo where available, to reinforce the trust positioning called out in Section 4.1 (Homepage trust signals)
    • Admin: certification field should be a required, validated field at product-creation time (not free text)
Compliance flag: Bangladesh's Road Transport Act 2018 and BRTA/BSTI directives establish BSTI certification as the legally mandated standard for helmets marketed in-country; DOT/ECE are treated by regulators as accepted equivalents but BSTI is the baseline legal requirement. This is noted here as a compliance consideration for legal review (Section 6), not a blocker — flagging it so it's an informed decision rather than an oversight.
4. Functional Requirements
4.1 Customer-Facing Frontend
Homepage
    • Featured categories, new arrivals, best sellers
    • Promotional banner/campaign slots
    • Trust signals (genuine product guarantee, warranty, COD availability)
Product Discovery
    • Category browsing with filters (price, brand, size, bike compatibility)
    • Search with autocomplete
    • Bike compatibility filter for parts (if adopted per 3.2)
Product Detail Page
    • Multiple images, zoom
    • Size guide (for gear)
    • Compatibility info (for parts)
    • Stock status (in stock / low stock / out of stock — real inventory, not estimated)
    • Warranty/return info inline
    • Related/compatible accessories cross-sell
Cart & Checkout
    • Guest checkout supported
    • Delivery zone selection with dynamic delivery charge
    • Payment: Cash on Delivery, bKash, Nagad, Rocket, BanglaQR
    • Order confirmation via SMS/email
Account
    • Order history & tracking
    • Saved addresses
    • Wishlist
4.1a User Panel (Logged-in Account Area)
A dedicated account section, central to the bike-compatibility positioning (see 3.3), covering the following:
    • My Garage: users can add one or more of their own bikes (make/model/variant); saved bikes double as quick-select options for the Parts & Mods compatibility filter, so a returning user doesn't need to reselect their bike each visit
    • Compatible Parts view: a filtered view showing Parts & Mods and Electronics compatible with the user's saved bike(s), accessible directly from the panel — not only from category browsing
    • Delivery Addresses: manage one or more saved delivery addresses
    • Account Information: name, contact details, password/login management
    • Order History: full list of past orders
    • Order Progress/Tracking: live status for active orders, matching the pipeline in Section 4.3 (placed → confirmed → packed → shipped → delivered)
    • Favorites/Wishlist: saved products for later purchase
Note: My Garage is what elevates the bike-compatibility filter (3.3) from a one-off browsing tool into a persistent, personalized experience — this is likely the single feature most worth highlighting in marketing alongside the compatibility filter itself.
4.2 Admin Panel
    • Product & inventory management (owned stock — needs low-stock alerts, since there's no dropship fallback)
    • Order management (status pipeline: placed → confirmed → packed → shipped → delivered → returned/refunded)
    • Bike registry & compatibility matrix management (add/edit bike models, bulk-assign product compatibility — see 3.3)
    • Customer management
    • Discount/coupon/campaign management
    • Basic sales & inventory reporting
    • Return/warranty claim handling workflow
4.3 Order Lifecycle
    • Order placed (COD or prepaid)
    • Order confirmation call/SMS (common practice in BD e-commerce to reduce COD fraud/false orders)
    • Packed
    • Handed to logistics partner (Pathao or similar)
    • Out for delivery
    • Delivered / Failed delivery / Returned
    • Post-delivery: return window, warranty claim path
4.4 Bangladesh-Specific Operational Requirements
    • Payments: COD (primary), bKash, Nagad, Rocket, BanglaQR
    • Logistics: Pathao or equivalent courier integration; delivery charge is a flat Tk 60 inside Dhaka and Tk 130 for the rest of the country
    • Pricing: VAT-inclusive display pricing
    • No minimum order policy (consistent with prior precedent, pending confirmation this applies here too)
    • Compliance: Privacy policy aligned with Bangladesh's Personal Data Protection Act 2026
4.5 Return Policy Rule — Parts & Mods (Confirmed)
Parts & Mods items are not eligible for return once the packaging/seal is torn or opened, regardless of whether the part was installed. This is a hard policy, not case-by-case.
    • Applies to Parts & Mods category only; Riding Gear, Electronics, and Merchandise follow standard return terms (to be defined separately per category, per Section 6)
    • Rationale: parts packaging cannot verify installation/use once opened, and resale as new is not viable — this is standard practice for auto/motorcycle parts retail
    • Must be stated clearly at three touchpoints: product page (Parts & Mods items), cart/checkout confirmation, and the Return & Refund Policy page — to avoid disputes
    • Defective/DOA parts are a separate path: manufacturing defects should be handled via warranty claim, not return, even if the packet was opened to discover the defect (warranty scope for parts is defined in Section 4.6 — parts themselves carry no warranty, so this applies only to categories that do)
Exception — Wrong Item or Counterfeit (Confirmed)
If the packet is already torn and the customer finds the product is different from what was ordered, or is a counterfeit/copy of the genuine product, a replacement can still be issued — but only with sufficient documented proof.
    • Required evidence: clear photographs and video of the product, packaging, and any labeling/markings that support the wrong-item or counterfeit claim
    • This is a replacement path, not a refund path by default — Bikers Demand sends the correct/genuine item once the claim is verified
    • Admin: needs a claims workflow where customers can upload photo/video evidence against an order, and support/admin can review and approve or reject before a replacement is issued
Open item: Define the specific evidence checklist (e.g. unboxing video from seal to product, timestamp requirements, packaging photos from multiple angles) so the claims team has a consistent bar to evaluate against, and define the review SLA (e.g. claims reviewed within X business days).
4.6 Warranty Policy (Confirmed)
    • Parts & Mods: no warranty on any item in this category
    • Engine oil: no warranty
    • Electronics: no warranty by default, except select electrical accessories explicitly designated as warrantied — e.g. batteries. The warrantied electronics subcategories need to be enumerated explicitly in the catalog (a per-SKU or per-subcategory flag), not assumed at the category level
    • Riding Gear and Merchandise: warranty terms still to be defined (Section 6)
Implication: Since warranty is the exception rather than the default even within Electronics, the catalog needs a clear "Warranty: Yes/No" (and duration, if yes) field per product, and product/category pages must state "No warranty" explicitly where applicable rather than staying silent — silence reads as ambiguous to customers.
5. Content & Policy Pages (v1 scope)
    • About Us
    • FAQ
    • Return & Refund Policy
    • Warranty Policy (no warranty for Parts & Mods or engine oil; select Electronics only — see 4.6)
    • Shipping & Delivery Policy
    • Privacy Policy
    • Terms of Service
6. Open Items & Decisions Needed
☐  Evidence checklist and review SLA for wrong-item/counterfeit replacement claims (see 4.5)
☐  Warranty terms for Riding Gear and Merchandise (see 4.6)
☐  Which specific Electronics subcategories/SKUs carry warranty beyond batteries, and warranty duration (see 4.6)
☐  Support email/phone/contact channel
☐  Initial supplier/brand list for owned inventory
☐  Legal review of policy pages before launch, including the no-return-if-opened clause for Parts & Mods and the BSTI compliance flag (see 3.4)
☐  Bike registry seed list — which brands/models to launch with, and how granular (e.g. include CC variants and model years, or model-only)
7. Success Metrics (draft — refine with business goals)
    • Orders per month post-launch
    • Cart-to-checkout conversion rate
    • COD confirmation rate / failed delivery rate
    • Repeat purchase rate
    • Category mix (gear vs. parts vs. electronics vs. merch) to guide inventory investment
8. Technical Considerations & Recommended Stack
The site must be mobile-friendly by default — most Bangladesh e-commerce traffic skews mobile, and the compatibility filter and My Garage features especially need to feel native on a phone, not like a desktop layout squeezed down.
    • Recommend real-time inventory sync between admin and storefront (owned inventory model makes overselling a real risk, unlike dropship)
    • Compatibility matrix (bike model → compatible parts) is a core v1 feature and needs a proper relational data model, not tags/free-text — this should be designed early since it touches catalog, search, and product pages
8.1 Architectural Approach
    • Recommend a single responsive web app (not separate mobile/desktop codebases) built mobile-first, rather than a native app for v1 — faster to ship, easier to maintain, and avoids app-store friction for first-time buyers
    • Progressive Web App (PWA) support (installable, offline-capable shell) is worth considering later once traffic validates demand for an app-like experience, without committing to native iOS/Android builds upfront
8.2 Recommended Stack
Layer	Recommendation	Why
Frontend framework	Next.js (React) + TypeScript	Server-side rendering for fast mobile loads and SEO; same stack pattern already in use for your other e-commerce project
Styling	Tailwind CSS	Fast to build responsive, mobile-first layouts consistently across pages
Backend / API	Next.js API routes or a separate Node.js (NestJS/Express) service	Keep it simple initially (Next.js API routes); split into a dedicated backend later if admin/catalog complexity grows
Database	PostgreSQL + Prisma ORM	Relational model is a strong fit for the bike-registry ↔ product compatibility matrix (3.3), which needs proper joins, not a document store
Search	Postgres full-text search initially; Meilisearch or Algolia if catalog grows large	Avoid over-engineering search before there's enough catalog volume to need it
Payments	bKash, Nagad, Rocket merchant APIs + COD handling	Bangladesh-specific gateways per Section 4.4; no international gateway needed for v1
Image/media hosting	Cloudinary or S3-compatible object storage + CDN	Product photography and unboxing-evidence uploads (Section 4.5) both need reliable media storage
Admin panel	Custom-built within the same Next.js app (role-gated routes), or a headless CMS/admin like Payload/Strapi	Custom keeps the compatibility matrix and warranty-flag logic (4.6) fully bespoke rather than fighting a generic e-commerce admin
Hosting	Vercel (frontend) + managed Postgres (e.g. Supabase, Railway, or Neon)	Low ops overhead for a small team; scales without infra management early on
8.3 Mobile-Friendliness Requirements
    • All pages responsive from small phone widths (~360px) up through desktop — not just "works on mobile" but designed mobile-first
    • My Garage, bike selector, and Compatible Parts view (Section 4.1a) should be usable one-handed — these are likely to be checked on the go, e.g. while at a parts shop deciding what to order
    • Checkout flow kept short on mobile: minimize form fields, use address autofill/saved addresses, and keep payment method selection (COD/bKash/Nagad/Rocket/BanglaQR) to large, thumb-friendly tap targets
    • Photo/video evidence upload for replacement claims (Section 4.5) must work smoothly from a phone camera roll, since that's how most customers will generate this evidence
9. Summary of Key Confirmed Decisions
Consolidated here for quick reference — full detail is in the sections noted.
    • Shop name: Bikers Demand (Section title)
    • Bike compatibility filter: optional, not a gate; positioned as a market differentiator (3.3)
    • My Garage / user panel: saved bikes, compatible-parts view, addresses, order history & tracking, favorites (4.1a)
    • Helmet certification: DOT/ECE prioritized; BSTI not required from suppliers, though flagged as a legal compliance consideration (3.4)
    • Parts & Mods: no returns once packet is torn, except a documented-evidence replacement path for wrong/counterfeit items (4.5)
    • Warranty: none for Parts & Mods or engine oil; only select Electronics (e.g. batteries) are warrantied (4.6)
    • Delivery charges: Tk 60 inside Dhaka, Tk 130 for the rest of the country (4.4)
    • Recommended stack: Next.js + TypeScript + Tailwind, PostgreSQL + Prisma, Bangladesh-native payment gateways, mobile-first responsive web app (Section 8)