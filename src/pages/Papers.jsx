import { motion } from "framer-motion";
import { papers } from "../data";

export default function Papers() {
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
        <h1 className="text-3xl font-serif text-gray-900 mb-4">Selected Papers</h1>
        <p className="text-gray-500 max-w-xl text-balance">
          A collection of my recent academic work, centered on natural language processing, morphology, and cognitively-motivated computational models.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="space-y-12"
      >
        {papers.map((paper) => (
          <motion.article 
            key={paper.id} 
            variants={itemVariants}
            className="group relative"
          >
            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-1">
              <h2 className="text-lg font-medium text-gray-900">
                <a href={paper.link} className="hover:text-[var(--color-accent-blue)] transition-colors inline-block relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-[var(--color-accent-blue)] after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                  {paper.title}
                </a>
              </h2>
              <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-gray-100/80 text-gray-600 block w-max self-start md:self-auto">
                {paper.venue} '{paper.year.toString().slice(2)}
              </span>
            </div>
            
            <p className="text-gray-600 font-medium text-sm mb-2">{paper.authors}</p>
            <p className="text-gray-500 leading-relaxed">{paper.description}</p>
          </motion.article>
        ))}
      </motion.div>
    </div>
  );
}
