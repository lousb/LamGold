"use client";

import { ReactNode, useId, useState } from "react";
import s from "./ui.module.css";

/** "Materials + Specifications  +" rows with a rule underneath */
export function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children?: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className={s.accordion}>
      <button
        type="button"
        className={s.accordionButton}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{title}</span>
        <span aria-hidden>{open ? "-" : "+"}</span>
      </button>
      <div id={id} className={s.accordionPanel} hidden={!open}>
        {children}
      </div>
    </div>
  );
}
