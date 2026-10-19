import { v2 as cloudinary } from 'cloudinary';

/*
  Cloudinary connection.
  - Photos/videos are listed automatically from a folder (sorted by file name).
  - Files whose name ends in "_cover" or "_cover-cutout" are skipped inside the
    issue pages, so the cover photo is not repeated.
  - Without the environment variables the site runs in DEMO mode with grey
    placeholders, so it always builds.
*/

export const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const API_KEY = process.env.CLOUDINARY_API_KEY || '';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || '';

export const hasCloudinary = Boolean(CLOUD_NAME && API_KEY && API_SECRET);

export type Asset = {
  id: string; // Cloudinary public ID, or "demo:..." for placeholders
  type: 'image' | 'video';
  width: number;
  height: number;
  name: string;
};

const SKIP = /_cover(-cutout)?$/i;

type Resource = {
  public_id: string;
  resource_type: string;
  width?: number;
  height?: number;
  display_name?: string;
  filename?: string;
};

async function search(expression: string): Promise<Resource[]> {
  const res = await cloudinary.search.expression(expression).sort_by('public_id', 'asc').max_results(500).execute();
  return (res?.resources ?? []) as Resource[];
}

export async function listFolder(folder: string | undefined | null, demoCount = 7): Promise<Asset[]> {
  if (!folder) return [];
  if (!hasCloudinary) return demoAssets(folder, demoCount);

  cloudinary.config({ cloud_name: CLOUD_NAME, api_key: API_KEY, api_secret: API_SECRET, secure: true });

  let resources: Resource[] = [];
  try {
    // Newer accounts ("dynamic folders") use asset_folder; older ones use folder.
    resources = await search(`asset_folder="${folder}"`);
    if (!resources.length) resources = await search(`folder="${folder}"`);
  } catch (err) {
    console.error(`[cloudinary] could not list "${folder}"`, err);
    return [];
  }

  return resources
    .map((r) => ({
      id: r.public_id,
      type: (r.resource_type === 'video' ? 'video' : 'image') as Asset['type'],
      width: r.width ?? 1200,
      height: r.height ?? 1600,
      name: r.display_name || r.filename || r.public_id.split('/').pop() || r.public_id,
    }))
    .filter((a) => !SKIP.test(a.name) && !SKIP.test(a.id))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}

/* ---------- URLs ---------- */

export function imageUrl(id: string, opts: { w?: number; h?: number; crop?: 'fill' | 'limit'; gravity?: string } = {}) {
  if (!id) return '';
  if (/^(https?:)?\//.test(id)) return id; // a full URL or a file in /public is used as-is
  if (id.startsWith('demo:') || !CLOUD_NAME) return placeholderFor(id, opts.w, opts.h);
  const t = ['f_auto', 'q_auto', opts.w && `w_${opts.w}`, opts.h && `h_${opts.h}`, opts.crop && `c_${opts.crop}`, opts.gravity && `g_${opts.gravity}`]
    .filter(Boolean)
    .join(',');
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${t}/${encodePath(id)}`;
}

export function srcSet(id: string, widths = [640, 1080, 1600, 2400]) {
  if (!id || id.startsWith('demo:') || !CLOUD_NAME || /^(https?:)?\//.test(id)) return undefined;
  return widths.map((w) => `${imageUrl(id, { w })} ${w}w`).join(', ');
}

export function videoUrl(id: string) {
  if (!CLOUD_NAME || id.startsWith('demo:')) return '';
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/f_auto,q_auto,w_1920,c_limit/${encodePath(id)}`;
}

export function videoPoster(id: string) {
  if (!CLOUD_NAME || id.startsWith('demo:')) return placeholderFor(id, 1600, 900);
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_0,f_jpg,q_auto,w_1600/${encodePath(id)}.jpg`;
}

function encodePath(id: string) {
  return id.split('/').map(encodeURIComponent).join('/');
}

/* ---------- Demo placeholders ---------- */

const DEMO_SHAPES: [number, number][] = [
  [1200, 1600],
  [1200, 1600],
  [1800, 1200],
  [1200, 1600],
  [1200, 1500],
  [1200, 1600],
  [1800, 1200],
  [1200, 1600],
];

function demoAssets(folder: string, count: number): Asset[] {
  return Array.from({ length: count }, (_, i) => {
    const [w, h] = DEMO_SHAPES[i % DEMO_SHAPES.length];
    const n = String(i + 1).padStart(2, '0');
    return { id: `demo:${folder.split('/').pop()}_${n}:${w}x${h}`, type: 'image' as const, width: w, height: h, name: n };
  });
}

function placeholderFor(id: string, w?: number, h?: number) {
  const m = /:(\d+)x(\d+)$/.exec(id);
  const width = m ? Number(m[1]) : w || 1200;
  const height = m ? Number(m[2]) : h || 1600;
  const label = id.startsWith('demo:') ? id.slice(5).replace(/:\d+x\d+$/, '') : id || 'photo';
  return placeholder(width, height, label);
}

export function placeholder(width: number, height: number, label: string, tone = '#d8d4cb') {
  const fs = Math.round(Math.min(width, height) / 22);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'><rect width='100%' height='100%' fill='${tone}'/><g fill='#0b0b0b' fill-opacity='.38' font-family='monospace' text-anchor='middle'><text x='50%' y='50%' font-size='${fs}'>${escapeXml(label)}</text><text x='50%' y='${50 + (fs / height) * 160}%' font-size='${Math.round(fs * 0.55)}'>upload to Cloudinary</text></g></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c] as string);
}
