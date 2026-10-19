import Link from 'next/link';
import { CATEGORY_LABEL, pad, type Project } from '@/lib/content';

export default function Contents({ projects, issueLabel }: { projects: Project[]; issueLabel: string }) {
  return (
    <nav className="contents" aria-label="Contents">
      <p className="label">{issueLabel} — In this issue</p>
      <h2 className="contents__title">Contents</h2>
      <ol className="contents__list">
        {projects.map((p) => (
          <li key={p.slug} style={{ ['--accent' as string]: p.cover.accent }}>
            <Link href={`/work/${p.slug}`}>
              <span className="contents__num">{pad(p.issue)}</span>
              <span className="contents__name">{p.title}</span>
              <span className="contents__cat">
                {CATEGORY_LABEL[p.category]}
                {p.date ? ` · ${p.date}` : ''}
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <div className="contents__foot">
        <Link href="/digitals" className="label link-line">
          Digitals &amp; measurements
        </Link>
        <Link href="/agency" className="label link-line">
          Representation
        </Link>
      </div>
    </nav>
  );
}
