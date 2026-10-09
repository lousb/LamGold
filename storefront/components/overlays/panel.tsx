"use client";

import { ReactNode, useEffect, useRef } from "react";
import s from "./panel.module.css";

/**
 * Slide-out panel (Cart from the right, Custom Enquiry from the left).
 * Desktop: a third of the page (8 columns + its outer gutter), full height.
 * Mobile: full screen. Stays mounted so it can slide out again.
 */
export function Panel({
  side,
  open,
  onClose,
  label,
  children,
  footer,
}: {
  side: "left" | "right";
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Esc closes; move focus into the panel when it opens
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    ref.current?.focus({ preventScroll: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`${s.backdrop} ${open ? s.backdropOpen : ""}`}
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        inert={!open}
        data-open={open || undefined}
        className={`${s.panel} ${s[side]} ${open ? s.open : ""}`}
      >
        <div className={s.top}>
          <button type="button" className={s.close} onClick={onClose}>
            Close
          </button>
        </div>
        <div className={s.body}>{children}</div>
        {footer ? <div className={s.footer}>{footer}</div> : null}
      </div>
    </>
  );
}
