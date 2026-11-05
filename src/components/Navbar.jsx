import { NavLink } from "react-router-dom";
import { professorData } from "../data";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/papers", label: "Papers" },
  { path: "/courses", label: "Courses" },
  { path: "/cv", label: "CV" },
  { path: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full bg-[#fafafa]/80 backdrop-blur-md border-b border-gray-100"
    >
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <NavLink to="/" className="font-serif font-medium text-lg tracking-tight text-gray-900 group">
          <span className="group-hover:text-[var(--color-accent-blue)] transition-colors duration-300">
            {professorData.name}
          </span>
        </NavLink>
        
        <nav className="flex items-center space-x-1 sm:space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `relative px-2 py-1 transition-colors duration-300 ${
                  isActive ? "text-[var(--color-accent-blue)]" : "text-gray-500 hover:text-gray-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-accent-blue)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
