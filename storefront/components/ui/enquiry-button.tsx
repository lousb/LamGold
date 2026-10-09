"use client";

import { useOverlay } from "../overlays/overlay-context";
import s from "./ui.module.css";

/** "Request Custom Piece ... AU$ 500 - 1000" - opens the Custom Enquiry overlay */
export function EnquiryButton({
  label,
  price,
  className = "",
}: {
  label: string;
  price?: string | null;
  className?: string;
}) {
  const { openOverlay } = useOverlay();
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      className={`${s.button} ${className}`}
      onClick={() => openOverlay("enquiry")}
    >
      <span>{label}</span>
      {price ? <span>{price}</span> : null}
    </button>
  );
}
