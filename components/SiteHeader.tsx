import Link from 'next/link';
import MobileMenu from './MobileMenu';

export type NavItem = { href: string; label: string };

export default function SiteHeader({ name, items }: { name: string; items: NavItem[] }) {
  return (
    <>
      <header className="site-header">
        <Link href="/" className="site-header__brand">
          {name}
        </Link>
        <nav className="site-header__nav" aria-label="Main">
          {items.map((it) => (
            <Link key={it.href} href={it.href}>
              {it.label}
            </Link>
          ))}
        </nav>
      </header>
      <MobileMenu name={name} items={items} />
    </>
  );
}
