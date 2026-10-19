import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Cover from '@/components/Cover';
import SpreadPages from '@/components/SpreadPages';
import { CATEGORY_LABEL, getProject, getProjects, getSettings, pad, type Project } from '@/lib/content';
import { imageUrl, listFolder } from '@/lib/cloudinary';
import { buildSpreads } from '@/lib/spreads';

export const revalidate = 300;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return {};
  const og = p.cover.image ? imageUrl(p.cover.image, { w: 1200, h: 630, crop: 'fill', gravity: 'auto' }) : undefined;
  return {
    title: p.title,
    description: p.intro || `${CATEGORY_LABEL[p.category]}${p.client ? ` for ${p.client}` : ''}`,
    openGraph: og ? { images: [{ url: og, width: 1200, height: 630 }] } : undefined,
  };
}

function IssueInfo({ p }: { p: Project }) {
  const meta = [p.client, p.date, p.location].filter(Boolean);
  return (
    <div className="issue-info">
      <p className="label">
        Nº {pad(p.issue)} — {CATEGORY_LABEL[p.category]}
      </p>
      <h1 className="issue-info__title">{p.title}</h1>
      {meta.length ? <p className="issue-info__meta">{meta.join(' · ')}</p> : null}
      {p.intro ? <p className="issue-info__intro">{p.intro}</p> : null}
      {p.publication.name ? (
        <p className="issue-info__pub">
          <span className="label">Published in</span>
          {p.publication.url ? (
            <a href={p.publication.url} target="_blank" rel="noopener noreferrer">
              {p.publication.name} ↗
            </a>
          ) : (
            <span>{p.publication.name}</span>
          )}
        </p>
      ) : null}
      <p className="label muted issue-info__cue">Turn the page ↓</p>
    </div>
  );
}

export default async function IssuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [p, settings, all] = await Promise.all([getProject(slug), getSettings(), getProjects()]);
  if (!p) notFound();

  const assets = await listFolder(p.folder);
  const spreads = buildSpreads(assets);
  const idx = all.findIndex((x) => x.slug === p.slug);
  const next = all.length > 1 ? all[(idx + 1) % all.length] : null;
  const folio = `${settings.name} — Nº ${pad(p.issue)} — ${p.title}`;

  return (
    <article className="stack" style={{ ['--accent' as string]: p.cover.accent }}>
      <section className="page page--split" aria-label="Cover">
        <Cover
          name={settings.name}
          image={p.cover.image}
          cutout={p.cover.cutout}
          issueLabel={`Nº ${pad(p.issue)}`}
          date={p.date}
          place={CATEGORY_LABEL[p.category]}
          coverLine={p.cover.coverLine || p.title}
          counterLine={p.cover.counterLine}
          accent={p.cover.accent}
          tone={p.cover.tone}
          priority
          sizes="(max-width: 900px) 100vw, 75vh"
          className="cover--hero"
        />
        <div className="split__side desktop-only">
          <IssueInfo p={p} />
        </div>
      </section>

      <section className="page page--flow mobile-only">
        <IssueInfo p={p} />
      </section>

      <SpreadPages spreads={spreads} folio={folio} alt={`${settings.name} — ${p.title}`} caption={p.title} />

      <section className="page page--flow credits">
        <p className="label">Credits</p>
        <h2 className="section-title">
          {p.title}
          <em> — the team</em>
        </h2>
        <dl className="credits__list">
          <div>
            <dt>Model</dt>
            <dd>{settings.name}</dd>
          </div>
          {p.credits
            .filter((c) => c.name)
            .map((c, i) => (
              <div key={i}>
                <dt>{c.role}</dt>
                <dd>
                  {c.instagram ? (
                    <a href={`https://www.instagram.com/${c.instagram.replace(/^@/, '')}/`} target="_blank" rel="noopener noreferrer">
                      {c.name} <span className="muted">@{c.instagram.replace(/^@/, '')}</span>
                    </a>
                  ) : (
                    c.name
                  )}
                </dd>
              </div>
            ))}
        </dl>

        {next ? (
          <Link href={`/work/${next.slug}`} className="next-issue" style={{ ['--accent' as string]: next.cover.accent }}>
            <span className="label">Next issue — Nº {pad(next.issue)}</span>
            <span className="next-issue__title">{next.title} →</span>
          </Link>
        ) : null}
        <Link href="/work" className="label link-line">
          All issues
        </Link>
      </section>
    </article>
  );
}
