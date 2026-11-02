import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InfoPage } from "../../../components/info-page/info-page";
import { PLACEHOLDER_INFO_PAGE } from "../../../components/info-page/placeholder";
import { InfoPageData } from "../../../components/info-page/types";
import { sanityFetch } from "../../../data/sanity";
import {
  ALL_INFO_PAGE_SLUGS,
  INFO_PAGE_QUERY,
} from "../../../data/sanity/queries";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: ALL_INFO_PAGE_SLUGS,
    perspective: "published",
    stega: false,
  });
  return data ?? [];
}

/** Information pages: Privacy Policy, Terms & Conditions, Shipping and Returns... */
async function getInfoPage(slug: string, stega = true) {
  const { data } = await sanityFetch({
    query: INFO_PAGE_QUERY,
    params: { slug },
    stega,
  });
  if (data?._id) return data as InfoPageData;

  // Development only: show the design's Privacy Policy until one exists
  if (process.env.NODE_ENV === "development" && slug === "privacy-policy") {
    return PLACEHOLDER_INFO_PAGE;
  }
  return null;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const info = await getInfoPage(params.slug, false);
  if (!info) return {};
  return { title: info.title, description: info.intro } satisfies Metadata;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const info = await getInfoPage(params.slug);
  if (!info) return notFound();
  return <InfoPage page={info} />;
}
