import { motion } from "framer-motion";
import { courses } from "../data";

export default function Courses() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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
        className="mb-12"
      >
        <h1 className="text-3xl font-serif text-gray-900 mb-4">Teaching</h1>
        <p className="text-gray-500 max-w-xl text-balance">
          Current and past courses taught at the University of Helsinki, focusing on foundations and advanced topics in computational linguistics.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="space-y-10"
      >
        {courses.map((course) => (
          <motion.div 
            key={course.id} 
            variants={itemVariants}
            className="border-l-2 border-gray-100 pl-6 hover:border-[var(--color-accent-blue)] transition-colors duration-300"
          >
            <div className="flex flex-col mb-1">
              <span className="text-[var(--color-accent-blue)] text-sm font-semibold tracking-wide uppercase mb-1">
                {course.courseCode} &bull; {course.semester}
              </span>
              <h2 className="text-xl font-medium text-gray-900 group-hover:text-[var(--color-accent-blue)] transition-colors">
                {course.title}
              </h2>
            </div>
            
            <p className="text-gray-600 leading-relaxed mt-2">{course.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
