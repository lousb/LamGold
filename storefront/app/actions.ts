"use server";

import { draftMode } from "next/headers";
import { z } from "zod";

export async function disableDraftMode() {
  "use server";
  await Promise.allSettled([
    (await draftMode()).disable(),
    // Simulate a delay to show the loading state
    new Promise((resolve) => setTimeout(resolve, 1000)),
  ]);
}

export async function newsletterAction(
  prev_state: string,
  formData: FormData,
): Promise<string> {
  const { data, success } = z
    .object({
      email: z.string().email(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!success) return "error";
  const { email } = data;

  try {
    const url = "https://a.klaviyo.com/api/profile-import";

    const options = {
      method: "POST",
      headers: {
        accept: "application/vnd.api+json",
        revision: "2025-01-15",
        "content-type": "application/vnd.api+json",
        Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: "profile",
          attributes: {
            email,
          },
        },
      }),
    };

    const res = await fetch(url, options);

    if (!res.ok) throw new Error("klaviyo req failed");

    return "success";
  } catch (error) {
    console.log(error);
    return "error";
  }
}

/**
 * Custom Enquiry overlay. Sends the enquiry as JSON to ENQUIRY_WEBHOOK_URL
 * (e.g. a Formspree / Zapier / Make endpoint that emails the studio).
 * Without one set, enquiries are only logged in development.
 */
export async function enquiryAction(
  _prevState: string,
  formData: FormData,
): Promise<string> {
  const { data, success } = z
    .object({
      name: z.string().trim().min(1),
      email: z.string().trim().email(),
      jewellery: z.string().trim().optional(),
      karat: z.string().trim().optional(),
      enquiry: z.string().trim().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!success) return "invalid";

  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  if (!webhook) {
    if (process.env.NODE_ENV === "development") {
      console.log("Custom enquiry (set ENQUIRY_WEBHOOK_URL to send):", data);
      return "success";
    }
    console.error("ENQUIRY_WEBHOOK_URL is not set");
    return "error";
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ ...data, _subject: "LamGold custom enquiry" }),
    });
    if (!res.ok) throw new Error(`Enquiry webhook responded ${res.status}`);
    return "success";
  } catch (error) {
    console.error(error);
    return "error";
  }
}
