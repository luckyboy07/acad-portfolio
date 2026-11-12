import { Fragment, useState } from "react";
import { Download, FileText } from "lucide-react";
import { external } from "../lib/links";
import logoManifest from "../assets/logo/web/manifest.json";

// Resized WebP copies of the logos in src/assets/logo (made by `npm run resize:logos`), with their sizes.
const webLogos = import.meta.glob("../assets/logo/web/*.webp", { eager: true, import: "default" });
const logo = (original) => {
  const entry = logoManifest[original];
  return entry && { src: webLogos[`../assets/logo/web/${entry.file}`], width: entry.width, height: entry.height };
};

// Publisher name (as written in publications.json) → original logo file name. Names without a logo fall back to text.
const publisherLogos = {
  "Al-Kindi": logo("Al-Kindi-logo.png"),
  Elsevier: logo("Elsevier-logo.webp"),
  IAES: logo("IAES-logo.png"),
  IOP: logo("IOP-logo.png"),
  "IGI Global": logo("IGI Global-logo.webp"),
  IPMU: logo("IPMU-logo.jpg"),
  KTU: logo("KTU-logo.jpg"),
  LUMAT: logo("LUMAT-logo.png"),
  OmniaScience: logo("OmniaScience-logo.png"),
  Sage: logo("Sage-logo.webp"),
  Springer: logo("Springer_logo.png"),
  "Taylor & Francis": logo("Taylor&Francis-logo.png"),
  UFMS: logo("UFMS-logo.webp"),
  "University of Helsinki": logo("University of Helsinki-logo.webp"),
  "University of Ljubljana": logo("University of Ljubljana-logo.png"),
  Wiley: logo("Wiley-logo.png"),
};

const LOGO_HEIGHT = 20;

// Google Drive "file/d/<id>/view" link → an image URL for its thumbnail.
const driveThumb = (url) => {
  const id = url?.match(/\/file\/d\/([^/]+)/)?.[1] ?? url?.match(/[?&]id=([^&]+)/)?.[1];
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w400` : url;
};

const linkClass =
  "text-[var(--color-accent-blue)] hover:text-[var(--color-accent-blue-hover)] hover:underline underline-offset-4";

// One publication.
//   variant="full"    (default) cover, publisher logos, DOI and Download PDF button — the Publications page.
//   variant="compact" tight text-only entry for lists, e.g. the home page.
// `headingLevel` lets a page nest the title under its own h2.
export default function PublicationCard({ item, headingLevel = 2, variant = "full" }) {
  const Heading = `h${headingLevel}`;
  const doiUrl = item.doi && `https://doi.org/${item.doi}`;

  const title = (
    <Heading
      className={`${variant === "compact" ? "text-base" : "text-base sm:text-lg"} font-semibold leading-snug text-gray-900 text-pretty`}
    >
      {doiUrl ? (
        <a
          href={doiUrl}
          {...external}
          className="hover:text-[var(--color-accent-blue)] transition-colors underline-offset-4 hover:underline"
        >
          {item.title}
        </a>
      ) : (
        item.title
      )}
    </Heading>
  );

  const badge = (
    <span className="mb-2 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
      {item.type}
    </span>
  );

  if (variant === "compact") {
    return (
      <article>
        {badge}
        {title}
        <Authors authors={item.authors} className="mt-1 text-sm" />
        <VenueYear item={item} className="mt-1 text-sm" />
        {(doiUrl || item.pdf) && (
          <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {doiUrl && (
              <a href={doiUrl} {...external} className={`${linkClass} break-all`}>
                DOI: {item.doi}
              </a>
            )}
            {item.pdf && (
              <a href={item.pdf} {...external} className={`${linkClass} inline-flex items-center gap-1 font-medium`}>
                <Download size={14} aria-hidden="true" />
                PDF
              </a>
            )}
          </p>
        )}
      </article>
    );
  }

  // Grid: the publisher logos sit in a third column on sm+ and drop under the text on phones,
  // so each logo is rendered once.
  return (
    <article className="group grid grid-cols-[auto_minmax(0,1fr)] sm:grid-cols-[auto_minmax(0,1fr)_auto] gap-x-4 sm:gap-x-6 md:gap-x-7 gap-y-3 rounded-xl border border-gray-200/80 bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md">
      <Cover item={item} className="row-span-2 sm:row-span-1" />

      <div className="min-w-0">
        {badge}
        {title}
        <Authors authors={item.authors} className="mt-1.5 text-sm" />
        <VenueYear item={item} className="mt-1.5 text-sm" />

        {doiUrl && (
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500 break-all">
            <img src="/DOI_logo.svg" alt="" width="18" height="18" className="h-[18px] w-[18px] shrink-0" />
            <a href={doiUrl} {...external} className={linkClass}>
              DOI: {item.doi}
            </a>
          </p>
        )}

        {item.pdf && (
          <a
            href={item.pdf}
            {...external}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-[var(--color-accent-blue)] px-3 py-1.5 text-sm font-medium text-[var(--color-accent-blue)] transition-colors hover:bg-[var(--color-accent-blue)]/10"
          >
            <Download size={15} aria-hidden="true" />
            Download PDF
          </a>
        )}
      </div>

      {item.publisher && (
        <Publishers
          names={item.publisher}
          className="col-start-2 sm:col-start-3 sm:row-start-1 flex flex-wrap sm:flex-col items-center sm:items-end gap-3 self-start"
        />
      )}
    </article>
  );
}

// "Venue · 2026"
function VenueYear({ item, className }) {
  return (
    <p className={`text-gray-600 ${className}`}>
      <em>{item.venue}</em>
      {item.year && <> · {item.year}</>}
    </p>
  );
}

// Author list with Dharel's name in bold; hidden while the publication has no authors yet.
function Authors({ authors, className }) {
  if (!authors?.length) return null;
  return (
    <p className={`text-gray-600 ${className}`}>
      {authors.map((name, i) => (
        <Fragment key={`${name}-${i}`}>
          {i > 0 && ", "}
          {/\bAcut\b/i.test(name) ? <strong className="font-semibold text-gray-900">{name}</strong> : name}
        </Fragment>
      ))}
    </p>
  );
}

// Publisher logos ("IPMU; IAES" → two logos), grayscale until the card is hovered; text for publishers without a logo.
function Publishers({ names, className }) {
  return (
    <p className={`text-sm text-gray-500 ${className}`}>
      {names.split(";").map((raw) => {
        const name = raw.trim();
        const img = publisherLogos[name];
        return img ? (
          <img
            key={name}
            src={img.src}
            alt={name}
            title={name}
            width={Math.round((img.width * LOGO_HEIGHT) / img.height)}
            height={LOGO_HEIGHT}
            loading="lazy"
            className="h-5 w-auto max-w-[132px] object-contain grayscale opacity-70 transition group-hover:grayscale-0 group-hover:opacity-100"
          />
        ) : (
          <span key={name}>{name}</span>
        );
      })}
    </p>
  );
}

// Front-page thumbnail; falls back to a plain placeholder when the image is missing or not public.
function Cover({ item, className = "" }) {
  const [failed, setFailed] = useState(false);
  const src = item.cover && driveThumb(item.cover);
  const hasImage = src && !failed;

  const image = hasImage ? (
    <img
      src={src}
      alt={`First page of "${item.title}"`}
      width={128}
      height={171}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  ) : (
    <span
      aria-hidden="true"
      className="flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-b from-slate-100 to-slate-200 p-2 text-center text-slate-400"
    >
      <FileText size={22} aria-hidden="true" />
      <span className="text-[10px] font-medium uppercase tracking-wide leading-tight line-clamp-3">{item.venue}</span>
    </span>
  );

  const boxClass = `block shrink-0 w-16 sm:w-28 md:w-32 aspect-[3/4] overflow-hidden rounded-md border border-gray-200 bg-gray-50 self-start ${className}`;

  // Same destination as the Download PDF button, so keep it out of the tab order;
  // the placeholder carries no information, so hide it from assistive tech.
  const hidden = hasImage ? undefined : true;
  return item.pdf ? (
    <a
      href={item.pdf}
      {...external}
      tabIndex={-1}
      aria-hidden={hidden}
      className={`${boxClass} hover:opacity-90 transition-opacity`}
    >
      {image}
    </a>
  ) : (
    <span aria-hidden={hidden} className={boxClass}>
      {image}
    </span>
  );
}
