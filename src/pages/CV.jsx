import { motion } from "framer-motion";
import { professorData, papers, courses, presentations } from "../data";

export default function CV() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 border-b border-gray-100 pb-8"
      >
        <h1 className="text-3xl font-serif text-gray-900 mb-2">Curriculum Vitae</h1>
        <p className="text-gray-500 max-w-xl">
          {professorData.name} &mdash; {professorData.title}, {professorData.institution}.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="space-y-12"
      >
        {/* Education (Placeholder data) */}
        <motion.section variants={itemVariants}>
          <h2 className="text-xl font-serif text-gray-900 mb-6 border-l-2 border-[var(--color-accent-blue)] pl-4">Education</h2>
          <div className="space-y-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                <h3 className="font-medium text-gray-900">Ph.D. in Computational Linguistics</h3>
                <span className="text-sm font-medium text-gray-500">2016 &mdash; 2020</span>
              </div>
              <p className="text-gray-600">Stanford University</p>
              <p className="text-sm text-gray-500 mt-1">Dissertation: "Cognitively Plausible Parsing Strategies in Neural Network Models"</p>
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                <h3 className="font-medium text-gray-900">B.A. in Linguistics and Computer Science</h3>
                <span className="text-sm font-medium text-gray-500">2012 &mdash; 2016</span>
              </div>
              <p className="text-gray-600">University of Turku</p>
            </div>
          </div>
        </motion.section>

        {/* Academic Appointments */}
        <motion.section variants={itemVariants}>
          <h2 className="text-xl font-serif text-gray-900 mb-6 border-l-2 border-[var(--color-accent-blue)] pl-4">Academic Appointments</h2>
          <div className="space-y-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                <h3 className="font-medium text-gray-900">Associate Professor</h3>
                <span className="text-sm font-medium text-gray-500">2023 &mdash; Present</span>
              </div>
              <p className="text-gray-600">Department of Computer Science, University of Helsinki</p>
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                <h3 className="font-medium text-gray-900">Postdoctoral Researcher</h3>
                <span className="text-sm font-medium text-gray-500">2020 &mdash; 2023</span>
              </div>
              <p className="text-gray-600">Massachusetts Institute of Technology (MIT)</p>
            </div>
          </div>
        </motion.section>

        {/* Selected Publications */}
        <motion.section variants={itemVariants}>
          <h2 className="text-xl font-serif text-gray-900 mb-6 border-l-2 border-[var(--color-accent-blue)] pl-4">Selected Publications</h2>
          <ul className="space-y-4 list-disc list-outside ml-4 text-gray-600">
            {papers.map((paper) => (
              <li key={paper.id} className="pl-2">
                <span className="font-medium text-gray-900">{paper.authors}</span>. ({paper.year}). "{paper.title}". <span className="italic">{paper.venue}</span>.
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Teaching */}
        <motion.section variants={itemVariants}>
          <h2 className="text-xl font-serif text-gray-900 mb-6 border-l-2 border-[var(--color-accent-blue)] pl-4">Teaching Experience</h2>
          <ul className="space-y-4 list-disc list-outside ml-4 text-gray-600">
            {courses.map((course) => (
              <li key={course.id} className="pl-2">
                <span className="font-medium text-gray-900">{course.title}</span> ({course.courseCode}), {course.semester}.
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Presentations */}
        <motion.section variants={itemVariants}>
          <h2 className="text-xl font-serif text-gray-900 mb-6 border-l-2 border-[var(--color-accent-blue)] pl-4">Invited Talks & Presentations</h2>
          <ul className="space-y-4 list-disc list-outside ml-4 text-gray-600">
            {presentations.map((pres) => (
              <li key={pres.id} className="pl-2">
                "{pres.title}". <span className="italic">{pres.venue}</span>, {pres.year}.
              </li>
            ))}
          </ul>
        </motion.section>

      </motion.div>
    </div>
  );
}
