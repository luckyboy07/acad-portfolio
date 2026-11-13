import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Mail, MapPin } from "lucide-react";
import { profile, about, homeStats } from "../data/site";
import { allPublications, publicationsPath } from "../data/publicationList";
import PublicationCard from "../components/PublicationCard";
import ProfileLinks from "../components/ProfileLinks";
import Email from "../components/Email";
import { external } from "../lib/links";
import { useEntrance } from "../lib/motion";

const RECENT_COUNT = 5;

const sectionHeading = "flex items-baseline justify-between gap-4 border-b border-gray-200 pb-3 mb-6";
const sectionLink =
  "shrink-0 text-sm font-medium text-[var(--color-accent-blue)] hover:text-[var(--color-accent-blue-hover)] hover:underline underline-offset-4";
const primaryButton =
  "bg-[var(--color-accent-blue)] text-white px-6 py-3 rounded-full font-medium text-sm transition hover:bg-[var(--color-accent-blue-hover)] hover:scale-[1.02] active:scale-[0.98] motion-reduce:transform-none inline-flex items-center gap-2 shadow-sm";
const secondaryButton =
  "px-6 py-3 rounded-full font-medium text-sm border border-gray-300 text-gray-700 transition-colors hover:border-[var(--color-accent-blue)] hover:text-[var(--color-accent-blue)] inline-flex items-center gap-2";

export default function Home() {
  const entrance = useEntrance();
  const recent = allPublications.slice(0, RECENT_COUNT);

  return (
    <div className="w-full flex flex-col items-center mt-6 md:mt-8">
      <title>{`${profile.name} — ${profile.title}`}</title>

      <Hero entrance={entrance} />

      <Stats />

      <About />

      <section aria-labelledby="recent-publications" className="w-full mt-14 md:mt-16">
        <div className={sectionHeading}>
          <h2 id="recent-publications" className="text-xl font-serif text-gray-900">
            Recent publications
          </h2>
          <Link to={publicationsPath("all")} className={sectionLink}>
            View all <span aria-hidden="true">→</span>
          </Link>
        </div>
        <ol className="divide-y divide-gray-100 rounded-xl border border-gray-200/80 bg-white px-4 sm:px-6 shadow-sm">
          {recent.map((item) => (
            <li key={item.id} className="py-4 sm:py-5">
              <PublicationCard item={item} headingLevel={3} variant="compact" />
            </li>
          ))}
        </ol>
        <div className="mt-8 flex justify-center">
          <Link
            to={publicationsPath("all")}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-[var(--color-accent-blue)] hover:text-[var(--color-accent-blue)]"
          >
            View all {allPublications.length} publications
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Hero({ entrance }) {
  return (
    <motion.div {...entrance.header} className="flex flex-col items-center text-center space-y-5 max-w-2xl px-4">
      <div>
        <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-gray-900 mb-3">{profile.name}</h1>
        <p className="text-lg md:text-xl text-gray-600 font-medium font-sans">{profile.title}</p>
        <p className="text-lg md:text-xl text-gray-500 font-medium font-sans mt-1">{profile.institution}</p>
      </div>

      <p className="text-gray-600 leading-relaxed text-balance">{profile.bio}</p>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-500">
        {profile.location && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={15} aria-hidden="true" />
            {profile.location}
          </span>
        )}
        <Email
          email={profile.email}
          className="inline-flex items-center gap-1.5 hover:text-[var(--color-accent-blue)] transition-colors"
        >
          <Mail size={15} aria-hidden="true" />
        </Email>
        <ProfileLinks />
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-1">
        <Link to={publicationsPath("all")} className={primaryButton}>
          View Publications
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        {profile.cvUrl ? (
          <a href={profile.cvUrl} {...external} className={secondaryButton}>
            <Download size={16} aria-hidden="true" />
            Download CV
          </a>
        ) : (
          <Link to="/contact" className={secondaryButton}>
            Contact Me
          </Link>
        )}
      </div>
    </motion.div>
  );
}

// Stats from site.js (homeStats); entries without a value are skipped and the rest stay centred.
function Stats() {
  const stats = homeStats.filter((s) => s.value != null);
  const card = "block h-full rounded-xl border border-gray-200/80 bg-white p-4 text-center shadow-sm transition-colors";
  const body = (s) => (
    <>
      <span className="block text-3xl font-serif text-gray-900 group-hover:text-[var(--color-accent-blue)] transition-colors">
        {s.value}
      </span>
      <span className="mt-1 block text-xs font-medium uppercase tracking-wide text-gray-500">{s.label}</span>
    </>
  );

  return (
    <section aria-label="At a glance" className="w-full mt-10 md:mt-12">
      <ul className="flex flex-wrap justify-center gap-3">
        {stats.map((s) => (
          <li key={s.id} className="w-[calc(50%-0.375rem)] md:w-[calc(25%-0.5625rem)]">
            {s.to ? (
              <Link to={s.to} className={`group ${card} hover:border-[var(--color-accent-blue)]`}>
                {body(s)}
              </Link>
            ) : (
              <div className={card}>{body(s)}</div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function About() {
  return (
    <section aria-labelledby="about-me" className="w-full mt-14 md:mt-16">
      <div className={sectionHeading}>
        <h2 id="about-me" className="text-xl font-serif text-gray-900">
          About me
        </h2>
      </div>

      <div className="space-y-4 text-gray-600 leading-relaxed">
        {about.paragraphs.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    </section>
  );
}
