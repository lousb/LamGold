import { stegaClean, type StegaBranded } from "@sanity/client/stega";
import NextLink from "next/link";
import { LinkFieldsType } from "../data/sanity/queries";

export default function SanityLink({
  children,
  link,
}: {
  children: React.ReactNode;
  link: LinkFieldsType | StegaBranded<LinkFieldsType>;
}) {
  // In draft mode values can carry invisible stega characters, so clean
  // before comparing against literals or using as an href.
  const linkType = stegaClean(link.linkType);
  const url = stegaClean(link.url);
  return (
    <>
      {linkType === "href" ? (
        <a
          href={url || "#"}
          target={link.openInNewTab ? "_blank" : "_self"}
        >
          {children}
          {" ↗"}
        </a>
      ) : (
        <NextLink
          href={url || "#"}
          target={link.openInNewTab ? "_blank" : "_self"}
        >
          {children}
        </NextLink>
      )}
    </>
  );
}
