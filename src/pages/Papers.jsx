import { motion } from "framer-motion";
import { papersByYear, pageIntros, pageTitle } from "../data/site";
import { PaperLinks, PaperTitle } from "../components/PaperLinks";
import { useEntrance } from "../lib/motion";

export default function Papers() {
  const entrance = useEntrance();

  return (
    <div className="w-full">
      <title>{pageTitle("Papers")}</title>

      <motion.div {...entrance.header} className="mb-12">
        <h1 className="text-3xl font-serif text-gray-900 mb-4">Selected Papers</h1>
        <p className="text-gray-600 max-w-xl text-balance">{pageIntros.papers}</p>
      </motion.div>

      <motion.div {...entrance.list} className="space-y-12">
        {papersByYear.map((paper) => (
          <motion.article key={paper.id} {...entrance.item}>
            {/* Badge sits on its own line above the title on small screens */}
            <div className="flex flex-col-reverse md:flex-row md:items-baseline gap-2 md:gap-4 mb-1">
              <h2 className="text-lg font-medium text-gray-900 min-w-0 md:flex-1">
                <PaperTitle paper={paper} />
              </h2>
              <span className="shrink-0 whitespace-nowrap self-start md:self-auto text-sm font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {paper.venue}
              </span>
            </div>

            <p className="text-gray-600 font-medium text-sm mb-2">{paper.authors}</p>
            <p className="text-gray-600 leading-relaxed">{paper.description}</p>
            <PaperLinks paper={paper} className="mt-2" />
          </motion.article>
        ))}
      </motion.div>
    </div>
  );
}
