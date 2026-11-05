import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import profileImage from "../assets/profile.jpg";

const highlights = [
  { id: 1, image: "https://placehold.co/1200x400/e2e8f0/64748b?text=Conference+Presentation", title: "Keynote at ACL 2024" },
  { id: 2, image: "https://placehold.co/1200x400/cbd5e1/475569?text=Field+Research", title: "Field Research in Finland" },
  { id: 3, image: "https://placehold.co/1200x400/e2e8f0/64748b?text=Lab+Team", title: "Lab Team Retreat" },
];

export default function Cover() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000); // 6s auto-rotate
    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % highlights.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + highlights.length) % highlights.length);
  };

  const variants = {
    initial: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeIn" }
    }),
  };

  return (
    <div className="relative w-full mb-24 group">
      {/* Carousel Container */}
      {/* aspect-[16/9] sm:aspect-[21/9]  */}
      <div className="relative w-full h-[650px] bg-gray-100 overflow-hidden shadow-sm">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0"
          >
            <img
              src={highlights[currentIndex].image}
              alt={highlights[currentIndex].title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay & Title */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <span className="text-white font-medium text-sm drop-shadow-md">
                {highlights[currentIndex].title}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Hover Arrows */}
        <div className="absolute inset-y-0 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={prevSlide} className="p-2 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white text-gray-800 transition-all shadow-sm transform hover:scale-105">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextSlide} className="p-2 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white text-gray-800 transition-all shadow-sm transform hover:scale-105">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Overlapping Profile Picture */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-4 border-[#fafafa] bg-gray-200 z-10 shadow-sm overflow-hidden flex items-center justify-center">
        <div className="w-full h-full bg-[var(--color-accent-blue)] relative">
          <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          {/* <span className="text-4xl font-serif text-[var(--color-accent-blue)] absolute inset-0 flex items-center justify-center pointer-events-none">JE</span> */}
        </div>
      </div>
    </div>
  );
}
