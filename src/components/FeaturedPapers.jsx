import { motion } from "framer-motion";

export default function FeaturedPapers() {
    return (
        <div>
            {/* Right Side: Carousel */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                className="relative w-full max-w-sm md:ml-auto h-[280px]"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-gray-400">Featured Papers</h3>
                    <div className="flex gap-2">
                        <button onClick={prevSlide} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-800 transition-colors">
                            <ChevronLeft size={16} />
                        </button>
                        <button onClick={nextSlide} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-800 transition-colors">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                <div className="relative h-48 overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-center">
                    <AnimatePresence custom={direction} mode="wait">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={variants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="absolute inset-0 p-6 flex flex-col justify-center"
                        >
                            <span className="text-[var(--color-accent-blue)] font-medium text-xs mb-2 block">{highlightedPapers[currentIndex].year}</span>
                            <h4 className="font-serif text-lg font-medium text-gray-900 leading-snug mb-2 line-clamp-2">
                                {highlightedPapers[currentIndex].title}
                            </h4>
                            <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                                {highlightedPapers[currentIndex].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex justify-center mt-4 gap-2">
                    {highlightedPapers.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setDirection(i > currentIndex ? 1 : -1);
                                setCurrentIndex(i);
                            }}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? "bg-[var(--color-accent-blue)] w-4" : "bg-gray-300 hover:bg-gray-400"}`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}