import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

// Обвивка за страниците на книгите: темата за детски книги + общите
// header и footer.
export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="/assets/styles/childrens-book-theme.css" />
      <div className="cb-page">
        <div className="shell">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </div>
    </>
  );
}

export function BookHtml({ html }: { html: string }) {
  return <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: html }} />;
}
