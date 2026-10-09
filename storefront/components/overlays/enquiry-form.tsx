"use client";

import { PortableTextBlock } from "next-sanity";
import { useActionState, useEffect, useRef } from "react";

import { enquiryAction } from "../../app/actions";
import { CustomPortableText } from "../custom-portable-text";
import s from "./enquiry.module.css";
import panel from "./panel.module.css";

type Field = {
  name: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
  tall?: boolean;
};

const FIELDS: Field[] = [
  { name: "name", placeholder: "Your name", type: "text", autoComplete: "name" },
  { name: "email", placeholder: "Your email", type: "email", autoComplete: "email" },
  {
    name: "jewellery",
    placeholder: "Your desired jewellery: chain, bracelet, earring or pendant",
    multiline: true,
  },
  { name: "karat", placeholder: "Your desired karat", type: "text" },
  {
    name: "enquiry",
    placeholder: "Your enquiry: a custom size, width, or design",
    multiline: true,
    tall: true,
  },
];

export const ENQUIRY_FORM_ID = "custom-enquiry-form";

/** Custom Enquiry overlay contents: intro copy + numbered fields */
export function EnquiryForm({ intro }: { intro?: PortableTextBlock[] | null }) {
  const [state, dispatch] = useActionState(enquiryAction, "idle");
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === "success") form.current?.reset();
  }, [state]);

  return (
    <div className={s.enquiry}>
      <div className={s.intro}>
        {intro?.length ? (
          <CustomPortableText value={intro} />
        ) : (
          <>
            <p>
              Fill out the form below to enquire about a custom piece and
              we’ll get in touch to make it a reality. Once we’ve finalised
              the design with you, we will complete your piece over the course
              of 1 to 4 weeks, depending on the intricacy of the design and the
              studio’s capacity.
            </p>
            <p>
              Deposit starting amount is $500 and will vary based on the size
              of the work required. After we’ve reviewed your submission and
              requirements, this deposit must be paid for work to commence.
              Please note all deposits are non refundable, once design work and
              quoting has begun.
            </p>
          </>
        )}
      </div>

      <form id={ENQUIRY_FORM_ID} ref={form} action={dispatch} className={s.form}>
        {FIELDS.map((field, i) => (
          <label
            key={field.name}
            className={`${s.row} ${field.tall ? s.tall : ""}`}
          >
            <span className={s.number}>{String(i + 1).padStart(2, "0")}</span>
            {field.multiline ? (
              // Wrapping placeholder: drawn behind the text area so long
              // prompts can wrap onto a second line (as on mobile)
              <span className={s.multiline}>
                <textarea
                  name={field.name}
                  placeholder=" "
                  aria-label={field.placeholder}
                  rows={1}
                  className={s.input}
                />
                <span className={s.placeholder} aria-hidden>
                  {field.placeholder}
                </span>
              </span>
            ) : (
              <input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                aria-label={field.placeholder}
                autoComplete={field.autoComplete}
                required={field.name === "name" || field.name === "email"}
                className={s.input}
              />
            )}
          </label>
        ))}
      </form>

      <p className={s.status} role="status">
        {state === "success"
          ? "Thank you, we’ll be in touch soon."
          : state === "invalid"
            ? "Please add your name and a valid email."
            : state === "error"
              ? "Something went wrong, please try again."
              : null}
      </p>
    </div>
  );
}

/** "Submit Enquiry" bar, outside the scrolling area */
export function EnquirySubmit() {
  return (
    <button type="submit" form={ENQUIRY_FORM_ID} className={panel.bar}>
      <span>Submit Enquiry</span>
    </button>
  );
}
