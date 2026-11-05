import { Outlet, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Navbar from "./Navbar";
import Cover from "./Cover";
import { profile } from "../data/site";

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
          className={`flex-grow w-full max-w-3xl mx-auto px-6 flex flex-col focus:outline-none ${isHome ? "pb-12 md:pb-20" : "py-12 md:py-20"}`}
        >
          <Outlet />
        </main>
        <footer className="w-full text-center py-8 text-sm text-gray-500 mt-auto">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </footer>
      </div>
    </MotionConfig>
  );
}
