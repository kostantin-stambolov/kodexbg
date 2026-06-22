/** @type {import('next').NextConfig} */
const nextConfig = {
  // Railway runs `next start`, which binds to $PORT automatically.
  reactStrictMode: true,

  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/books.html", destination: "/books", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/terms.html", destination: "/terms", permanent: true },
      { source: "/privacy.html", destination: "/privacy", permanent: true },
      {
        source: "/books/chudovishtoto-bez-ushi.html",
        destination: "/books/chudovishtoto-bez-ushi",
        permanent: true,
      },
      {
        source: "/books/chudovishtoto-bez-ushi-offer.html",
        destination: "/books/chudovishtoto-bez-ushi",
        permanent: true,
      },
      {
        source: "/books/chudovishtoto-bez-ushi-offer-v2.html",
        destination: "/books/chudovishtoto-bez-ushi",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
