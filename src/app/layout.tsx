import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PhytoScan AI — Expert Botanical Pathology & Agricultural Diagnostics",
  description:
    "Production-grade plant leaf disease diagnostics powered by Google Gemini lightweight vision models with dual-API key rate limit control and exhaustive 8-tier agronomic reports.",
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
