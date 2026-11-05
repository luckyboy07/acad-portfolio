import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { profile, pageIntros, pageTitle } from "../data/site";
import { external } from "../lib/links";
import { useEntrance } from "../lib/motion";

const socialLabels = { twitter: "Twitter", scholar: "Google Scholar", github: "GitHub" };

export default function Contact() {
  const entrance = useEntrance();
  // Only render socials that have a URL configured.
  const socials = Object.entries(socialLabels).filter(([key]) => profile.socials[key]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <title>{pageTitle("Contact")}</title>

      <motion.div {...entrance.header} className="mb-12 text-center">
        <h1 className="text-3xl font-serif text-gray-900 mb-4">Get in Touch</h1>
        <p className="text-gray-600 text-balance">{pageIntros.contact}</p>
      </motion.div>

      <motion.div
        {...entrance.header}
        transition={{ ...entrance.header.transition, delay: 0.05 }}
        className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm"
      >
        <div className="space-y-6">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-[var(--color-accent-blue)]/10 rounded-full flex items-center justify-center text-[var(--color-accent-blue)]">
              <Mail size={32} aria-hidden="true" />
            </div>
          </div>

          <div className="space-y-4 text-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">Email</p>
              <a
                href={`mailto:${profile.email}`}
                className="text-lg font-medium text-gray-900 hover:text-[var(--color-accent-blue)] transition-colors break-all"
              >
                {profile.email}
              </a>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">Office</p>
              <p className="text-gray-900 font-medium">
                {profile.office && (
                  <>
                    {profile.office} <br />
                  </>
                )}
                {profile.department}, {profile.institution}
              </p>
            </div>
          </div>

          {socials.length > 0 && (
            <div className="pt-8 mt-8 border-t border-gray-100 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {socials.map(([key, label]) => (
                <a
                  key={key}
                  href={profile.socials[key]}
                  {...external}
                  className="text-gray-600 hover:text-[var(--color-accent-blue)] transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
