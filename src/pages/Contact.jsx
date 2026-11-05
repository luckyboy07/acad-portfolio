import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import { professorData } from "../data";

export default function Contact() {
  return (
    <div className="w-full max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-3xl font-serif text-gray-900 mb-4">Get in Touch</h1>
        <p className="text-gray-500 text-balance">
          I'm always open to discussing research collaborations, sharing ideas on NLP and linguistics, or exploring new opportunities.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 100 }}
        className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
      >
        <div className="space-y-6">
          <div className="flex justify-center mb-8">
             <div className="w-20 h-20 bg-[var(--color-accent-blue)]/10 rounded-full flex items-center justify-center text-[var(--color-accent-blue)]">
               <Mail size={32} />
             </div>
          </div>
          
          <div className="space-y-4 text-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-1">Email</p>
              <a href={`mailto:${professorData.email}`} className="text-lg font-medium text-gray-900 hover:text-[var(--color-accent-blue)] transition-colors">
                {professorData.email}
              </a>
            </div>
            
            <div className="pt-4 border-t border-gray-50">
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-1">Office</p>
              <p className="text-gray-900 font-medium">
                {professorData.office} <br />
                {professorData.institution}
              </p>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-gray-50 flex justify-center gap-6">
            <a href={professorData.socials.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[var(--color-accent-blue)] transition-colors">
              Twitter
            </a>
            <a href={professorData.socials.scholar} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[var(--color-accent-blue)] transition-colors">
              Google Scholar
            </a>
            <a href={professorData.socials.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[var(--color-accent-blue)] transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
