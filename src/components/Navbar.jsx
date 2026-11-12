import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { profile } from "../data/site";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/publications", label: "Publications" },
  { path: "/courses", label: "Courses" },
  { path: "/cv", label: "CV" },
  { path: "/contact", label: "Contact" },
];

const MENU_ID = "mobile-nav";

export default function Navbar() {
  const { pathname } = useLocation();
  // The menu is "open for" a specific path, so it closes itself on route change.
  const [openFor, setOpenFor] = useState(null);
  const open = openFor === pathname;
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    const focusables = () => [buttonRef.current, ...menu.querySelectorAll("a")];
    menu.querySelector("a")?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpenFor(null);
        buttonRef.current?.focus();
      } else if (e.key === "Tab") {
        // Keep focus cycling between the toggle button and the menu links.
        const items = focusables();
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const onPointerDown = (e) => {
      if (!menu.contains(e.target) && !buttonRef.current.contains(e.target)) setOpenFor(null);
    };
    // Close if the viewport grows past the mobile breakpoint.
    const mq = window.matchMedia("(min-width: 640px)");
    const onBreakpoint = (e) => e.matches && setOpenFor(null);

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    mq.addEventListener("change", onBreakpoint);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      mq.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full bg-[#fafafa]/80 backdrop-blur-md border-b border-gray-100"
    >
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <NavLink to="/" className="font-serif font-medium text-lg tracking-tight text-gray-900 whitespace-nowrap group">
          <span className="group-hover:text-[var(--color-accent-blue)] transition-colors duration-300">
            {profile.name}
          </span>
        </NavLink>

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden sm:flex items-center gap-4 md:gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
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

        {/* Mobile toggle */}
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpenFor(open ? null : pathname)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={MENU_ID}
          className="sm:hidden -mr-2 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile menu */}
      <nav
        id={MENU_ID}
        ref={menuRef}
        aria-label="Main"
        hidden={!open}
        className="sm:hidden absolute inset-x-0 top-full border-b border-gray-100 bg-[#fafafa] shadow-sm"
      >
        <ul className="max-w-3xl mx-auto px-4 py-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/"}
                onClick={() => setOpenFor(null)}
                className={({ isActive }) =>
                  `block rounded-md px-2 py-3 text-base font-medium transition-colors ${
                    isActive
                      ? "text-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/5"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
}
