"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

/** Goes back when there's history on this site, otherwise home */
export function BackLink({ className }: { className?: string }) {
  const router = useRouter();

  return (
    <Link
      href="/"
      className={className}
      onClick={(e) => {
        if (
          typeof document !== "undefined" &&
          document.referrer.startsWith(window.location.origin) &&
          window.history.length > 1
        ) {
          e.preventDefault();
          router.back();
        }
      }}
    >
      Back
    </Link>
  );
}
