import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Img from '@/components/Img';
import { getScenes, pad } from '@/lib/content';

export const metadata: Metadata = { title: 'Cine Vivo' };

export default async function CineVivoIndex() {
  const scenes = await getScenes();
  // Hidden until the first scene is published.
  if (!scenes.length) notFound();

  return (
    <section className="page page--flow page--dark cv-index">
      <header className="archive__head">
        <p className="label">Supplement</p>
        <h1 className="supplement__title">Cine Vivo</h1>
        <p className="supplement__lede">Songs turned into scenes. Outfits turned into characters.</p>
      </header>
      <ul className="cv-index__list">
        {scenes.map((s) => (
          <li key={s.slug} style={{ ['--accent' as string]: s.accent }}>
            <Link href={`/cine-vivo/${s.slug}`}>
              <div className="cv-index__still">
                {s.cover ? <Img id={s.cover} alt={s.title} sizes="(max-width: 760px) 100vw, 50vw" /> : null}
              </div>
              <span className="label">Scene {pad(s.number)}</span>
              <span className="supplement__name">{s.title}</span>
              {s.song ? (
                <span className="muted">
                  ♪ {s.song}
                  {s.artist ? ` — ${s.artist}` : ''}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
