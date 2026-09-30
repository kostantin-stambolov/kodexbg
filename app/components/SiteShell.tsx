import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

// Shared chrome for the main "site" pages (home, catalog, contact, legal).
// Loads the site theme and wraps content with the unified header/footer.
export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="/assets/site-consent3.css" />
      <div className="page">
        <div className="shell">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </div>
    </>
  );
}
