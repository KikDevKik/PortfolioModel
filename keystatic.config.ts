import { config, fields, collection, singleton } from '@keystatic/core';

/*
  This file defines the editing panel (yoursite.com/keystatic).
  Every field below becomes a form field in the panel.
  Photos and videos are NOT uploaded here — they live in Cloudinary.
  Here you only write texts, credits, order, and which Cloudinary folder to read.
*/

const cloudProject = process.env.NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT;

const hex = (label: string, defaultValue: string, description?: string) =>
  fields.text({
    label,
    defaultValue,
    description: description ?? 'Hex color, e.g. #c9a24a',
    validation: { pattern: { regex: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, message: 'Use a hex color like #c9a24a' } },
  });

const credits = fields.array(
  fields.object({
    role: fields.text({ label: 'Role', description: 'Photography, Styling, Brand, Creative direction…' }),
    name: fields.text({ label: 'Name' }),
    instagram: fields.text({ label: 'Instagram handle', description: 'Without @' }),
  }),
  { label: 'Credits', itemLabel: (p) => `${p.fields.role.value || 'Role'} — ${p.fields.name.value || 'Name'}` }
);

const coverFields = fields.object(
  {
    image: fields.text({
      label: 'Cover photo (Cloudinary public ID)',
      description: 'Copy the "Public ID" of the photo from Cloudinary. Vertical photo with space at the top for the masthead.',
    }),
    cutout: fields.text({
      label: 'Cutout (optional, Cloudinary public ID)',
      description: 'Same photo, same size, background removed (PNG). If set, your head goes IN FRONT of the masthead.',
    }),
    coverLine: fields.text({ label: 'Cover line', description: 'The big headline at the bottom of the cover.' }),
    counterLine: fields.text({ label: 'Counter line (italic)', description: 'Small italic line under the headline. Optional.' }),
    accent: hex('Accent color', '#c9a24a', 'Taken from the photo. Used for the headline and details.'),
    tone: fields.select({
      label: 'Masthead color',
      options: [
        { label: 'Black (light photos)', value: 'dark' },
        { label: 'White (dark photos)', value: 'light' },
      ],
      defaultValue: 'dark',
    }),
  },
  { label: 'Cover' }
);

export default config({
  storage: cloudProject ? { kind: 'cloud' } : { kind: 'local' },
  ...(cloudProject ? { cloud: { project: cloudProject } } : {}),
  ui: {
    brand: { name: 'Deiner Trelles — Editor' },
    navigation: {
      Site: ['settings'],
      Work: ['projects'],
      'Cine Vivo': ['cineVivo'],
    },
  },
  singletons: {
    settings: singleton({
      label: 'Site settings',
      path: 'content/settings',
      schema: {
        name: fields.text({ label: 'Professional name', defaultValue: 'Deiner Trelles' }),
        description: fields.text({
          label: 'Short description (Google + link previews)',
          multiline: true,
        }),
        homeCover: fields.object(
          {
            image: fields.text({ label: 'Cover photo (Cloudinary public ID)' }),
            cutout: fields.text({ label: 'Cutout (optional, Cloudinary public ID)' }),
            issueLabel: fields.text({ label: 'Issue label', defaultValue: 'Nº 01' }),
            date: fields.text({ label: 'Edition date', defaultValue: 'October 2026' }),
            kicker: fields.text({ label: 'Side text', multiline: true }),
            coverLine: fields.text({ label: 'Cover line' }),
            counterLine: fields.text({ label: 'Counter line (italic)' }),
            accent: hex('Accent color', '#c9a24a'),
            tone: fields.select({
              label: 'Masthead color',
              options: [
                { label: 'Black (light photos)', value: 'dark' },
                { label: 'White (dark photos)', value: 'light' },
              ],
              defaultValue: 'dark',
            }),
          },
          { label: 'Home cover' }
        ),
        measurements: fields.object(
          {
            height: fields.text({ label: 'Height' }),
            chest: fields.text({ label: 'Chest' }),
            waist: fields.text({ label: 'Waist' }),
            hips: fields.text({ label: 'Hips' }),
            inseam: fields.text({ label: 'Inseam' }),
            shoes: fields.text({ label: 'Shoes' }),
            eyes: fields.text({ label: 'Eyes' }),
            hair: fields.text({ label: 'Hair' }),
            languages: fields.text({ label: 'Languages' }),
            updated: fields.text({ label: 'Digitals updated', description: 'e.g. October 2026' }),
            barcode: fields.text({
              label: 'Barcode digits',
              description: 'The numbers hidden in the cover barcode.',
              defaultValue: '188 · 92 · 74 · 88 · 43',
            }),
          },
          { label: 'Measurements' }
        ),
        digitalsFolder: fields.text({ label: 'Digitals folder in Cloudinary', defaultValue: 'portfolio/digitals' }),
        compCardUrl: fields.text({ label: 'Comp card PDF link (optional)' }),
        agencies: fields.array(
          fields.object({
            label: fields.text({ label: 'Type', description: 'Mother Agency, Colombia, Japan…' }),
            name: fields.text({ label: 'Agency name' }),
            city: fields.text({ label: 'City' }),
            contactName: fields.text({ label: 'Booker / contact name' }),
            email: fields.text({ label: 'Email' }),
            phone: fields.text({ label: 'Phone' }),
            instagram: fields.text({ label: 'Instagram handle (without @)' }),
            flag: fields.select({
              label: 'Flag (card background)',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Brazil', value: 'br' },
                { label: 'Colombia', value: 'co' },
                { label: 'Japan', value: 'jp' },
                { label: 'France', value: 'fr' },
                { label: 'Italy', value: 'it' },
                { label: 'Germany', value: 'de' },
              ],
              defaultValue: 'none',
            }),
          }),
          { label: 'Representation', itemLabel: (p) => `${p.fields.label.value} — ${p.fields.name.value}` }
        ),
        contact: fields.object(
          {
            email: fields.text({ label: 'Personal email' }),
            instagram: fields.text({ label: 'Instagram handle (without @)' }),
          },
          { label: 'Direct contact (creative projects)' }
        ),
      },
    }),
  },
  collections: {
    projects: collection({
      label: 'Projects (issues)',
      slugField: 'title',
      path: 'content/projects/*',
      columns: ['issue', 'category'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        published: fields.checkbox({ label: 'Published', defaultValue: true }),
        issue: fields.integer({
          label: 'Issue number',
          description: 'Order of the issue. Higher number = more recent = shown first.',
          validation: { isRequired: true },
        }),
        category: fields.select({
          label: 'Type',
          options: [
            { label: 'Editorial', value: 'editorial' },
            { label: 'Campaign', value: 'campaign' },
            { label: 'Runway', value: 'runway' },
            { label: 'Shoot', value: 'shoot' },
          ],
          defaultValue: 'campaign',
        }),
        date: fields.text({ label: 'Date', description: 'e.g. June 2026' }),
        location: fields.text({ label: 'Location' }),
        client: fields.text({ label: 'Brand / magazine' }),
        folder: fields.text({
          label: 'Cloudinary folder',
          description: 'e.g. portfolio/work/2026-06_undergold-act-i — every photo/video in it appears automatically, sorted by file name.',
        }),
        cover: coverFields,
        intro: fields.text({ label: 'Intro text (short)', multiline: true }),
        publication: fields.object(
          {
            name: fields.text({ label: 'Published in' }),
            url: fields.text({ label: 'Link to the publication' }),
          },
          { label: 'Publication (only for published editorials)' }
        ),
        credits,
      },
    }),
    cineVivo: collection({
      label: 'Cine Vivo',
      slugField: 'title',
      path: 'content/cine-vivo/*',
      columns: ['number', 'published'],
      schema: {
        title: fields.slug({ name: { label: 'Scene title' } }),
        published: fields.checkbox({
          label: 'Published',
          description: 'The Cine Vivo section appears on the site only when at least one scene is published.',
          defaultValue: false,
        }),
        number: fields.integer({ label: 'Scene number', validation: { isRequired: true } }),
        song: fields.text({ label: 'Song' }),
        artist: fields.text({ label: 'Artist' }),
        concept: fields.text({ label: 'Concept', multiline: true }),
        folder: fields.text({ label: 'Cloudinary folder', description: 'e.g. portfolio/cine-vivo/01_count-me-out' }),
        cover: fields.text({ label: 'Poster still (Cloudinary public ID)' }),
        accent: hex('Accent color', '#d8d2c4'),
        date: fields.text({ label: 'Date' }),
        credits,
      },
    }),
  },
});
