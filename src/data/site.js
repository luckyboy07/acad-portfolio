// @ts-check
// Single source of truth for all site content.
// Anything marked `TODO(content)` is placeholder/template data that must be
// replaced with Dharel's real information before publishing.

/**
 * @typedef {Object} Profile
 * @property {string} name
 * @property {string} title
 * @property {string} institution
 * @property {string} department
 * @property {string} bio
 * @property {string} email
 * @property {string | null} office      Room / building. Rendered only when set.
 * @property {string | null} cvPdf       Path to a PDF in /public (e.g. "/cv.pdf"). Download button hidden when null.
 * @property {{ twitter?: string, scholar?: string, github?: string }} socials  Each link is rendered only when its URL is set.
 */

/**
 * @typedef {Object} Paper
 * @property {number} id
 * @property {string} title
 * @property {string} authors
 * @property {number} year
 * @property {string} venue        Full venue label, rendered as-is (e.g. "ACL 2024").
 * @property {string} description
 * @property {string} [url]        Landing page for the paper; title links here when set.
 * @property {string} [pdf]        PDF URL.
 * @property {string} [doi]        Bare DOI ("10.18653/v1/...") or full https://doi.org URL.
 * @property {string} [code]       Code repository URL.
 * @property {string} [bibtex]     URL to a .bib file (e.g. "/bib/acut2024.bib" in /public).
 */

/**
 * @typedef {Object} Course
 * @property {number} id
 * @property {string} courseCode
 * @property {string} title
 * @property {string} semester
 * @property {string} description
 */

/**
 * @typedef {Object} CvEntry
 * @property {string} title
 * @property {string} org
 * @property {string} period
 * @property {string} [note]
 */

/**
 * @typedef {Object} Presentation
 * @property {number} id
 * @property {string} title
 * @property {string} venue
 * @property {number} year
 */

/**
 * @typedef {Object} HeroSlide
 * @property {number} id
 * @property {string} image
 * @property {string} caption
 */

/** @type {Profile} */
export const profile = {
  name: "Dharel P. Acut",
  title: "Assistant Professor of Computer Science",
  institution: "University of the Philippines Diliman",
  department: "Department of Computer Science",
  // TODO(content): replace with Dharel's real bio (current text is template copy about NLP / cognitive linguistics).
  bio: "I research the intersection of natural language processing and cognitive linguistics. My work focuses on how machines can better understand the nuanced, contextual meaning of human language across different cultures.",
  email: "dharelacut@gmail.com",
  // TODO(content): replace with Dharel's real office room/building ("Room 404, Exactum Building" is template data). Set to null to hide.
  office: "Room 404, Exactum Building",
  // TODO(content): add Dharel's CV as public/cv.pdf, then set this to "/cv.pdf".
  cvPdf: null,
  socials: {
    // TODO(content): add Dharel's real profile URLs (Twitter/X, Google Scholar, GitHub). Empty ones are hidden.
    twitter: "",
    scholar: "",
    github: "",
  },
};

/** Short page intros, kept here so all copy lives in one place. */
export const pageIntros = {
  // TODO(content): replace with Dharel's real research summary (mentions template research areas).
  papers:
    "A collection of my recent academic work, centered on natural language processing, morphology, and cognitively-motivated computational models.",
  // TODO(content): confirm the teaching focus (the institution is filled in from profile.institution).
  courses: "focusing on foundations and advanced topics in computational linguistics.",
  // TODO(content): confirm Dharel's collaboration interests.
  contact:
    "I'm always open to discussing research collaborations, sharing ideas on NLP and linguistics, or exploring new opportunities.",
};

// TODO(content): replace with Dharel's real highlight photos and captions.
// Current images are placehold.co placeholders and the captions are from the template.
// Put real images in /public (e.g. "/hero/keynote.jpg"), ideally ~1600×600 and < 300 KB.
/** @type {HeroSlide[]} */
export const heroSlides = [
  { id: 1, image: "https://placehold.co/1200x400/e2e8f0/64748b?text=Conference+Presentation", caption: "Keynote at ACL 2024" },
  { id: 2, image: "https://placehold.co/1200x400/cbd5e1/475569?text=Field+Research", caption: "Field Research in Finland" },
  { id: 3, image: "https://placehold.co/1200x400/e2e8f0/64748b?text=Lab+Team", caption: "Lab Team Retreat" },
];

// TODO(content): replace ALL papers with Dharel's real publications.
// Every entry below is template data authored by "Jane Eriksson" et al. on Finnish/Uralic topics.
// Optional link fields: url, pdf, doi, code, bibtex — only the ones you set are shown.
/** @type {Paper[]} */
export const papers = [
  {
    id: 1,
    title: "Contextual Embeddings for Low-Resource Uralic Languages",
    authors: "Jane Eriksson, M. Virtanen",
    year: 2024,
    venue: "ACL 2024",
    description: "A novel approach to training contextual embeddings using bilingual dictionary constraints to improve performance on low-resource Uralic languages.",
  },
  {
    id: 2,
    title: "Syntactic Parsing as a Cognitive Model of Reading Constraints",
    authors: "T. Korhonen, Jane Eriksson",
    year: 2023,
    venue: "Cognitive Science",
    description: "Investigating whether modern dependency parsers capture the reading time constraints observed in human subjects reading complex Finnish texts.",
  },
  {
    id: 3,
    title: "Zero-Shot Cross-Lingual Transfer in Dialog Systems",
    authors: "Jane Eriksson, S. Ahmed, P. Davis",
    year: 2023,
    venue: "EMNLP 2023",
    description: "Evaluating zero-shot transfer capabilities of large language models on task-oriented dialog datasets in 15 previously unseen languages.",
  },
  {
    id: 4,
    title: "Beyond BLEU: Semantic Evaluation Metrics for Morphologically Rich Languages",
    authors: "Jane Eriksson, K. Laine",
    year: 2022,
    venue: "NAACL 2022",
    description: "Proposing a new semantic textual similarity metric that correlates better with human judgment for highly agglutinative languages.",
  },
  {
    id: 5,
    title: "Historical Corpora Construction via Optical Character Recognition",
    authors: "A. Niemi, Jane Eriksson",
    year: 2021,
    venue: "LREC 2021",
    description: "A pipeline for extracting and cleaning text from 19th-century Finnish newspapers for linguistic analysis.",
  },
  {
    id: 6,
    title: "The Role of Prosody in Disambiguating Spoken Instructions",
    authors: "Jane Eriksson",
    year: 2020,
    venue: "Interspeech 2020",
    description: "Analyzing the role of pitch and duration in resolving syntactic ambiguities in spoken multi-modal tasks.",
  },
];

// TODO(content): replace with Dharel's real courses at UP Diliman (codes, titles, semesters are template data).
/** @type {Course[]} */
export const courses = [
  {
    id: 1,
    courseCode: "COMP-LING-401",
    title: "Introduction to Natural Language Processing",
    semester: "Fall 2024",
    description: "Fundamentals of NLP, including text processing, linguistic structure, sequence modeling, and an introduction to neural network approaches.",
  },
  {
    id: 2,
    courseCode: "COMP-LING-550",
    title: "Advanced Deep Learning for Text",
    semester: "Spring 2024",
    description: "Seminar-style course focusing on transformer architectures, fine-tuning large language models, and alignment techniques.",
  },
  {
    id: 3,
    courseCode: "COGS-302",
    title: "Language and Cognition",
    semester: "Fall 2023",
    description: "An interdisciplinary look at how language shapes thought, covering psycholinguistics, sentence processing, and computational models of cognition.",
  },
  {
    id: 4,
    courseCode: "COMP-LING-600",
    title: "Semantic Representation in AI Systems",
    semester: "Spring 2023",
    description: "Graduate seminar evaluating classical symbolic representations versus distributed representations, and their unification.",
  },
];

export const cv = {
  // TODO(content): replace with Dharel's real education (Stanford Ph.D. and University of Turku B.A. are template data).
  /** @type {CvEntry[]} */
  education: [
    {
      title: "Ph.D. in Computational Linguistics",
      org: "Stanford University",
      period: "2016 — 2020",
      note: 'Dissertation: "Cognitively Plausible Parsing Strategies in Neural Network Models"',
    },
    {
      title: "B.A. in Linguistics and Computer Science",
      org: "University of Turku",
      period: "2012 — 2016",
    },
  ],
  // TODO(content): replace with Dharel's real appointments ("Associate Professor, University of Helsinki" and the MIT postdoc are template data).
  /** @type {CvEntry[]} */
  appointments: [
    {
      title: "Associate Professor",
      org: "Department of Computer Science, University of Helsinki",
      period: "2023 — Present",
    },
    {
      title: "Postdoctoral Researcher",
      org: "Massachusetts Institute of Technology (MIT)",
      period: "2020 — 2023",
    },
  ],
  // TODO(content): replace with Dharel's real invited talks (these are template data).
  /** @type {Presentation[]} */
  presentations: [
    { id: 1, title: "Keynote: The Future of Multilingual LLMs", venue: "Nordic NLP Symposium", year: 2024 },
    { id: 2, title: "Invited Talk: Computational Modeling of Finnic Languages", venue: "Stanford NLP Seminar", year: 2023 },
  ],
};

/** Papers sorted newest first; used by Home, Papers and CV. */
export const papersByYear = [...papers].sort((a, b) => b.year - a.year);

/** Builds a document title for a sub-page. */
export const pageTitle = (/** @type {string} */ page) => `${page} · ${profile.name}`;
