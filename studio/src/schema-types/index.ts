// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

import { collection } from "./documents/collection";
import { infoPage } from "./documents/info-page";
import { page } from "./documents/page";
import { product } from "./documents/product";
import { productVariant } from "./documents/product-variant";
import { blockContent } from "./objects/editorial/block-content";
import { customPieceSection } from "./objects/editorial/custom-piece-section";
import { editorialBlock } from "./objects/editorial/editorial-block";
import { newsletter } from "./objects/editorial/newsletter";
import { picture } from "./objects/editorial/picture";
import { productTypeSection } from "./objects/editorial/product-type-section";
import { storySection } from "./objects/editorial/story-section";
import { announcementBar } from "./objects/global/announcement-bar";
import { footer } from "./objects/global/footer";
import { header } from "./objects/global/header";
import { link } from "./objects/global/link";
import { pageSeo } from "./objects/global/page-seo";
import { inventory } from "./objects/shopify/inventory";
import { option } from "./objects/shopify/option";
import { placeholderString } from "./objects/shopify/placeholder-string";
import { priceRange } from "./objects/shopify/price-range";
import { productWithVariant } from "./objects/shopify/product-with-variant";
import { proxyString } from "./objects/shopify/proxy-string";
import { shopifyCollection } from "./objects/shopify/shopify-collection";
import { shopifyCollectionRule } from "./objects/shopify/shopify-collection-rule";
import { shopifyProduct } from "./objects/shopify/shopify-product";
import { shopifyProductVariant } from "./objects/shopify/shopify-product-variant";
import { home } from "./singletons/home";
import { karatGuide } from "./singletons/karat-guide";
import { necklaceSizeGuide } from "./singletons/necklace-size-guide";
import { settings } from "./singletons/settings";

export const schemaTypes = [
  // Singletons
  settings,
  home,
  karatGuide,
  necklaceSizeGuide,
  // Documents
  collection,
  page,
  infoPage,
  product,
  productVariant,
  // Objects
  /// Editorial
  blockContent,
  editorialBlock,
  picture,
  newsletter,
  /// Home page builder blocks
  productTypeSection,
  storySection,
  customPieceSection,
  /// Global
  pageSeo,
  link,
  header,
  footer,
  announcementBar,
  /// Shopify
  inventory,
  option,
  placeholderString,
  priceRange,
  productWithVariant,
  proxyString,
  shopifyCollection,
  shopifyCollectionRule,
  shopifyProduct,
  shopifyProductVariant,
];
