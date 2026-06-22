import type { Metadata, Viewport } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://kodexbg.com"),
  title: {
    default: "Kodex Publishing | Издателство за книги със смисъл",
    template: "%s | Kodex Publishing",
  },
  description:
    "Kodex Publishing е българско издателство за истории, детски книги и смислени издания с ясна мисъл, добра форма и трайна стойност.",
  authors: [{ name: "Kodex Publishing" }],
  icons: {
    icon: [
      { url: "/assets/kodex-icon.svg", type: "image/svg+xml" },
      { url: "/assets/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/assets/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "bg_BG",
    siteName: "Kodex Publishing",
    images: [
      {
        url: "/assets/og-image.jpg",
        alt: "Корица на детската книга Чудовището без уши от Костантин Стамболов",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/assets/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#18211f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg">
      <body>
        <link rel="stylesheet" href="/assets/styles/chrome.css" />
        {children}
        <Script src="/assets/analytics-consent3.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
