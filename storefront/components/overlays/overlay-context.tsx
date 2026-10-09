"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type OverlayName = "cart" | "enquiry";

type OverlayContextType = {
  open: OverlayName | null;
  openOverlay: (name: OverlayName) => void;
  closeOverlay: () => void;
};

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

/** Which slide-out panel (Cart / Custom Enquiry) is open, if any */
export function OverlayProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<OverlayName | null>(null);

  const value = useMemo(
    () => ({
      open,
      openOverlay: (name: OverlayName) => setOpen(name),
      closeOverlay: () => setOpen(null),
    }),
    [open],
  );

  return (
    <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>
  );
}

export function useOverlay() {
  const context = useContext(OverlayContext);
  if (!context) throw new Error("useOverlay must be used within OverlayProvider");
  return context;
}

/** Button that opens one of the panels */
export function OverlayTrigger({
  name,
  className,
  children,
}: {
  name: OverlayName;
  className?: string;
  children: ReactNode;
}) {
  const { openOverlay } = useOverlay();
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      onClick={() => openOverlay(name)}
    >
      {children}
    </button>
  );
}
