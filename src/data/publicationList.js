// Publication sections from publications.json, with each item tagged with its singular type label
// so combined lists (the "All" tab, the home page) can badge every entry correctly.
import publications from "./publications.json";

// "Journal Articles" → "Journal Article"; "Conference Proceedings" stays plural.
const singular = (label) => label.replace(/s$/, "").replace(/Proceeding$/, "Proceedings");

export const publicationSections = publications.map((c) => ({
  ...c,
  items: c.items.map((item) => ({ ...item, type: singular(c.label) })),
}));

/** Every publication, newest first (stable sort keeps section order within a year). */
export const allPublications = publicationSections
  .flatMap((c) => c.items)
  .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

export const publicationsPath = (categoryId = publicationSections[0].id) => `/publications/${categoryId}`;
