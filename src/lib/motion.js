import { useReducedMotion } from "framer-motion";

// Fast, subtle entrance animations. Under prefers-reduced-motion, `initial`
// is false so elements render in their final state with no animation.
export function useEntrance() {
  const reduce = useReducedMotion();

  return {
    // Page header block
    header: {
      initial: reduce ? false : { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.25, ease: "easeOut" },
    },
    // Staggered list container; spread onto the parent motion element
    list: {
      initial: reduce ? false : "hidden",
      animate: "show",
      variants: {
        hidden: {},
        show: { transition: { staggerChildren: 0.05 } },
      },
    },
    // Spread onto each child of `list`
    item: {
      variants: {
        hidden: { opacity: 0, y: 6 },
        show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
      },
    },
  };
}
