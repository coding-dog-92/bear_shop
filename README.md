# BXR Competition — Shopify theme

Circuit Cinema 1.2.3. A native Shopify theme based on Dawn for racing tires and braking components.

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
- Hide BXR vehicle finder until you have verified vehicle-to-product fitment mappings.
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


## 1.2.3 storefront recovery

- Restored the global settings schema after an empty schema was synced from Shopify; removed an unsupported menu-picker default and made the 1440 px saved page width valid in the range definition.
- Native layout dimensions now have defaults as well as typography, so a missing setting cannot collapse search inputs and overlap labels/icons.
- Empty collections provide an explanation, guides and a contact destination. Editorial category cards are labeled as illustrative and link to relevant guides until a real collection is selected.
- Product search keeps its product-only scope when submitted again.
- Live verification after GitHub sync: home, search, collection, guides, about, support and cart passed at 1440 and 390 px; no JavaScript errors or horizontal overflow. Real product detail/purchase flow remains untested because the storefront currently exposes no products.
- Run `node scripts/check-theme-config.mjs` to detect missing schema, invalid menu defaults and incompatible numeric values before pushing.
