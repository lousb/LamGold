import { defineQuery } from "next-sanity";

const pageSeoFields = /* groq */ `
  _type,
  "title": coalesce(title, ^.name),
  description,
  ogImage
`;

// Legacy generic page builder block (still used by Page/Collection editorial content)
const pageBuilderFields = /* groq */ `
  _key,
  _type,
  "cover": cover[] {
    _type,
    "picture": select(_type == "picture" => {
      asset,
      crop,
      hotspot,
      alt,
    }),
    "color": select(_type == "color" => hex)
  },
  content,
  "textColor": coalesce(textColor.hex, 'black'),
`;

// Home page builder blocks: Product type section, Story section, Custom piece section
const homePageBuilderFields = /* groq */ `
  _key,
  _type,
  // productTypeSection
  heading,
  productType,
  "products": select(
    _type == "productTypeSection" => *[_type == "product" && type == ^.productType && defined(store.slug.current)] | order(_updatedAt desc) {
      _id,
      store,
    }
  ),
  // storySection
  body,
  "image": image{
    asset,
    crop,
    hotspot,
    alt,
  },
  // customPieceSection
  description,
  "cta": cta{
    _type,
    _key,
    linkType,
    href,
    "page": page->slug.current,
    "product": product->store.slug.current,
    "collection": collection->store.slug.current,
    label,
    openInNewTab
  }
`;

const linkFields = /* groq */ `
  _type,
  _key,
  linkType,
  "url": select(
    linkType == 'href' => href,
    linkType == 'home' => '/',
    linkType == 'plp' => '/products',
    linkType == 'page' => '/' + page->slug.current,
    linkType == 'product' => '/products/' + product->store.slug.current,
    linkType == 'collection' => '/collections/' + collection->store.slug.current,
  ),
  "label": select(
      label.length > 0 => label,
      linkType == 'home' => 'Home',
      linkType == 'plp' => 'All Products',
      linkType == 'page' => page->name,
      linkType == 'product' => product->store.title,
      linkType == 'collection' => collection->store.title,
      "Link"
    ),
  openInNewTab
`;

export type LinkFieldsType = {
  _type: "link";
  _key: string;
  linkType: "collection" | "home" | "href" | "page" | "plp" | "product";
  url: string | "/" | "/colections/all" | null;
  label: string | "All Products" | "Home" | "Link" | null;
  openInNewTab: boolean;
};

export const SETTINGS_QUERY = defineQuery(`
  *[_type == "settings"][0]{
    _type,
    _id,
    _updatedAt,
    _createdAt,
    "title": coalesce(title, "Untitled Store"),
    metadataBase,
    shippingReturnsWarranties,
    header{
      _type,
      announcementBar{
        _type,
        content,
        "link": links[0]{${linkFields}}
      },
      "links": links[]{${linkFields}}
    },
    footer{
      _type,
      productTypes,
      "infoLinks": infoLinks[]{${linkFields}},
      "connectLinks": connectLinks[]{${linkFields}},
    },
    footerImage,
  }`);

export const HOME_QUERY = defineQuery(`
  *[_type == 'home' ][0]{
    _type,
    _id,
    _updatedAt,
    _createdAt,
    "status": select(_id in path("drafts.**") => "draft", "published"),
    "name": "Home",
    "slug": "/",
    "pageBuilder": pageBuilder[]{
      ${homePageBuilderFields}
    },
    pageSeo{${pageSeoFields}}
  }
`);

export const PAGE_QUERY = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _type,
    _id,
    _updatedAt,
    _createdAt,
    "status": select(_id in path("drafts.**") => "draft", "published"),
    "name": coalesce(name, "Untitled Page"),
    "slug": slug.current,
    "pageBuilder": pageBuilder[]{
      ${pageBuilderFields}
    },
    pageSeo{${pageSeoFields}}
  }
`);

export const COLLECTION_QUERY = defineQuery(`
  *[_type == 'collection' && store.slug.current == $slug][0]{
    _type,
    _id,
    _updatedAt,
    _createdAt,
    "status": select(_id in path("drafts.**") => "draft", "published"),
    "name": coalesce(name, "Untitled Collection"),
    "slug": slug.current,
    store,
    "editorial": {
      "_type":'page',
      _id,
      _updatedAt,
      _createdAt,
      "status": select(_id in path("drafts.**") => "draft", "published"),
      "name": coalesce(name, "Untitled Page"),
      "slug": store.slug.current,
      pageBuilder[]{
        ${pageBuilderFields}
      },
    },
    pageSeo{${pageSeoFields}}
  }
`);

export const ALL_COLLECTIONS_QUERY = defineQuery(`
  *[_type == "collection" && defined(store.slug.current) && !store.isDeleted] | order(date desc, _updatedAt desc) {
    ...,
  }
`);

export const ALL_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && defined(store.slug.current)] | order(date desc, _updatedAt desc) {
    ...,
  }
`);

// Products belonging to a given LamGold product type (necklaces, chains, pendants, earrings, ...).
// Used by the "All products" view filtered by type, and by the Home page's Product type section block.
export const PRODUCTS_BY_TYPE_QUERY = defineQuery(`
  *[_type == "product" && type == $type && defined(store.slug.current)] | order(date desc, _updatedAt desc) {
    ...,
  }
`);

export const MORE_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && _id != $skip && defined(store.slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ...,
  }
`);

export const PRODUCT_QUERY = defineQuery(`
  *[_type == "product" && store.slug.current == $slug] [0] {
    _type,
    _id,
    _updatedAt,
    _createdAt,
    type,
    description,
    materialsAndSpecifications,
    carats,
    thickness,
    length,
    weight,
    "shippingReturnsWarranty": coalesce(
      shippingReturnsWarrantyOverride,
      *[_type == 'settings'][0].shippingReturnsWarranties
    ),
    "status": select(_id in path("drafts.**") => "draft", "published"),
    "name": coalesce(name, "Untitled Page"),
    "slug": store.slug.current,
    pageSeo{${pageSeoFields}}
  }
`);

export const PRODUCT_METADATA_QUERY = defineQuery(`
  *[_type == "product" && store.slug.current == $slug] [0] {
    _type,
    _id,
    store
  }
`);

export const ALL_PRODUCT_PAGES_SLUGS = defineQuery(`
  *[_type == "product" && defined(store.slug.current)]
  {"slug": store.slug.current}
`);

export const ALL_COLLECTION_PAGES_SLUGS = defineQuery(`
  *[_type == "collection" && defined(store.slug.current)]
  {"slug": store.slug.current}
`);

export const ALL_PAGES_SLUGS = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`);
