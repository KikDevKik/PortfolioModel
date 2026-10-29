'use client';

import Link from 'next/link';
import { useState } from 'react';

export type ContentsItem = {
  slug: string;
  num: string;
  title: string;
  meta: string;
  category: string;
  accent: string;
  thumb: string;
  large: string;
  published: string;
};

export default function ContentsList({ items, preview }: { items: ContentsItem[]; preview: boolean }) {
  const [active, setActive] = useState(0);
  if (!items.length) return null;
  const current = items[active] ?? items[0];

  return (
    <div className={`contents__body${preview ? ' contents__body--preview' : ''}`} style={{ ['--accent' as string]: current.accent }}>
      <ol className="contents__list">
        {items.map((it, i) => (
          <li key={it.slug} style={{ ['--row-accent' as string]: it.accent }} data-active={i === active || undefined}>
            <Link
              href={`/work/${it.slug}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="contents__thumb" aria-hidden="true">
                {it.thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.thumb} alt="" width={80} height={107} loading="lazy" decoding="async" />
                ) : null}
              </span>
              <span className="contents__num">{it.num}</span>
              <span className="contents__text">
                <span className="contents__name">{it.title}</span>
                <span className="contents__cat">
                  {it.meta}
                  {it.published ? <em> — Published in {it.published}</em> : null}
                </span>
              </span>
              <span className="contents__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {preview ? (
        <Link href={`/work/${current.slug}`} className="contents__preview" tabIndex={-1} aria-hidden="true">
          {items.map((it, i) =>
            it.large ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={it.slug}
                src={it.large}
                alt=""
                width={900}
                height={1200}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                data-on={i === active || undefined}
              />
            ) : null
          )}
          <span className="contents__preview-num">Nº {current.num}</span>
          <span className="contents__preview-cap">
            <span className="label">{current.category}</span>
            <span>Open issue →</span>
          </span>
        </Link>
      ) : null}
    </div>
  );
}
