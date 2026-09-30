import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "../../../../components/SiteShell";
import {
  getResource,
  resourceDownloadPath,
} from "../../../../../lib/resources";

type Props = {
  params: Promise<{ slug: string; resourceSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, resourceSlug } = await params;
  const resource = getResource(slug, resourceSlug);
  if (!resource) return { title: "Материал" };

  return {
    title: resource.title,
    description: resource.description,
    robots: { index: false, follow: false },
    alternates: {
      canonical: `/books/${resource.bookSlug}/resources/${resource.slug}`,
    },
  };
}

export default async function BookResourcePage({ params }: Props) {
  const { slug, resourceSlug } = await params;
  const resource = getResource(slug, resourceSlug);
  if (!resource) notFound();

  return (
    <SiteShell>
      <main className="section" style={{ paddingTop: 48, paddingBottom: 72 }}>
        <p className="section-label">Безплатен материал</p>
        <h1 style={{ marginBottom: 12 }}>{resource.title}</h1>
        <p className="lead" style={{ maxWidth: 640, marginBottom: 28 }}>
          {resource.description}
        </p>
        <p style={{ color: "var(--ink-soft)", marginBottom: 28, maxWidth: 560 }}>
          Част от предстоящата книга „{resource.bookTitle}“. Можете да
          изтеглите PDF-а и да го разпечатате у дома.
        </p>
        <a
          className="button copper"
          href={resourceDownloadPath(resource)}
          data-cta="resource_download"
          data-book={resource.bookSlug}
          data-resource={resource.slug}
        >
          Изтеглете PDF
        </a>
        <p
          style={{
            marginTop: 18,
            fontSize: 14,
            color: "var(--ink-soft)",
            maxWidth: 480,
          }}
        >
          Засега файлът е временен placeholder. Скоро тук ще бъде истинската
          страница за оцветяване.
        </p>
      </main>
    </SiteShell>
  );
}
