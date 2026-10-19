import SiteHeader, { type NavItem } from '@/components/SiteHeader';
import { getScenes, getSettings } from '@/lib/content';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, scenes] = await Promise.all([getSettings(), getScenes()]);

  const items: NavItem[] = [
    { href: '/work', label: 'Work' },
    { href: '/runway', label: 'Runway' },
    { href: '/digitals', label: 'Digitals' },
    // Cine Vivo appears by itself as soon as one scene is published.
    ...(scenes.length ? [{ href: '/cine-vivo', label: 'Cine Vivo' }] : []),
    { href: '/agency', label: 'Agency' },
  ];

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader name={settings.name} items={items} />
      <main id="main">{children}</main>
    </>
  );
}
