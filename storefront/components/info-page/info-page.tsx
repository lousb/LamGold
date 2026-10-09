import { Band } from "../wordmark/wordmark";
import s from "./info-page.module.css";
import { InfoPageData } from "./types";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));

const pad = (i: number) => String(i + 1).padStart(2, "0");

/**
 * Information Page (Desktop / Mobile designs).
 * Desktop: intro in columns 1-8, numbered sections in 9-16 (title in
 * column 10, group labels 10-12, lettered lists from 13), page title and
 * "Last updated" in 21-24. Intro and title stay in view while scrolling.
 * Mobile: title + date, intro, then the sections stacked.
 */
export function InfoPage({ page }: { page: InfoPageData }) {
  const sections = page.sections ?? [];

  return (
    <div className={s.page}>
      <div className={`grid ${s.layout}`}>
        <div className={s.meta}>
          <header className={s.metaInner}>
            <h1 className={s.title}>{page.title}</h1>
            {page.lastUpdated ? (
              <p>Last updated on {formatDate(page.lastUpdated)}</p>
            ) : null}
          </header>
        </div>

        {page.intro ? (
          <div className={s.introColumn}>
            <p className={s.intro}>{page.intro}</p>
          </div>
        ) : null}

        <div className={s.sections}>
          {sections.map((section, i) => (
            <section key={section._key ?? i} className={s.section}>
              <h2 className={s.sectionTitle}>
                <span className={s.number}>
                  <span className={s.desktopNumber}>{pad(i)}</span>
                  <span className={s.mobileNumber}>{pad(i)}.</span>
                </span>
                <span>{section.title}</span>
              </h2>
              {(section.groups ?? []).map((group, j) => (
                <div key={group._key ?? j} className={s.group}>
                  {group.label ? (
                    <p className={s.label}>{group.label}</p>
                  ) : null}
                  {group.items?.length ? (
                    <ol className={s.items} type="a">
                      {group.items.map((item, k) => (
                        <li key={k}>{item}</li>
                      ))}
                    </ol>
                  ) : null}
                </div>
              ))}
            </section>
          ))}
        </div>
      </div>

      <div className={`grid ${s.band}`}>
        <Band />
      </div>
    </div>
  );
}
