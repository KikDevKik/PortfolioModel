import Img from './Img';
import { videoPoster, videoUrl } from '@/lib/cloudinary';
import type { Spread } from '@/lib/spreads';

/* Renders magazine spreads; each one is a full-screen "page" that stacks over the previous. */
export default function SpreadPages({
  spreads,
  folio,
  alt,
  caption,
  startPage = 2,
}: {
  spreads: Spread[];
  folio: string;
  alt: string;
  caption: string;
  startPage?: number;
}) {
  return (
    <>
      {spreads.map((s, i) => {
        const page = startPage + i;
        const Folio = (
          <p className="folio" aria-hidden="true">
            <span>{folio}</span>
            <span>{String(page).padStart(2, '0')}</span>
          </p>
        );

        if (s.kind === 'full') {
          return (
            <section key={i} className="page spread spread--full">
              <Img id={s.a.id} alt={alt} className="spread__bleed" />
              {Folio}
            </section>
          );
        }
        if (s.kind === 'video') {
          const src = videoUrl(s.a.id);
          return (
            <section key={i} className="page spread spread--video">
              {src ? (
                <video src={src} poster={videoPoster(s.a.id)} autoPlay muted loop playsInline preload="metadata" />
              ) : null}
              {Folio}
            </section>
          );
        }
        if (s.kind === 'pair') {
          return (
            <section key={i} className="page spread spread--pair">
              <div className="spread__track">
                <figure>
                  <Img id={s.a.id} alt={alt} className="spread__fit" sizes="(max-width: 760px) 100vw, 50vw" />
                </figure>
                <figure>
                  <Img id={s.b.id} alt={alt} className="spread__fit" sizes="(max-width: 760px) 100vw, 50vw" />
                </figure>
              </div>
              {Folio}
            </section>
          );
        }
        return (
          <section key={i} className={`page spread spread--single spread--${s.side}`}>
            <figure>
              <Img id={s.a.id} alt={alt} className="spread__fit" sizes="(max-width: 760px) 100vw, 50vw" />
            </figure>
            <div className="spread__aside" aria-hidden="true">
              <span className="spread__pagenum">{String(page).padStart(2, '0')}</span>
              <span className="spread__caption">{caption}</span>
            </div>
            {Folio}
          </section>
        );
      })}
    </>
  );
}
