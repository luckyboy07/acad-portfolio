import { external } from "../lib/links";

const doiHref = (doi) => (doi.startsWith("http") ? doi : `https://doi.org/${doi}`);

// Title text, linked only when the paper has a landing page URL.
export function PaperTitle({ paper }) {
  if (!paper.url) return paper.title;
  return (
    <a
      href={paper.url}
      {...external}
      className="hover:text-[var(--color-accent-blue)] transition-colors underline-offset-4 hover:underline"
    >
      {paper.title}
    </a>
  );
}

// "PDF · DOI · Code · BibTeX", rendering only the links that exist.
export function PaperLinks({ paper, className = "" }) {
  const links = [
    paper.pdf && { label: "PDF", href: paper.pdf },
    paper.doi && { label: "DOI", href: doiHref(paper.doi) },
    paper.code && { label: "Code", href: paper.code },
    paper.bibtex && { label: "BibTeX", href: paper.bibtex },
  ].filter(Boolean);

  if (links.length === 0) return null;

  return (
    <p className={`text-sm text-gray-500 ${className}`}>
      {links.map((link, i) => (
        <span key={link.label}>
          {i > 0 && <span aria-hidden="true"> · </span>}
          <a
            href={link.href}
            {...external}
            className="font-medium text-[var(--color-accent-blue)] hover:text-[var(--color-accent-blue-hover)] hover:underline underline-offset-4"
          >
            {link.label}
          </a>
        </span>
      ))}
    </p>
  );
}
