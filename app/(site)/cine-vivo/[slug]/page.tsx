import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Img from '@/components/Img';
import SpreadPages from '@/components/SpreadPages';
import { getScene, getScenes, getSettings, pad } from '@/lib/content';
import { listFolder } from '@/lib/cloudinary';
import { buildSpreads } from '@/lib/spreads';

export const revalidate = 300;

export async function generateStaticParams() {
  const scenes = await getScenes();
  return scenes.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = await getScene(slug);
  return s ? { title: `${s.title} — Cine Vivo`, description: s.concept } : {};
}

/*
  Each Cine Vivo scene is its own special edition: dark, cinematic,
  opening like a film title card, with its own accent color.
*/
export default async function ScenePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [s, settings] = await Promise.all([getScene(slug), getSettings()]);
  if (!s) notFound();

  const assets = await listFolder(s.folder);
  const spreads = buildSpreads(assets);

  return (
    <article className="stack cv" style={{ ['--accent' as string]: s.accent }}>
      <section className="page cv-title">
        {s.cover ? <Img id={s.cover} alt={s.title} className="cv-title__still" priority /> : null}
        <div className="cv-title__card">
          <p className="label">
            Cine Vivo — Scene {pad(s.number)}
            {s.date ? ` — ${s.date}` : ''}
          </p>
          <h1 className="cv-title__name">{s.title}</h1>
          {s.song ? (
            <p className="cv-title__song">
              ♪ {s.song}
              {s.artist ? <span> — {s.artist}</span> : null}
            </p>
          ) : null}
          {s.concept ? <p className="cv-title__concept">{s.concept}</p> : null}
        </div>
      </section>

      <SpreadPages spreads={spreads} folio={`Cine Vivo — Scene ${pad(s.number)}`} alt={`${settings.name} — ${s.title}`} caption={s.title} />

      <section className="page page--flow cv-roll">
        <p className="label">End credits</p>
        <dl>
          <div>
            <dt>Starring</dt>
            <dd>{settings.name}</dd>
          </div>
          {s.song ? (
            <div>
              <dt>Music</dt>
              <dd>
                {s.song}
                {s.artist ? ` — ${s.artist}` : ''}
              </dd>
            </div>
          ) : null}
          {s.credits
            .filter((c) => c.name)
            .map((c, i) => (
              <div key={i}>
                <dt>{c.role}</dt>
                <dd>{c.name}</dd>
              </div>
            ))}
        </dl>
        <Link href="/cine-vivo" className="label link-line">
          All scenes
        </Link>
      </section>
    </article>
  );
}
