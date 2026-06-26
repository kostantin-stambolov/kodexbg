import type { Metadata } from "next";
import SiteShell from "../../components/SiteShell";

const AUTHOR_PHOTO =
  "/assets/books/chudovishtoto-bez-ushi/illustrations/kostantin-stambolov.webp";

export const metadata: Metadata = {
  title: "Костантин Стамболов – автор",
  description:
    "Костантин Стамболов е автор на детски книги за Kodex Publishing – истории за малки и пораснали читатели за доброта, различност и нуждата да бъдем разбрани.",
  alternates: { canonical: "/author/kostantin-stambolov" },
  openGraph: {
    type: "profile",
    url: "https://kodexbg.com/author/kostantin-stambolov",
    title: "Костантин Стамболов | Автор в Kodex Publishing",
    description:
      "Автор на детски истории за малки и пораснали читатели.",
    images: [{ url: AUTHOR_PHOTO, alt: "Костантин Стамболов" }],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Костантин Стамболов",
  url: "https://kodexbg.com/author/kostantin-stambolov",
  image: `https://kodexbg.com${AUTHOR_PHOTO}`,
  jobTitle: "Автор на детски книги",
  worksFor: { "@type": "Organization", name: "Kodex Publishing" },
  description:
    "Автор на детски истории за малки и пораснали читатели за доброта, различност и нуждата да бъдем разбрани.",
};

interface Work {
  title: string;
  href: string;
  status: "available" | "upcoming";
  year: string;
  summary: string;
  cta: string;
}

const works: Work[] = [
  {
    title: "Чудовището без уши",
    href: "/books/chudovishtoto-bez-ushi",
    status: "available",
    year: "2026",
    summary:
      "Приказка за малки и пораснали деца за доброта, различност и силата на историите да стигат до онзи, който има най-голяма нужда от тях. История за добродушно чудовище, което слуша приказки, докато една фея не открива защо стои само в тъмното.",
    cta: "Виж книгата",
  },
  {
    title: "Тоби и силата на миялната",
    href: "/tobi",
    status: "upcoming",
    year: "Очаквайте",
    summary:
      "Втората детска книга на автора, в момента в разработка. Нова история и нови герои, със същото внимание към топлината и момента преди сън.",
    cta: "Научи повече",
  },
];

export default function AuthorPage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <main className="author-page">
        <section className="author-hero">
          <div className="author-hero-photo">
            <img src={AUTHOR_PHOTO} alt="Костантин Стамболов" />
          </div>
          <div className="author-hero-copy">
            <p className="eyebrow">Автор</p>
            <h1>Костантин Стамболов</h1>
            <p className="lead">
              Автор на детски истории за малки и пораснали читатели – с внимание
              към тихите чувства, различността и нуждата да бъдем разбрани.
            </p>
            <p className="author-bio">
              Пише книги, които събират семейството около една история и оставят
              повод за разговор след последната страница. Автор и редактор на
              „Чудовището без уши“ за Kodex Publishing.
            </p>
          </div>
        </section>

        <section className="author-works" aria-labelledby="author-works-title">
          <div className="section-head">
            <span className="section-label">Произведения</span>
            <h2 id="author-works-title">Книги от Костантин Стамболов.</h2>
            <p>Налични издания и заглавия, по които работи в момента.</p>
          </div>

          <div className="author-work-list">
            {works.map((work) => (
              <details
                key={work.href}
                className="author-work"
                open={work.status === "available"}
              >
                <summary>
                  <span className="author-work-title">{work.title}</span>
                  <span
                    className={`author-work-status${
                      work.status === "upcoming" ? " is-upcoming" : ""
                    }`}
                  >
                    {work.status === "available" ? "В продажба" : "Очаквайте"}
                  </span>
                  <span className="author-work-year">{work.year}</span>
                  <span className="author-work-toggle" aria-hidden="true" />
                </summary>
                <div className="author-work-body">
                  <p>{work.summary}</p>
                  <a
                    className={`button${
                      work.status === "upcoming" ? " secondary" : " copper"
                    }`}
                    href={work.href}
                    data-cta="author_work"
                    data-book={work.href.replace("/books/", "").replace("/", "")}
                    data-track-event="author_work_click"
                  >
                    {work.cta}
                  </a>
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
