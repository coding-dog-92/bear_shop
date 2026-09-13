# BXR Competition — Shopify theme

Paddock Editions 1.7.1. A native Shopify theme based on Dawn for racing tires and braking components.

## Connect in Shopify

1. Open **Online Store → Themes → Add theme / Import theme → Connect from GitHub**.
2. Authorize the Shopify GitHub app for **coding-dog-92/bear_shop**.
3. Choose account **coding-dog-92**, repository **bear_shop**, branch **main**.
4. Open **Preview** on the new connected theme. Once configured and checked, choose **Publish**.

The Shopify theme folders are at the repository root. No build, ZIP extraction, or nested `theme/` directory is required.

## Store configuration

- **Products**: manage actual products, images, variants, prices, inventory and Online Store availability.
- **Products → Collections**: create Racing tires, Braking systems and Featured parts collections.
- **Edit theme → BXR shop collection → Featured collection**: select Featured parts.
- **Edit theme → BXR category stories**: select each Collection and clear any Custom destination override.
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


### 1.6.0 — A complete editorial homepage

Homepage order: cinematic slideshow → shop collection and category tabs → two category stories → inline vehicle finder → three BXR Journal stories → brand story → purchase help → footer. Earlier category, guide and brand sections remain disabled in the editor, preserving their saved content.

In **Online Store → Themes → Edit theme**, select **Home page**:

- **BXR cinematic slideshow → Slide**: replace Desktop image/Mobile image, or choose **Background video** and optionally **Mobile background video** from Shopify Files. Use a muted 8–12 second film. The included first slide uses a subtle photographic camera movement, not generated driving footage. Text and buttons stay still. Images remain visible until video playback succeeds. Motion pauses on hover, keyboard focus, explicit pause, hidden tabs and leaving the viewport; reduced-motion and editor mode start paused. The homepage now rotates every 10 seconds.
- **BXR category stories**: edit the two editorial images, headings, descriptions and category/collection destinations. The shopping tabs above remain the direct product browser.
- **BXR vehicle finder**: the form is visible on the page. Add only verified vehicle mappings. With no configured matches, visitors see an honest result and can carry their vehicle details into Support. A full fitment database still requires real supplier data.
- **BXR journal → Journal story**: each card links to a complete included guide. Select a Shopify blog article to use its title, excerpt, image and URL, or choose a custom link and cover. If replacing the included guides with a blog, select corresponding articles for these cards too.
- **BXR brand story**: manage the image and company introduction.
- **BXR purchase help → Question**: edit questions and answers. Shipping and returns automatically link to published Shopify policies, falling back to a relevant enquiry when a policy has not been published.

The newly included wheel, preparation and garage photographs are illustrative AI-generated editorial assets; they do not document BXR facilities, events or exact product specifications. Real product information is still managed under **Products**, and business terms under **Settings → Policies**.


### 1.6.1 — Included cinematic video

The first slide now includes an actual muted H.264 video, served with the theme assets, with a separate portrait crop. Its matching poster remains visible until playback succeeds and whenever motion is disabled. The film is 8.2 seconds; the existing 10-second slideshow, hover/focus pause, visibility handling and manual controls still apply. In **BXR cinematic slideshow → first Slide**, disable **Use included racing film** to restore the original photographic artwork, or select **Background video** to override the included film with Shopify-hosted footage.

Included film source: [Stunning Cinematic Sports Car Animation](https://www.pexels.com/video/stunning-cinematic-sports-car-animation-30288571/) by Nikhil thakur, downloaded 2026-09-13, used and modified under the [Pexels License](https://www.pexels.com/license/). This is illustrative CGI stock footage, not footage of BXR-owned vehicles or an endorsement by the depicted manufacturers. The edit removes audio, trims before the large front-badge shot, blends the loop boundary, resizes for desktop/mobile and extracts matching WebP posters. No runtime connection to Pexels is required.


### 1.6.2 — A stronger opening film

Replaced the slow showroom orbit with a five-shot, eight-second CGI driving edit: a low tracking view of a red/black competition coupe, splitter detail, rear detail, a close pass and a return to the tracking shot. Desktop and mobile have separate reframing and matching first-frame posters. The carousel controls, hover pause, reduced-motion fallback and merchant video override are unchanged.

Film source: [Sports Car Video Footage](https://www.motionforgepictures.com/sports-car-video-footage/) by Chris J Mitchell / Motion Forge Pictures, published June 1, 2023; downloaded September 13, 2026. Source clips 0001, 0005, 0006 and 0009 were trimmed, sequenced, color graded, reframed and compressed for this storefront. The publisher's [license terms](https://www.motionforgepictures.com/terms-and-conditions/) permit commercial website use and require credit; the About page contains a Film credits disclosure including “Models or Textures Supplied by Motion Forge Pictures.” The original download also includes a Creative Commons notice without a specific variant, so no CC0 or specific CC variant is claimed here. Original production files are not distributed in this theme. These videos are illustrative stock CGI and do not imply ownership or manufacturer endorsement.


### 1.7.0 — Porsche 911 development storefront

The connected development store now uses the reviewed Porsche 911 GT3 RS Nürburgring edit, with separate desktop/mobile MP4 files and posters. The homepage enables the full-screen layout, transparent navigation over the hero, an opaque navigation background after scrolling, and right-positioned desktop copy. Other page headers stay solid.

Footage source: Porsche AG, https://newstv.porsche.com/porschevideos/226786_en_3000000.mp4. The user requested this material for development/self-testing; no commercial license is claimed. Replace the footage or secure appropriate rights before commercial use. These are native theme assets, so a push to the connected main branch synchronizes the film and markup together.


### 1.7.1 — Detail-led Porsche film

Replaces the Nürburgring driving montage with headlight, wheel, bodywork and rear-wing close-ups, mixed with a short whole-car shot. Source: SolidMotion, Autotron Exclusive case study, https://solidmotion.nl/case-autotron, https://solidmotion.nl/assets/videos/cases/case-autotron/film-1.mp4. Source is 1920×1080 at 50 fps; the letterboxed image is reframed to 1920×840 at 30 fps, with a separately framed mobile file. Retains the user's development/self-testing scope; no commercial license is claimed. Slideshow interval is 12 seconds to accommodate the complete film.
