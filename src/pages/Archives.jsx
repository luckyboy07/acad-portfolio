import { motion } from "framer-motion";
import { pageTitle } from "../data/site";
import { useEntrance } from "../lib/motion";

// Placeholder page: content to be added.
export default function Archives() {
  const entrance = useEntrance();

  return (
    <div className="w-full">
      <title>{pageTitle("Archives")}</title>

      <motion.div {...entrance.header} className="mb-12">
        <h1 className="text-3xl font-serif text-gray-900 mb-4">Archives</h1>
      </motion.div>
    </div>
  );
}
