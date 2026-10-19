import Img from './Img';
import Barcode from './Barcode';

export type CoverProps = {
  name: string; // professional name, e.g. "Deiner Trelles"
  image?: string;
  cutout?: string;
  issueLabel: string;
  date?: string;
  place?: string;
  kicker?: string;
  coverLine?: string;
  counterLine?: string;
  accent: string;
  tone: 'dark' | 'light';
  barcode?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/*
  The magazine cover. Layers, back to front:
  1. photo
  2. masthead (first name, huge)
  3. cutout of the same photo — when present, your head sits IN FRONT of the masthead
  4. issue details, side text, cover line, barcode
*/
export default function Cover(p: CoverProps) {
  const [first, ...rest] = p.name.trim().split(/\s+/);
  const surname = rest.join(' ');
  const hasImage = Boolean(p.image);

  return (
    <div
      className={`cover cover--${p.tone} ${p.className ?? ''}`}
      style={{ ['--accent' as string]: p.accent }}
    >
      {hasImage ? (
        <Img id={p.image!} alt={`${p.name} — cover`} className="cover__bg" priority={p.priority} sizes={p.sizes} />
      ) : (
        <div className="cover__bg cover__empty" aria-hidden="true">
          <span>Cover photo — set it in the editor</span>
        </div>
      )}

      <div className="cover__masthead" aria-hidden="true">
        <svg viewBox="0 0 1000 232">
          <text x="500" y="208" textAnchor="middle" textLength="1000" lengthAdjust="spacingAndGlyphs">
            {first.toUpperCase()}
          </text>
        </svg>
      </div>

      {p.cutout ? <Img id={p.cutout} alt="" className="cover__cut" priority={p.priority} sizes={p.sizes} /> : null}

      <div className="cover__overlay">
        {surname ? <p className="cover__surname">{surname}</p> : null}
        <p className="cover__meta">
          <span>{p.issueLabel}</span>
          {p.date ? <span>{p.date}</span> : null}
          {p.place ? <span>{p.place}</span> : null}
        </p>
        {p.kicker ? (
          <p className="cover__kicker">
            {p.kicker.split('\n').map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </p>
        ) : null}
        {p.coverLine ? (
          <h2 className="cover__line">
            <strong>{p.coverLine}</strong>
            {p.counterLine ? <em>{p.counterLine}</em> : null}
          </h2>
        ) : null}
        {p.barcode ? (
          <div className="cover__barcode">
            <Barcode value={p.barcode} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
