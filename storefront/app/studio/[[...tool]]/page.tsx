/**
 * The Sanity Studio, embedded at /studio. Same config as the standalone
 * studio workspace (studio/sanity.config.ts).
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../../studio/sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
