import { Outlet, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Navbar from "./Navbar";
import Cover from "./Cover";
import { Mail } from "lucide-react";
import Email from "./Email";
import ProfileLinks from "./ProfileLinks";
import { profile } from "../data/site";

const lastUpdated = new Date(import.meta.env.VITE_LAST_UPDATED).toLocaleDateString("en-US", {
  month: "long",
  year: "numeric",
});

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    // reducedMotion="user" disables transform/layout animations for users who prefer reduced motion.
    <MotionConfig reducedMotion="user">
      {/* overflow-x-clip (not -hidden) so the sticky header still sticks */}
      <div className="min-h-screen overflow-x-clip bg-[#f7f7f8] selection:bg-[var(--color-accent-blue)] selection:text-white flex flex-col font-sans text-gray-800">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow-md"
        >
          Skip to content
        </a>
        <Navbar />
        {isHome && <Cover />}
        <main
          id="main"
          tabIndex={-1}
          className={`flex-grow w-full max-w-3xl mx-auto px-6 flex flex-col focus:outline-none ${isHome ? "pb-12 md:pb-14" : "pt-12 md:pt-20 pb-12 md:pb-14"}`}
        >
          <Outlet />
        </main>
        <footer className="w-full mt-auto border-t border-gray-200/80">
          <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
            <p className="text-center sm:text-left">
              © {new Date().getFullYear()} {profile.name}. All rights reserved.
              <span className="block sm:inline sm:before:content-['·'] sm:before:mx-2">Last updated {lastUpdated}</span>
            </p>
            <div className="flex items-center gap-4">
              <Email
                email={profile.email}
                className="inline-flex items-center gap-1.5 hover:text-[var(--color-accent-blue)] transition-colors"
              >
                <Mail size={15} aria-hidden="true" />
              </Email>
              <ProfileLinks size={16} />
            </div>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
