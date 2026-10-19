'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { NavItem } from './SiteHeader';

export default function MobileMenu({ name, items }: { name: string; items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Close' : 'Menu'}
      </button>
      <div id="mobile-menu" className={`menu-panel${open ? ' is-open' : ''}`} hidden={!open}>
        <p className="label">{name}</p>
        <nav aria-label="Mobile">
          <Link href="/">Cover</Link>
          {items.map((it) => (
            <Link key={it.href} href={it.href}>
              {it.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
