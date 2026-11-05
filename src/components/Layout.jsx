import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Cover from "./Cover";
import { AnimatePresence, motion } from "framer-motion";

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f7f8] selection:bg-[var(--color-accent-blue)] selection:text-white flex flex-col font-sans text-gray-800">
      <Navbar />
      {isHome && <Cover />}
      <main className={`flex-grow w-full max-w-3xl mx-auto px-6 flex flex-col ${isHome ? 'pb-12 md:pb-20' : 'py-12 md:py-20'}`}>
        {/* We can use AnimatePresence here for page transitions if desired, but we'll keep it simple and use framer motion in individual pages */}
        <Outlet />
      </main>
      <footer className="w-full text-center py-8 text-sm text-gray-500 mt-auto">
        © {new Date().getFullYear()} Dharel P. Acut All rights reserved.
      </footer>
    </div>
  );
}
