import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookShelfItem } from "../../components/BookCards";
import JsonLd from "../../components/JsonLd";
import NewsletterCta from "../../components/NewsletterCta";
import SiteShell from "../../components/SiteShell";
import { authorPath, getAllAuthors, getAuthor, getBooksByAuthor } from "../../../lib/authors";
import { isUpcoming } from "../../../lib/catalog";
import { SITE_NAME, absoluteUrl, breadcrumbJsonLd, pageMetadata } from "../../../lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllAuthors().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = getAuthor((await params).slug);
  if (!author) return {};
  return pageMetadata({
    title: `${author.name} – автор`,
    description: `${author.name} – ${author.role.toLowerCase()} в ${SITE_NAME}. ${author.lead}`,
    path: authorPath(author.slug),
    shareTitle: `${author.name} | Автор в ${SITE_NAME}`,
    shareDescription: author.lead,
    type: "profile",
    image: { url: author.sharePhoto, width: 597, height: 597, alt: author.name },
  });
}

function plural(n: number, one: string, many: string) {
  return n === 1 ? one : many;
}

export default async function AuthorPage({ params }: Props) {
  const author = getAuthor((await params).slug);
  if (!author) notFound();

  const books = getBooksByAuthor(author.slug);
  const available = books.filter((b) => !isUpcoming(b)).length;
  const upcoming = books.length - available;
  const url = absoluteUrl(authorPath(author.slug));

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${url}#person`,
    name: author.name,
    url,
    image: absoluteUrl(author.sharePhoto),
    jobTitle: author.role,
    description: author.lead,
    worksFor: { "@id": `${absoluteUrl("/")}#organization`, "@type": "Organization", name: SITE_NAME },
  };

  return (
    <SiteShell>
      <JsonLd
        data={[
          personJsonLd,
          breadcrumbJsonLd([
            { name: "Начало", path: "/" },
            { name: "Автори", path: "/authors" },
            { name: author.name, path: authorPath(author.slug) },
          ]),
        ]}
      />
      <main className="author-page">
        <section className="author-hero">
          <div className="author-hero-photo">
            <img src={author.photo} alt={author.name} width={597} height={597} />
            <img
              className="author-hero-owl"
              src="/assets/books/chudovishtoto-bez-ushi/illustrations/owl.webp"
              alt=""
              aria-hidden="true"
            />
          </div>
          <div className="author-hero-copy">
            <p className="eyebrow">{author.role}</p>
            <h1>{author.name}</h1>
            <p className="lead">{author.lead}</p>
            {author.bio.map((p) => (
              <p key={p} className="author-bio">
                {p}
              </p>
            ))}
            <ul className="author-facts" aria-label="Книги на автора">
              {available > 0 && (
                <li>
                  <strong>{available}</strong>
                  {plural(available, "книга в продажба", "книги в продажба")}
                </li>
              )}
              {upcoming > 0 && (
                <li>
                  <strong>{upcoming}</strong>
                  {plural(upcoming, "предстояща", "предстоящи")}
                </li>
              )}
            </ul>
          </div>
        </section>

        <section className="author-books" aria-labelledby="author-books-title">
          <div className="section-head">
            <span className="section-label">Книги</span>
            <h2 id="author-books-title">На рафта и в работилницата.</h2>
          </div>
          <div className="publisher-shelf-grid">
            {books.map((book) => (
              <BookShelfItem key={book.slug} book={book} source="author" />
            ))}
          </div>
        </section>

        <NewsletterCta
          id="author-newsletter"
          kicker="Следващата история"
          title={`Разберете първи за новата книга на ${author.name.split(" ")[0]}.`}
          text="Пишем само когато има нова книга или нещо безплатно за четене и оцветяване. А още сега ще получите страница за оцветяване с Тоби."
          source={`author_${author.slug}`}
        />
      </main>
    </SiteShell>
  );
}
