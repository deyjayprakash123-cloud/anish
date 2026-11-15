import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlantScan AI — Botanical Pathology & Agricultural Diagnostics",
  description:
    "Expert-grade plant disease diagnostics powered by PlantScan AI, trained on 100,000+ multimodal foliar specimens across 38 crop taxonomies. Generates exhaustive 8-tier agronomic reports.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark font-sans">
      <body className="antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
