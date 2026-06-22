import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://kodexbg.com"),
  title: "Kodex Publishing | Издателство за книги със смисъл",
  description:
    "Kodex Publishing е българско издателство за истории, детски книги и смислени издания с ясна мисъл, добра форма и трайна стойност.",
  keywords: [
    "Kodex Publishing",
    "издателство",
    "българско издателство",
    "детски книги",
    "книги със смисъл",
    "Чудовището без уши",
  ],
  authors: [{ name: "Kodex Publishing" }],
  alternates: { canonical: "/" },
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
    title: "Kodex Publishing | Издателство за книги със смисъл",
    description:
      "Истории, детски книги и смислени издания, създадени с уважение към текста, формата и читателя.",
    url: "https://kodexbg.com/",
    images: [
      {
        url: "/assets/og-image.jpg",
        alt: "Корица на детската книга Чудовището без уши от Костантин Стамболов",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kodex Publishing | Издателство за книги със смисъл",
    description:
      "Българско издателство за книги с ясна мисъл, добра форма и дълъг живот.",
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
        <link rel="stylesheet" href="/assets/site-consent3.css" />
        {children}
      </body>
    </html>
  );
}
