/**
 * Sanity CLI config for the storefront. Only used for `sanity typegen generate`,
 * which reads the schema extracted by the studio workspace.
 */
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
  typegen: {
    path: ["./sanity/**/*.{ts,tsx,js,jsx}", "./data/sanity/**/*.{ts,tsx,js,jsx}"],
    schema: "../studio/schema.json",
    generates: "./sanity.types.ts",
    overloadClientMethods: true,
  },
});
