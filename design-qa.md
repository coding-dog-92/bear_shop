# Paddock Edition design QA

Result: passed

Scope: selected direction 1, implemented as the existing native Shopify theme, version 1.4.0.

Reference: `exec-55328b29-ad44-4fbf-978d-763bc7f24736.png`, the selected direction revised to clarify headings and catalog navigation. Actual screenshots and the reference were inspected together, not reconstructed from memory.

Evidence: `/Users/jinboli/outputs/bxr-redesign/qa/` contains desktop-home.png, mobile-home.png, mobile-products.png, desktop-products-guide.png and desktop-footer.png. Browser viewports: 1440 × 1000, 768 × 1024, 390 × 844 and 320 × 780. Screenshots capture individual viewport sections because the browser's full-page stitching is unreliable.

- Typography and hierarchy: centered wordmark; restrained hero heading; section headings for categories, fitment, selected products and guides; smaller category and product names. No duplicate product showcase at the bottom.
- Layout and spacing: two category images, compact vehicle entry, three desktop product columns, two mobile columns with a final odd card spanning both. No horizontal page overflow at the four tested widths.
- Color and imagery: warm paper, charcoal type, muted red links; generated daylit paddock hero with a separate mobile composition and a pit-lane guide photograph. Mobile headline sits on dark pavement. Product images contain the complete part rather than cropping it.
- Interaction: manual carousel dots and arrow keys; search autofocus, Escape and focus return; vehicle drawer close/reopen retains inputs; positive match exercised with a local-only fixture, unknown vehicle routes to consultation; mobile footer disclosure toggles and desktop groups remain expanded.
- Content: live Shopify catalog remains authoritative for names, options and prices. Featured collection selection is retained; View all parts links to the complete catalog. Obsolete category caption controls and guide note blocks are removed from the homepage editor.

Corrections after screenshot review: removed inherited mobile carousel grid flow that collapsed the first cards; revised the mobile hero asset for readable text; restored footer text contrast after the dark-footer styles leaked through; aligned the odd mobile product row with the chosen reference.

Intentional differences: actual test product imagery/names replace generated mockup product branding; no invented specifications or verified fitments. Hero copy explicitly describes the store's tires and braking components. Native Shopify page routing, account and commerce remain in place. This is a design and theme interaction check, not a completed purchase or contact submission.

Static checks: JavaScript syntax and 130 global setting checks pass. Shopify Theme Check has zero errors; its remaining warnings concern existing theme patterns. Local browser console reported no errors. Live synchronization and navigation are verified separately after push.

## Live Shopify verification

Verified on the published GitHub-connected theme after commits dcaf5be and b65ae74:

- New homepage, daylit responsive hero and headings are present on the live store.
- Search for tire returns one real catalog result; Tires category contains one product; View all parts enters /collections/all with three products.
- Mobile product gallery switches to the second image. Selecting 265/35 R18 through its visible label updates the price from $295 to $325.
- Add to cart reaches a cart containing the chosen test product. That test line was removed afterward; the empty cart state was confirmed. No checkout or order was submitted.
- Unknown vehicle 2024 Porsche 911 gives an explicit unverified-match message and pre-fills the support form with those details. No contact form was submitted.
- Explore guides opens the populated tire, brake and preparation guide page. Mobile menu Escape returns to collapsed state.
- Found and corrected an existing catalog problem: blank live card style caused duplicate product titles over images. The card snippet now falls back to standard; live computed styles show the image-overlay information hidden and the normal product information visible. The primary add-to-cart button now has a distinct charcoal background.

Known content/configuration limits: three illustrative demo products; no live verified vehicle mappings; the live cart currently reports SGD. These are merchant data/settings, not a completed US-market launch. Local fixture prices used USD and were not substituted for live catalog pricing. Updated live mobile screenshot: live-mobile-home.png in the evidence directory.
