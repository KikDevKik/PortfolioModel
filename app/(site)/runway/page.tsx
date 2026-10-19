import type { Metadata } from 'next';
import CoverWall from '@/components/CoverWall';
import { getProjects, getSettings } from '@/lib/content';

export const metadata: Metadata = { title: 'Runway' };

export default async function RunwayPage() {
  const [settings, all] = await Promise.all([getSettings(), getProjects()]);
  const shows = all.filter((p) => p.category === 'runway');

  return (
    <section className="page page--flow page--dark archive">
      <header className="archive__head">
        <p className="label">Shows</p>
        <h1 className="section-title">
          Runway<em>, in motion</em>
        </h1>
      </header>
      <CoverWall projects={shows} name={settings.name} />
    </section>
  );
}
