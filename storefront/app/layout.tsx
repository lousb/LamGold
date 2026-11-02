/**
 * Bare root layout. The site's header, footer, cart and styles live in
 * (site)/layout.tsx; the embedded Sanity Studio at /studio sits outside them.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
