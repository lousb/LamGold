import s from "./ui.module.css";

/**
 * Karat / thickness / length / weight, laid out on the grid:
 * desktop (8-column panel): columns 1, 6, 7, 8; mobile: 1, 4, 6, 8 (weight
 * right-aligned). Each column is its own list, as in the Custom piece design.
 */
export function SpecColumns({
  columns,
  className = "",
  inset = false,
}: {
  columns: [string[], string[], string[], string[]];
  className?: string;
  /** Mobile index rows start at column 2 */
  inset?: boolean;
}) {
  return (
    <div className={`${s.specs} ${inset ? s.specsInset : ""} ${className}`}>
      {columns.map((values, i) => (
        <ul key={i} role="list" className={s.specColumn}>
          {values.map((value, j) => (
            <li key={j}>{value || " "}</li>
          ))}
        </ul>
      ))}
    </div>
  );
}
