import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import profileWebp from "../assets/profile-240.webp";
import profileJpg from "../assets/profile-240.jpg";
import { heroSlides, profile } from "../data/site";

const AUTOPLAY_MS = 6000;

export default function Cover() {
  return (
    <div className="relative w-full mb-16 sm:mb-20 group">
      {heroSlides.length > 0 ? <Carousel /> : <PatternBanner />}
      <Avatar />
    </div>
  );
}

// Placeholder header used until real highlight photos are added to heroSlides.
function PatternBanner() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full h-[120px] sm:h-[150px] md:h-[176px] overflow-hidden shadow-sm bg-gradient-to-br from-[#4a5875] via-[var(--color-accent-blue)] to-[#8a9ab5]"
    >
      {/* Dot grid, fading out toward the centre so the avatar sits on a calm area */}
      <div
        className="absolute inset-0 opacity-25 [mask-image:radial-gradient(ellipse_at_center,transparent_25%,black_75%)]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      {/* Soft light blooms for depth */}
      <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
      <div className="absolute -bottom-28 -right-10 h-80 w-80 rounded-full bg-[#2f3a52]/40 blur-3xl" />
      {/* Thin concentric rings, echoing the round avatar */}
      <svg
        className="absolute right-[-60px] top-1/2 -translate-y-1/2 h-[340px] w-[340px] text-white/15"
        viewBox="0 0 200 200"
        fill="none"
      >
        {[30, 50, 70, 90].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} stroke="currentColor" strokeWidth="0.6" />
        ))}
      </svg>
    </div>
  );
}

function Carousel() {
  const reduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const slide = heroSlides[currentIndex];

  const go = (step) => {
    setDirection(step);
    setCurrentIndex((prev) => (prev + step + heroSlides.length) % heroSlides.length);
  };

  // Auto-advance, except under reduced motion or while hovered/focused.
  useEffect(() => {
    if (reduceMotion || paused || heroSlides.length < 2) return;
    const timer = setTimeout(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [currentIndex, reduceMotion, paused]);

  const variants = {
    initial: (direction) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
    animate: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
    exit: (direction) => ({ x: direction > 0 ? -100 : 100, opacity: 0, transition: { duration: 0.4, ease: "easeIn" } }),
  };

  // Banners are 16:9 designs with text baked in, so they are shown whole (object-contain);
  // on wide screens a blurred copy fills the sides. The visible caption describes each slide.
  const image = (
    <>
      <img
        src={slide.image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-70"
      />
      <img
        src={slide.image}
        alt=""
        width={1600}
        height={900}
        loading={currentIndex === 0 ? "eager" : "lazy"}
        fetchPriority={currentIndex === 0 ? "high" : "auto"}
        decoding="async"
        className="relative w-full h-full object-contain object-center"
      />
    </>
  );

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative w-full h-[56.25vw] max-h-[420px] bg-gray-900 overflow-hidden shadow-sm"
    >
      {reduceMotion ? (
        <div className="absolute inset-0">{image}</div>
      ) : (
        <AnimatePresence custom={direction} mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0"
          >
            {image}
          </motion.div>
        </AnimatePresence>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Caption: bottom-left on sm+, kept clear of the centered avatar; top-left on phones */}
      <p
        aria-live="polite"
        className="absolute left-3 top-3 sm:top-auto sm:bottom-3 sm:right-[calc(50%+76px)] pointer-events-none"
      >
        <span className="inline-block max-w-[calc(100vw-1.5rem)] sm:max-w-md rounded bg-black/60 px-2 py-1 text-xs sm:text-sm font-medium leading-snug text-white">
          {slide.caption}
        </span>
      </p>

      {/* Arrows: shown on hover, on keyboard focus, and always on touch devices */}
      {heroSlides.length > 1 && (
        <div className="absolute inset-y-0 left-2 right-2 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="pointer-events-auto p-2 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white text-gray-800 transition-all shadow-sm hover:scale-105"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next slide"
            className="pointer-events-auto p-2 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white text-gray-800 transition-all shadow-sm hover:scale-105"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

// Round profile picture overlapping the bottom edge of the banner.
function Avatar() {
  return (
    <div className="absolute -bottom-14 sm:-bottom-16 left-1/2 -translate-x-1/2 w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#fafafa] bg-[var(--color-accent-blue)] z-10 shadow-sm overflow-hidden">
      <picture>
        <source srcSet={profileWebp} type="image/webp" />
        <img
          src={profileJpg}
          alt={`Portrait of ${profile.name}`}
          width={240}
          height={240}
          decoding="async"
          className="w-full h-full object-cover"
        />
      </picture>
    </div>
  );
}
