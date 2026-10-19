import type { Metadata } from 'next';
import Link from 'next/link';
import CoverWall from '@/components/CoverWall';
import { CATEGORY_LABEL, getProjects, getSettings, type Project } from '@/lib/content';

export const metadata: Metadata = { title: 'Work' };

const FILTERS: (Project['category'] | 'all')[] = ['all', 'editorial', 'campaign', 'runway', 'shoot'];

export default async function WorkPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const [settings, all] = await Promise.all([getSettings(), getProjects()]);
  const active = FILTERS.includes(type as Project['category']) ? (type as Project['category']) : 'all';
  const projects = active === 'all' ? all : all.filter((p) => p.category === active);
  const present = new Set(all.map((p) => p.category));

  return (
    <section className="page page--flow archive">
      <header className="archive__head">
        <p className="label">Back issues</p>
        <h1 className="section-title">
          Work<em>, all issues</em>
        </h1>
        <nav className="filters" aria-label="Filter by type">
          {FILTERS.filter((f) => f === 'all' || present.has(f)).map((f) => (
            <Link key={f} href={f === 'all' ? '/work' : `/work?type=${f}`} aria-current={active === f ? 'page' : undefined}>
              {f === 'all' ? 'All' : CATEGORY_LABEL[f]}
            </Link>
          ))}
        </nav>
      </header>
      <CoverWall projects={projects} name={settings.name} />
    </section>
  );
}
