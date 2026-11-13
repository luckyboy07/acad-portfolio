import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { profile, pageTitle } from "../data/site";
import { useEntrance } from "../lib/motion";

// Placeholder page: CV sections to be added. The download button appears once profile.cvUrl is set.
export default function CV() {
  const entrance = useEntrance();

  return (
    <div className="w-full">
      <title>{pageTitle("CV")}</title>

      <motion.div
        {...entrance.header}
        className="mb-12 border-b border-gray-100 pb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-serif text-gray-900 mb-2">Curriculum Vitae</h1>
          <p className="text-gray-600 max-w-xl">
            {profile.name} &mdash; {profile.title}
          </p>
        </div>
        {profile.cvUrl && (
          <a
            href={profile.cvUrl}
            download
            className="shrink-0 self-start sm:self-auto inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-[var(--color-accent-blue)] hover:text-[var(--color-accent-blue)]"
          >
            <Download size={16} aria-hidden="true" />
            Download CV (PDF)
          </a>
        )}
      </motion.div>
    </div>
  );
}
