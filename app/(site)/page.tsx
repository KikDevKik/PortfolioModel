import Link from 'next/link';
import Cover from '@/components/Cover';
import Contents from '@/components/Contents';
import Facts from '@/components/Facts';
import Masthead from '@/components/Masthead';
import Img from '@/components/Img';
import { getProjects, getScenes, getSettings, pad } from '@/lib/content';
import { listFolder } from '@/lib/cloudinary';

export const revalidate = 300;

export default async function Home() {
  const [settings, projects, scenes] = await Promise.all([getSettings(), getProjects(), getScenes()]);
  const digitals = await listFolder(settings.digitalsFolder, 6);
  const hc = settings.homeCover;

  return (
    <div className="stack">
      {/* 1 — The cover (with the contents beside it on desktop) */}
      <section className="page page--split" aria-label="Cover">
        <Cover
          name={settings.name}
          image={hc.image}
          cutout={hc.cutout}
          kicker={hc.kicker}
          coverLine={hc.coverLine}
          counterLine={hc.counterLine}
          accent={hc.accent}
          tone={hc.tone}
          barcode={settings.measurements.barcode}
          barcodeHref="/digitals"
          priority
          sizes="(max-width: 900px) 100vw, 75vh"
          className="cover--hero"
        />
        <div className="split__side desktop-only" style={{ ['--accent' as string]: hc.accent }}>
          <Contents projects={projects} issueLabel={hc.issueLabel} />
        </div>
      </section>

      {/* 2 — Contents as its own page on phones */}
      <section className="page page--flow mobile-only" aria-label="Contents">
        <Contents projects={projects} issueLabel={hc.issueLabel} preview={false} />
      </section>

      {/* 3 — Cine Vivo supplement (only once a scene is published) */}
      {scenes.length ? (
        <section className="page page--flow page--dark supplement" aria-label="Cine Vivo">
          <p className="label">Supplement</p>
          <h2 className="supplement__title">Cine Vivo</h2>
          <p className="supplement__lede">Songs turned into scenes. Outfits turned into characters.</p>
          <ul className="supplement__list">
            {scenes.map((s) => (
              <li key={s.slug}>
                <Link href={`/cine-vivo/${s.slug}`}>
                  {s.cover ? <Img id={s.cover} alt={s.title} sizes="(max-width: 760px) 100vw, 33vw" /> : null}
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
      ) : null}

      {/* 4 — Digitals & measurements */}
      <section className="page page--flow" id="digitals" aria-label="Digitals">
        <Facts settings={settings} digitals={digitals} />
      </section>

      {/* 5 — Representation */}
      <section className="page page--flow page--masthead" id="agency" aria-label="Representation">
        <Masthead settings={settings} />
      </section>
    </div>
  );
}
