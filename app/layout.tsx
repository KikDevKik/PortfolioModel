import type { Metadata, Viewport } from 'next';
import { getSettings } from '@/lib/content';
import { imageUrl } from '@/lib/cloudinary';
import '@fontsource-variable/bodoni-moda/opsz.css';
import '@fontsource-variable/bodoni-moda/opsz-italic.css';
import '@fontsource-variable/inter';
import '@fontsource/anton';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const og = s.homeCover.image
    ? imageUrl(s.homeCover.image, { w: 1200, h: 630, crop: 'fill', gravity: 'auto' })
    : undefined;
  return {
    metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
    title: { default: `${s.name} — Model`, template: `%s — ${s.name}` },
    description: s.description,
    openGraph: {
      title: `${s.name} — Model`,
      description: s.description,
      type: 'website',
      images: og ? [{ url: og, width: 1200, height: 630 }] : undefined,
    },
    twitter: { card: 'summary_large_image' },
  };
}

export const viewport: Viewport = { themeColor: '#f5f3ee' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
