import type { Metadata } from 'next';
import Facts from '@/components/Facts';
import { getSettings } from '@/lib/content';
import { listFolder } from '@/lib/cloudinary';

export const metadata: Metadata = { title: 'Digitals' };
export const revalidate = 300;

export default async function DigitalsPage() {
  const settings = await getSettings();
  const digitals = await listFolder(settings.digitalsFolder, 6);
  return (
    <section className="page page--flow page--first">
      <Facts settings={settings} digitals={digitals} />
    </section>
  );
}
