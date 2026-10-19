import type { Settings } from '@/lib/content';

const ig = (h: string) => `https://www.instagram.com/${h.replace(/^@/, '')}/`;

export default function Masthead({ settings }: { settings: Settings }) {
  const agencies = settings.agencies.filter((a) => a.name);
  return (
    <div className="masthead">
      <header>
        <p className="label">Masthead</p>
        <h2 className="section-title">
          Representation<em> &amp; contact</em>
        </h2>
      </header>

      <div className="masthead__cols">
        {agencies.map((a) => (
          <div key={a.name} className="masthead__col">
            <p className="label">{a.label}</p>
            <h3>{a.name}</h3>
            {a.city ? <p className="muted">{a.city}</p> : null}
            {a.contactName ? <p>{a.contactName}</p> : null}
            {a.email ? <a href={`mailto:${a.email}`}>{a.email}</a> : null}
            {a.phone ? <a href={`tel:${a.phone.replace(/[^+\d]/g, '')}`}>{a.phone}</a> : null}
            {a.instagram ? (
              <a href={ig(a.instagram)} target="_blank" rel="noopener noreferrer">
                @{a.instagram.replace(/^@/, '')}
              </a>
            ) : null}
          </div>
        ))}

        <div className="masthead__col">
          <p className="label">Direct — creative projects</p>
          <h3>{settings.name}</h3>
          {settings.contact.email ? <a href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a> : null}
          {settings.contact.instagram ? (
            <a href={ig(settings.contact.instagram)} target="_blank" rel="noopener noreferrer">
              @{settings.contact.instagram.replace(/^@/, '')}
            </a>
          ) : null}
        </div>
      </div>

      <p className="masthead__note">
        Bookings worldwide via the mother agency
        {agencies.length > 1 ? `; in ${agencies[1].label} via ${agencies[1].name}` : ''}.
      </p>
    </div>
  );
}
