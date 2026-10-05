"use client";

import { useEffect, useState } from "react";

/**
 * Dev-only 24-column overlay. Press Option+G (Alt+G) to toggle.
 */
export function GridOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      // Match the physical key: on macOS Option+G produces "©", not "g"
      if (e.altKey && !e.metaKey && !e.ctrlKey && e.code === "KeyG") {
        e.preventDefault();
        setVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!visible) return null;

  return (
    <div className="grid grid-overlay" aria-hidden>
      {Array.from({ length: 24 }, (_, i) => (
        <div key={i} />
      ))}
    </div>
  );
}
