import type { Metadata } from "next";
import SiteShell from "../components/SiteShell";

export const metadata: Metadata = {
  title: "Поръчката е отказана",
  robots: { index: false, follow: false },
};

export default function CancelPage() {
  return (
    <SiteShell>
      <main className="page-hero">
        <p className="eyebrow">Плащане</p>
        <h1>Поръчката е отказана</h1>
        <p className="lead">
          Плащането не е завършено и не сте таксувани. Можете да опитате
          отново по всяко време.
        </p>
        <div className="button-row">
          <a className="button copper" href="/books/chudovishtoto-bez-ushi#pricing">
            Обратно към книгата
          </a>
        </div>
      </main>
    </SiteShell>
  );
}
