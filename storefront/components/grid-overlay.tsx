"use client";

import { useEffect, useState } from "react";

/**
 * Dev-only 24-column overlay. Press Shift+G to toggle.
 */
export function GridOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (e.shiftKey && e.key.toLowerCase() === "g") setVisible((v) => !v);
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
