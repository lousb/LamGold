import Link from "next/link";
import s from "./ui.module.css";

/** Link styled as the full-width button bar (e.g. Request Custom Piece) */
export function CtaButton({
  href,
  label,
  price,
  className = "",
  newTab = false,
}: {
  href: string;
  label: string;
  price?: string | null;
  className?: string;
  newTab?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`${s.button} ${className}`}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span>{label}</span>
      {price ? <span>{price}</span> : null}
    </Link>
  );
}

export const buttonClassName = s.button;
