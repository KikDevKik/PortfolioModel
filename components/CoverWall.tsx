import Link from 'next/link';
import Cover from './Cover';
import { CATEGORY_LABEL, pad, type Project } from '@/lib/content';

/* "Back issues": every project shown as a small magazine cover, like a newsstand. */
export default function CoverWall({ projects, name }: { projects: Project[]; name: string }) {
  return (
    <ul className="wall">
      {projects.map((p) => (
        <li key={p.slug}>
          <Link href={`/work/${p.slug}`} className="wall__item">
            <Cover
              name={name}
              image={p.cover.image}
              cutout={p.cover.cutout}
              issueLabel={`Nº ${pad(p.issue)}`}
              date={p.date}
              coverLine={p.cover.coverLine || p.title}
              counterLine={p.cover.counterLine}
              accent={p.cover.accent}
              tone={p.cover.tone}
              sizes="(max-width: 760px) 50vw, 25vw"
              className="cover--small"
            />
            <span className="wall__caption">
              <span className="label">
                Nº {pad(p.issue)} — {CATEGORY_LABEL[p.category]}
              </span>
              <span className="wall__title">{p.title}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
