import s from "./wordmark.module.css";

/**
 * The LAMGOLD wordmark, drawn in the current text colour (the logo PNG is
 * used as a mask so one asset works in pink, white and red).
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span role="img" aria-label="LamGold" className={`${s.wordmark} ${className}`} />
  );
}

/**
 * Full-width LAMGOLD band that sits under each row of product tiles.
 * `mobileOnly` hides it on desktop (e.g. between tiles that share a row).
 */
export function Band({
  mobileOnly = false,
  desktopOnly = false,
}: {
  mobileOnly?: boolean;
  desktopOnly?: boolean;
}) {
  return (
    <div
      className={`${s.band} ${mobileOnly ? s.mobileOnly : ""} ${desktopOnly ? s.desktopOnly : ""}`}
      aria-hidden
    >
      <span className={s.wordmark} />
    </div>
  );
}
