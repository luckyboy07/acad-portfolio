import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { professorData } from "../data";

export default function Home() {
  return (
    <div className="w-full pb-12 flex flex-col items-center mt-8 md:mt-12">
      {/* Bottom: Centered Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col items-center text-center space-y-6 max-w-2xl px-4"
      >
        <div>
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-gray-900 mb-3">
            {professorData.name}
          </h1>
          <h2 className="text-lg md:text-xl text-gray-500 font-medium font-sans">
            {professorData.title}
            <span className="block text-gray-400 mt-1">{professorData.institution}</span>
          </h2>
        </div>

        {/* Social Media Links */}
        {/* <div className="flex gap-4">
          <a href={professorData.socials.twitter} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-gray-100 text-gray-500 hover:text-white hover:bg-[var(--color-accent-blue)] transition-colors duration-300">
            <Twitter size={20} />
          </a>
        </div> */}

        <p className="text-gray-600 leading-relaxed text-balance">
          {professorData.bio}
        </p>

        <div className="pt-2">
          <Link to="/papers">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[var(--color-accent-blue)] text-white px-6 py-3 rounded-full font-medium text-sm transition-colors hover:bg-[var(--color-accent-blue-hover)] flex items-center gap-2 shadow-sm"
            >
              View Selected Works
              <ArrowRight size={16} />
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
