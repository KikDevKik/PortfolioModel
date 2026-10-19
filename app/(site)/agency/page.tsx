import type { Metadata } from 'next';
import Masthead from '@/components/Masthead';
import { getSettings } from '@/lib/content';

export const metadata: Metadata = { title: 'Representation' };

export default async function AgencyPage() {
  const settings = await getSettings();
  return (
    <section className="page page--flow page--masthead page--first">
      <Masthead settings={settings} />
    </section>
  );
}
