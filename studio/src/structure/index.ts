import { AsteriskIcon } from "@sanity/icons/Asterisk";
import { CubeIcon } from "@sanity/icons/Cube";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";

import type { StructureResolver } from "sanity/structure";
import { singletonListItem, SINGLETONS } from "./singletons";

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

export const structure: StructureResolver = (S, _) =>
  S.list()
    .title("Storefront Content")
    .items([
      singletonListItem(S, SINGLETONS.home),
      S.documentTypeListItem("page").title("Pages").icon(DocumentTextIcon),
      S.documentTypeListItem("infoPage")
        .title("Information pages")
        .icon(InfoOutlineIcon),
      S.divider(),
      S.documentTypeListItem("collection").title("Collections").icon(CubeIcon),
      S.documentTypeListItem("product").title("Products").icon(AsteriskIcon),
      S.divider(),
      singletonListItem(S, SINGLETONS.karatGuide),
      singletonListItem(S, SINGLETONS.necklaceSizeGuide),
      S.divider(),
      // Settings Singleton in order to view/edit the one particular document for Settings.  Learn more about Singletons: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
      singletonListItem(S, SINGLETONS.settings),
    ]);
