import type { Metadata } from "next";
import SiteShell from "./components/SiteShell";

export const metadata: Metadata = {
  title: "Страницата не е намерена",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <SiteShell>
      <main>
        <section className="page-hero">
          <p className="eyebrow">404</p>
          <h1>Страницата не е намерена.</h1>
          <p className="lead">
            Изглежда търсите нещо, което вече не съществува или е преместено.
          </p>
          <div className="button-row">
            <a className="button" href="/">
              Към началната страница
            </a>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
