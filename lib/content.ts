import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);

export type Credit = { role: string; name: string; instagram: string };

export type CoverData = {
  image: string;
  cutout: string;
  coverLine: string;
  counterLine: string;
  accent: string;
  tone: 'dark' | 'light';
};

export type Project = {
  slug: string;
  title: string;
  published: boolean;
  issue: number;
  category: 'editorial' | 'campaign' | 'runway' | 'shoot';
  date: string;
  location: string;
  client: string;
  folder: string;
  cover: CoverData;
  intro: string;
  publication: { name: string; url: string };
  credits: Credit[];
};

export type Scene = {
  slug: string;
  title: string;
  published: boolean;
  number: number;
  song: string;
  artist: string;
  concept: string;
  folder: string;
  cover: string;
  accent: string;
  date: string;
  credits: Credit[];
};

export const CATEGORY_LABEL: Record<Project['category'], string> = {
  editorial: 'Editorial',
  campaign: 'Campaign',
  runway: 'Runway',
  shoot: 'Shoot',
};

export async function getSettings() {
  return reader.singletons.settings.readOrThrow();
}
export type Settings = Awaited<ReturnType<typeof getSettings>>;

export async function getProjects(): Promise<Project[]> {
  const all = await reader.collections.projects.all();
  return all
    .map(({ slug, entry }) => ({ slug, ...entry, issue: entry.issue ?? 0 }) as Project)
    .filter((p) => p.published)
    .sort((a, b) => b.issue - a.issue);
}

export async function getProject(slug: string): Promise<Project | null> {
  const entry = await reader.collections.projects.read(slug);
  if (!entry || !entry.published) return null;
  return { slug, ...entry, issue: entry.issue ?? 0 } as Project;
}

export async function getScenes(): Promise<Scene[]> {
  const all = await reader.collections.cineVivo.all();
  return all
    .map(({ slug, entry }) => ({ slug, ...entry, number: entry.number ?? 0 }) as Scene)
    .filter((s) => s.published)
    .sort((a, b) => b.number - a.number);
}

export async function getScene(slug: string): Promise<Scene | null> {
  const entry = await reader.collections.cineVivo.read(slug);
  if (!entry || !entry.published) return null;
  return { slug, ...entry, number: entry.number ?? 0 } as Scene;
}

export function pad(n: number) {
  return String(n).padStart(2, '0');
}
