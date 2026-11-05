import { motion } from "framer-motion";
import { courses, profile, pageIntros, pageTitle } from "../data/site";
import { useEntrance } from "../lib/motion";

export default function Courses() {
  const entrance = useEntrance();

  return (
    <div className="w-full">
      <title>{pageTitle("Courses")}</title>

      <motion.div {...entrance.header} className="mb-12">
        <h1 className="text-3xl font-serif text-gray-900 mb-4">Teaching</h1>
        <p className="text-gray-600 max-w-xl text-balance">
          Current and past courses taught at the {profile.institution}, {pageIntros.courses}
        </p>
      </motion.div>

      <motion.div {...entrance.list} className="space-y-10">
        {courses.map((course) => (
          // Negative margin pulls the border into the gutter so the text lines up with the heading.
          <motion.div
            key={course.id}
            {...entrance.item}
            className="-ml-[18px] border-l-2 border-gray-200 pl-4 hover:border-[var(--color-accent-blue)] transition-colors duration-300"
          >
            <div className="flex flex-col mb-1">
              <span className="text-[var(--color-accent-blue)] text-sm font-semibold tracking-wide uppercase mb-1">
                {course.courseCode} &bull; {course.semester}
              </span>
              <h2 className="text-xl font-medium text-gray-900">{course.title}</h2>
            </div>

            <p className="text-gray-600 leading-relaxed mt-2">{course.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
