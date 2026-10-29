import Link from 'next/link';
import ContentsList, { type ContentsItem } from './ContentsList';
import { CATEGORY_LABEL, pad, type Project } from '@/lib/content';
import { imageUrl } from '@/lib/cloudinary';

/*
  The contents page. Every issue shows its own cover:
  a thumbnail on each row, and on desktop a large preview that changes
  as you hover or tab through the list.
*/
export default function Contents({
  projects,
  issueLabel,
  preview = true,
}: {
  projects: Project[];
  issueLabel: string;
  preview?: boolean;
}) {
  const items: ContentsItem[] = projects.map((p) => ({
    slug: p.slug,
    num: pad(p.issue),
    title: p.title,
    meta: [CATEGORY_LABEL[p.category], p.date].filter(Boolean).join(' · '),
    category: CATEGORY_LABEL[p.category],
    accent: p.cover.accent,
    thumb: p.cover.image ? imageUrl(p.cover.image, { w: 160, h: 214, crop: 'fill', gravity: 'auto' }) : '',
    large: p.cover.image ? imageUrl(p.cover.image, { w: 900 }) : '',
    published: p.publication?.name || '',
  }));

  return (
    <nav className="contents" aria-label="Contents">
      <header className="contents__head">
        <p className="label">{issueLabel} — In this issue</p>
        <h2 className="contents__title">Contents</h2>
      </header>
      <ContentsList items={items} preview={preview} />
      <div className="contents__foot">
        <Link href="/digitals" className="label link-line">
          Digitals &amp; Measurements
        </Link>
        <Link href="/agency" className="label link-line">
          Representation
        </Link>
      </div>
    </nav>
  );
}
