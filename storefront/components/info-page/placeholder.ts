import { InfoPageData } from "./types";

const USE_ITEMS = [
  "Fulfil and deliver your orders.",
  "Communicate with you about orders, customer service inquiries, and updates.",
  "Provide newsletters and marketing communications (if you have consented).",
  "Improve our Website functionality, performance, and security.",
  "Comply with legal and regulatory requirements.",
];

const LEGAL_ITEMS = [
  "Consent – for marketing emails, newsletters, and non-essential cookies.",
  "Contract – to process and deliver orders you purchase.",
  "Legitimate Interests – to improve our Website, personalise your experience, prevent fraud, and secure our systems.",
  "Legal Obligations – to comply with tax, accounting, and other legal requirements.",
];

/**
 * The Information Page design's Privacy Policy, shown in development only
 * while no Information page exists in Sanity.
 */
export const PLACEHOLDER_INFO_PAGE: InfoPageData = {
  _id: "placeholder-privacy-policy",
  title: "Privacy Policy",
  slug: "privacy-policy",
  lastUpdated: "2026-07-29",
  intro:
    "We are committed to protecting your personal data and respecting your privacy. This Privacy Policy explains how we collect, use, store, and share your personal data in compliance with the EU General Data Protection Regulation (GDPR).",
  sections: [
    {
      title: "Data We Collect",
      groups: [
        {
          label: "Information You Provide Directly",
          items: [
            "Name, email address, shipping/billing address, and payment details when making a purchase.",
            "Email address and preferences when subscribing to newsletters.",
            "Information submitted through customer service inquiries.",
          ],
        },
        {
          label: "Information Collected Automatically",
          items: [
            "Cookies and similar technologies (browser type, IP address, device identifiers, pages visited, time spent).",
            "Analytics data (e.g., Google Analytics, Google Tag Manager, YouTube, Vimeo).",
          ],
        },
        {
          label: "Information From Third Parties",
          items: [
            "Payment providers, shipping carriers, and marketing/email service providers may share relevant information to fulfil transactions or provide services.",
          ],
        },
      ],
    },
    {
      title: "Legal Bases for Processing",
      groups: [
        {
          label: "We process your personal data on the following grounds:",
          items: LEGAL_ITEMS,
        },
      ],
    },
    {
      title: "How We Use Your Data",
      groups: [{ label: "We use your personal data to:", items: USE_ITEMS }],
    },
    {
      title: "How We Use Your Data",
      groups: [{ label: "We use your commercial data to:", items: USE_ITEMS }],
    },
    {
      title: "Data Retention",
      groups: [
        {
          label:
            "We retain personal data only for as long as necessary for the purposes described:",
          items: [
            "Order data: up to 7 years (for tax and accounting compliance).",
            "Newsletter/marketing data: until you unsubscribe or remain inactive for 3 years.",
            "Customer service communications: up to 3 years.",
            "Cookie/analytics data: per cookie expiration (see our Cookie Policy).",
            "In all cases, data is retained only as long as necessary to fulfil the purposes for which it was collected and to comply with applicable legal obligations.",
          ],
        },
      ],
    },
  ],
};
