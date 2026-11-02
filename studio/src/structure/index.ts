import { AsteriskIcon } from "@sanity/icons/Asterisk";
import { BookIcon } from "@sanity/icons/Book";
import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";

import type { StructureResolver } from "sanity/structure";
import { PRODUCT_TYPE_OPTIONS } from "../schema-types/objects/global/footer";
import { singletonListItem, SINGLETONS } from "./singletons";

/**
 * The Studio sidebar. Kept deliberately short so the client only sees what
 * actually appears on the site:
 *
 *   Home · Products · Info pages · Guides · Settings
 *
 * Shopify collections and variants are still synced in the background by
 * Sanity Connect but aren't used by the site, so they're left out of here.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("LamGold")
    .items([
      singletonListItem(S, SINGLETONS.home),
      S.listItem()
        .title("Products")
        .icon(AsteriskIcon)
        .child(
          S.list()
            .title("Products")
            .items([
              S.listItem()
                .title("All products")
                .icon(AsteriskIcon)
                .child(
                  S.documentTypeList("product")
                    .title("All products")
                    .filter('_type == "product" && !(store.isDeleted == true)'),
                ),
              S.divider(),
              ...PRODUCT_TYPE_OPTIONS.map(({ title, value }) =>
                S.listItem()
                  .id(`product-type-${value}`)
                  .title(title)
                  .icon(AsteriskIcon)
                  .child(
                    S.documentTypeList("product")
                      .title(title)
                      .filter('_type == "product" && type == $type')
                      .params({ type: value }),
                  ),
              ),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem("infoPage")
        .title("Info pages")
        .icon(InfoOutlineIcon),
      S.listItem()
        .title("Guides")
        .icon(BookIcon)
        .child(
          S.list()
            .title("Guides")
            .items([
              singletonListItem(S, SINGLETONS.karatGuide),
              singletonListItem(S, SINGLETONS.necklaceSizeGuide),
            ]),
        ),
      S.divider(),
      singletonListItem(S, SINGLETONS.settings),
    ]);
