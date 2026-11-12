import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { profile, papersByYear, courses, cv, pageTitle } from "../data/site";
import { useEntrance } from "../lib/motion";

function Section({ title, children, item }) {
  return (
    <motion.section {...item}>
      <h2 className="text-xl font-serif text-gray-900 mb-6 border-l-2 border-[var(--color-accent-blue)] pl-4">{title}</h2>
      {children}
    </motion.section>
  );
}

function Entries({ entries }) {
  return (
    <div className="space-y-6">
      {entries.map((entry) => (
        <div key={`${entry.title}-${entry.period}`}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline sm:gap-4 mb-1">
            <h3 className="font-medium text-gray-900">{entry.title}</h3>
            <span className="text-sm font-medium text-gray-500 shrink-0">{entry.period}</span>
          </div>
          <p className="text-gray-600">{entry.org}</p>
          {entry.note && <p className="text-sm text-gray-500 mt-1">{entry.note}</p>}
        </div>
      ))}
    </div>
  );
}

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
            {profile.name} &mdash; {profile.title}, {profile.institution}.
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

      <motion.div {...entrance.list} className="space-y-12">
        <Section title="Education" item={entrance.item}>
          <Entries entries={cv.education} />
        </Section>

        <Section title="Academic Appointments" item={entrance.item}>
          <Entries entries={cv.appointments} />
        </Section>

        <Section title="Selected Publications" item={entrance.item}>
          <ul className="space-y-4 list-disc list-outside ml-4 text-gray-600">
            {papersByYear.map((paper) => (
              <li key={paper.id} className="pl-2">
                <span className="font-medium text-gray-900">{paper.authors}</span>. ({paper.year}). "{paper.title}".{" "}
                <span className="italic">{paper.venue}</span>.
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Teaching Experience" item={entrance.item}>
          <ul className="space-y-4 list-disc list-outside ml-4 text-gray-600">
            {courses.map((course) => (
              <li key={course.id} className="pl-2">
                <span className="font-medium text-gray-900">{course.title}</span> ({course.courseCode}), {course.semester}.
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Invited Talks & Presentations" item={entrance.item}>
          <ul className="space-y-4 list-disc list-outside ml-4 text-gray-600">
            {cv.presentations.map((pres) => (
              <li key={pres.id} className="pl-2">
                "{pres.title}". <span className="italic">{pres.venue}</span>, {pres.year}.
              </li>
            ))}
          </ul>
        </Section>
      </motion.div>
    </div>
  );
}
