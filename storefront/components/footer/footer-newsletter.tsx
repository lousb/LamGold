"use client";

import { useActionState } from "react";

import { newsletterAction } from "../../app/actions";
import s from "./footer.module.css";

export function FooterNewsletter() {
  const [state, dispatch, isPending] = useActionState(newsletterAction, "idle");

  if (state === "success") {
    return <p>You&apos;re in, we&apos;ll keep you updated.</p>;
  }

  return (
    <>
      <p>Signup and get access to exclusive news and launches:</p>
      <form className={s.form} action={dispatch}>
        <label htmlFor="footer-email" className="visually-hidden">
          Email address
        </label>
        <input
          id="footer-email"
          className={s.input}
          name="email"
          type="email"
          placeholder="Enter your e-mail"
          autoComplete="email"
          required
        />
        <button
          className={s.submit}
          type="submit"
          aria-label="Subscribe"
          disabled={isPending}
        >
          +
        </button>
      </form>
      {state === "error" && (
        <p className={s.error}>Something went wrong, please try again.</p>
      )}
    </>
  );
}
