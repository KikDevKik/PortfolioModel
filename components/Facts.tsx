import Img from './Img';
import Barcode from './Barcode';
import type { Asset } from '@/lib/cloudinary';
import type { Settings } from '@/lib/content';

const ROWS: [keyof Settings['measurements'], string][] = [
  ['height', 'Height'],
  ['chest', 'Chest'],
  ['waist', 'Waist'],
  ['hips', 'Hips'],
  ['inseam', 'Inseam'],
  ['shoes', 'Shoes'],
  ['eyes', 'Eyes'],
  ['hair', 'Hair'],
  ['languages', 'Languages'],
];

export default function Facts({ settings, digitals }: { settings: Settings; digitals: Asset[] }) {
  const m = settings.measurements;
  return (
    <div className="facts">
      <header className="facts__head">
        <p className="label">The Facts</p>
        <h2 className="section-title">
          Digitals<em>, unretouched</em>
        </h2>
        {m.updated ? <p className="label muted">Updated {m.updated}</p> : null}
      </header>

      <div className="facts__body">
        <div className="facts__grid">
          {digitals.slice(0, 8).map((d, i) => (
            <figure key={d.id}>
              <Img id={d.id} alt={`${settings.name} — digital ${i + 1}`} sizes="(max-width: 900px) 50vw, 25vw" />
            </figure>
          ))}
        </div>

        <aside className="facts__card">
          <p className="facts__name">{settings.name}</p>
          <dl>
            {ROWS.filter(([k]) => m[k]).map(([k, label]) => (
              <div key={k}>
                <dt>{label}</dt>
                <dd>{m[k]}</dd>
              </div>
            ))}
          </dl>
          {m.barcode ? <Barcode value={m.barcode} /> : null}
          {settings.compCardUrl ? (
            <a className="button" href={settings.compCardUrl} target="_blank" rel="noopener noreferrer">
              Download comp card
            </a>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
