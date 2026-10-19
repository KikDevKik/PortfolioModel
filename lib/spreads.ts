import type { Asset } from './cloudinary';

/*
  Turns a folder of photos into magazine "spreads" (pages):
  - a horizontal photo  → full-bleed page
  - two vertical photos → facing pages (side by side; swipe on phones)
  - a vertical photo alone → single page, alternating left/right
  - videos              → full-screen looping page
  You never lay pages out by hand: the order of the file names decides.
*/

export type Spread =
  | { kind: 'full'; a: Asset }
  | { kind: 'pair'; a: Asset; b: Asset }
  | { kind: 'single'; a: Asset; side: 'left' | 'right' }
  | { kind: 'video'; a: Asset };

const isLandscape = (a: Asset) => a.width > a.height * 1.05;

export function buildSpreads(assets: Asset[]): Spread[] {
  const images = assets.filter((a) => a.type === 'image');
  const videos = assets.filter((a) => a.type === 'video');
  const out: Spread[] = [];
  let singles = 0;
  let i = 0;

  while (i < images.length) {
    const a = images[i];
    if (isLandscape(a)) {
      out.push({ kind: 'full', a });
      i += 1;
      continue;
    }
    const b = images[i + 1];
    if (b && !isLandscape(b)) {
      out.push({ kind: 'pair', a, b });
      i += 2;
    } else {
      out.push({ kind: 'single', a, side: singles++ % 2 === 0 ? 'left' : 'right' });
      i += 1;
    }
  }

  // Videos are woven in: the first after the first page, the rest spaced out.
  videos.forEach((v, idx) => {
    const at = Math.min(out.length, 1 + idx * 3);
    out.splice(at, 0, { kind: 'video', a: v });
  });

  return out;
}
