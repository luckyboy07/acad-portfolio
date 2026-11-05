import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { profile, papersByYear } from "../data/site";
import { PaperTitle } from "../components/PaperLinks";
import { useEntrance } from "../lib/motion";

export default function Home() {
  const entrance = useEntrance();
  const recentPapers = papersByYear.slice(0, 3);

  return (
    <div className="w-full pb-12 flex flex-col items-center mt-6 md:mt-8">
      <title>{`${profile.name} — ${profile.title}`}</title>

      <motion.div
        {...entrance.header}
        className="flex flex-col items-center text-center space-y-6 max-w-2xl px-4"
      >
        <div>
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-gray-900 mb-3">
            {profile.name}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-medium font-sans">{profile.title}</p>
          <p className="text-lg md:text-xl text-gray-500 font-medium font-sans mt-1">{profile.institution}</p>
        </div>

        <p className="text-gray-600 leading-relaxed text-balance">{profile.bio}</p>

        <div className="pt-2">
          <Link
            to="/papers"
            className="bg-[var(--color-accent-blue)] text-white px-6 py-3 rounded-full font-medium text-sm transition hover:bg-[var(--color-accent-blue-hover)] hover:scale-[1.02] active:scale-[0.98] motion-reduce:transform-none inline-flex items-center gap-2 shadow-sm"
          >
            View Selected Works
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </motion.div>

      <section aria-labelledby="selected-papers" className="w-full mt-16 md:mt-20">
        <div className="flex items-baseline justify-between gap-4 border-b border-gray-200 pb-3 mb-6">
          <h2 id="selected-papers" className="text-xl font-serif text-gray-900">
            Selected papers
          </h2>
          <Link
            to="/papers"
            className="shrink-0 text-sm font-medium text-[var(--color-accent-blue)] hover:text-[var(--color-accent-blue-hover)] hover:underline underline-offset-4"
          >
            View all papers <span aria-hidden="true">→</span>
          </Link>
        </div>
        <ul className="space-y-5">
          {recentPapers.map((paper) => (
            <li key={paper.id}>
              <h3 className="font-medium text-gray-900 leading-snug">
                <PaperTitle paper={paper} />
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {paper.authors} · <span className="italic">{paper.venue}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
