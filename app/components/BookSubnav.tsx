"use client";

import { useEffect, useState } from "react";

export interface BookSubnavSection {
  id: string;
  label: string;
}

interface BookSubnavProps {
  title: string;
  cover: string;
  sections: BookSubnavSection[];
}

// Sticky in-page index for a book page; highlights the section in view.
export default function BookSubnav({ title, cover, sections }: BookSubnavProps) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        const first = sections.find((s) => visible.has(s.id));
        setActive(first ? first.id : null);
      },
      { rootMargin: "-80px 0px -55% 0px" }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="cb-subnav cb-band" aria-label={`Раздели: ${title}`}>
      <div className="cb-subnav-inner">
        <a className="cb-subnav-title" href="#top">
          <img src={cover} alt="" width={26} height={36} />
          {title}
        </a>
        <ul className="cb-subnav-links">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                data-cta={`subnav_${s.id}`}
                data-track-event="book_subnav_click"
                className={active === s.id ? "is-active" : undefined}
                aria-current={active === s.id ? "true" : undefined}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
