# BXR Competition — Shopify theme

Paddock Editions 1.5.0. A native Shopify theme based on Dawn for racing tires and braking components.

## Connect in Shopify

1. Open **Online Store → Themes → Add theme / Import theme → Connect from GitHub**.
2. Authorize the Shopify GitHub app for **coding-dog-92/bear_shop**.
3. Choose account **coding-dog-92**, repository **bear_shop**, branch **main**.
4. Open **Preview** on the new connected theme. Once configured and checked, choose **Publish**.

The Shopify theme folders are at the repository root. No build, ZIP extraction, or nested `theme/` directory is required.

## Store configuration

- **Products**: manage actual products, images, variants, prices, inventory and Online Store availability.
- **Products → Collections**: create Racing tires, Braking systems and Featured parts collections.
- **Edit theme → BXR featured parts → Featured collection**: select Featured parts.
- **Edit theme → BXR categories**: select each Collection and clear any Custom destination override.
- **Edit theme → BXR header**: select the tire/brake collections; leave Menu blank to use the included navigation.
- **BXR cinematic slideshow**: edit the three slides, imagery, copy and button destinations.
- **Settings → Customer accounts**: enable sign-in links; keep Show customer account link enabled in BXR header.
- **BXR vehicle finder → Add block → Verified vehicle mapping**: enter supplier-verified year, make, model, optional trim and a matching product or collection destination. Without a verified match, visitors can carry their vehicle details into the Support form.
- Guides, About and Support have built-in routes and optional page templates; select canonical pages under **Theme settings → BXR content destinations**.
- The Support form delivers to **Settings → Notifications → Sender email**. The public support email setting only changes displayed text.

Products and payment credentials are not stored in this repository. Included photography is illustrative; upload real SKU images and verified specifications before selling.

## Updating the connected theme

Shopify syncs the connected branch in both directions: pushing code updates the connected theme, and saving theme-editor settings creates commits on this branch. Pull before editing and pushing so merchant changes to config/settings_data.json, section groups and templates are preserved. Do not overwrite these files with older local defaults.

Publishing the connected theme makes future pushes to main storefront changes. Use a separate branch and an unpublished connected theme to preview larger changes before merging.

## Included fixes

- Small slideshow dots and native product gallery thumbnails.
- Shop caret stays aligned beside the label under Dawn base styles.
- Shared storefront/password typography defaults prevent zero root font size and unbounded footer line height when theme settings are missing.
- Font preloads are skipped when no font is configured.

Release checks: 9 tests passed; Shopify Theme Check reported 0 errors and 11 inherited/known warnings. Header, footer and navigation were checked at desktop and mobile widths. Storefront checks used temporary browser-loaded fixes; connecting this repository performs the actual Shopify synchronization.

## License

Based on Shopify Dawn. See LICENSE.md for the upstream MIT license.

## 1.3.0 homepage

- Homepage order: slideshow, category cards, vehicle finder, featured products, BXR brand and support, technical guides; shared navigation and footer frame the page.
- Slideshow defaults to manual navigation with small dots, previous/next controls and touch swiping. Image buttons lead to products; the entire image is not a link. Enabling autoplay in the editor restores the required pause control.
- Category names take priority over slogans. **Theme settings → BXR store & catalog** sets shared collection destinations or exact product types. The defaults use Shopify's native type collections for `Racing tires` and `Braking systems`, matching the test CSV. Explicit section destinations take precedence.
- Featured products load their price styles directly and display product type and variant count. The existing Featured parts collection selection is preserved.
- Vehicle suggestions and results come only from configured verified fitment blocks (up to 50). Year, make and model are required; leaving trim blank lists every matching verified trim. Results never infer compatibility from a product title. This editor mapping is suitable for a small catalog; a large supplier fitment dataset needs a dedicated catalog integration.
- The Support form accepts vehicle and supported topic query parameters to prefill an enquiry, without submitting it. Empty or external fitment destinations are ignored.
- **BXR brand & support** contains editable brand copy and guide/contact links. **BXR footer** accepts an optional public email and contact hours. Shipping/returns links use published policies, or offer a support enquiry until policies are configured.
- Mobile layouts use a two-column vehicle form, horizontally scrollable product cards, stacked brand/guides and a compact footer. Header and carousel controls retain 44 px touch targets.


## 1.2.3 storefront recovery

- Restored the global settings schema after an empty schema was synced from Shopify; removed an unsupported menu-picker default and made the 1440 px saved page width valid in the range definition.
- Native layout dimensions now have defaults as well as typography, so a missing setting cannot collapse search inputs and overlap labels/icons.
- Empty collections provide an explanation, guides and a contact destination. Editorial category cards are labeled as illustrative and link to relevant guides until a real collection is selected.
- Product search keeps its product-only scope when submitted again.
- Live verification after GitHub sync: home, search, collection, guides, about, support and cart passed at 1440 and 390 px; no JavaScript errors or horizontal overflow. Real product detail/purchase flow remains untested because the storefront currently exposes no products.
- Run `node scripts/check-theme-config.mjs` to detect missing schema, invalid menu defaults and incompatible numeric values before pushing.


## 1.4.0 Paddock Editions

- Implements the selected warm-paper desktop/mobile design, with new daytime pit-lane photography and a compact centered header.
- Section titles explain the browsing journey: Shop by category, Find parts for your car, Selected for the circuit, and Setup guides.
- Category cards open their corresponding catalog categories. Featured products come from the editor-selected collection; View all parts always opens the complete `/collections/all` catalog. A small test catalog can naturally contain the same products in both places.
- Search and vehicle fitment open native modal drawers. Escape, close buttons and backdrop dismiss them; focus returns to the trigger and the vehicle inputs remain intact on reopening. A no-JavaScript search form and fitment contact link remain available.
- Product cards open the native product detail page from their image/name. Product outlines use contain sizing; sale/from-price logic remains Shopify-native. There are no duplicate per-card browse buttons.
- Footer groups remain expanded on desktop and become native disclosures on mobile. Account, contact and policy destinations are preserved.
- The existing brand section is retained but disabled to avoid duplicating the guide/support content. Guides link to the dedicated guide page, not back to products.
- Real vehicle-to-product mapping data is still merchant-managed under BXR vehicle finder. This release does not invent product compatibility or business policies.


### 1.5.0 — Shop directly below the hero

The homepage combines featured products and category browsing in one `BXR shop collection` section. Its three tabs are Featured, Racing tires and Braking components. Featured uses the selected collection; category previews use Theme settings → BXR catalog destinations collections, falling back to exact product-type matches in the first Shopify all-products slice. Assign category collections for a growing catalog; their full collection links remain available. Desktop cards share three columns; mobile cards scroll horizontally with the next card visible.

The existing vehicle finder retains its verified mapping blocks and now opens from the small Check vehicle fitment link below the product cards. Without JavaScript, this link goes to Support and category tabs remain normal catalog links. Re-enable the old category image section only if intentionally adding that extra content back to the homepage.

The slideshow defaults to seven-second rotation, pauses on mouse hover and keyboard focus, and resumes after leaving. Explicit pause, reduced-motion preference, hidden tabs, offscreen carousel and theme-editor mode suspend automatic rotation. Manual slide selection does not permanently disable rotation. The compact pause control remains available for touch and keyboard users.

Header, shopping area, guide card and footer share a 1440px content width on large screens. The guide has a bounded image height with matching panel edges rather than a full-width, naturally expanding image.
