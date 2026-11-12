import { Link, Navigate, NavLink, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { pageTitle } from "../data/site";
import { allPublications, publicationSections, publicationsPath } from "../data/publicationList";
import PublicationCard from "../components/PublicationCard";
import { useEntrance } from "../lib/motion";

const PAGE_SIZE = 10;

const intros = {
  all: "Journal articles, book chapters, and conference proceedings, newest first.",
  "journal-articles": "Peer-reviewed research articles published in international journals.",
  "book-chapters": "Chapters contributed to edited scholarly volumes.",
  "conference-proceedings": "Papers presented at conferences and published in their proceedings.",
};

const categories = [
  {
    id: "all",
    label: "All",
    title: "All Publications",
    items: allPublications,
  },
  ...publicationSections,
];

export default function Publications() {
  const { category: categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const entrance = useEntrance();

  const category = categories.find((c) => c.id === categoryId);
  if (!category) return <Navigate to={publicationsPath()} replace />;

  const pageCount = Math.max(1, Math.ceil(category.items.length / PAGE_SIZE));
  const page = Math.min(pageCount, Math.max(1, Number(searchParams.get("page")) || 1));
  const items = category.items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="w-full">
      <title>{pageTitle(category.title ?? category.label)}</title>

      {/* Header band: soft tint + faint dot pattern behind the title and tabs only; the list stays on plain white. */}
      <div className="relative mb-10 overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-br from-slate-50 via-white to-[var(--color-accent-blue)]/10 px-5 pt-8 sm:px-8 sm:pt-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.18] [mask-image:linear-gradient(to_left,black,transparent_70%)]"
          style={{
            backgroundImage: "radial-gradient(var(--color-accent-blue) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        <motion.div {...entrance.header} className="relative mb-6">
          <h1 className="text-3xl font-serif text-gray-900 mb-4">{category.title ?? category.label}</h1>
          <p className="text-gray-600 max-w-xl text-balance">{intros[category.id]}</p>
        </motion.div>

        <nav aria-label="Publication types" className="relative border-t border-gray-200/70">
          <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm font-medium">
            {categories.map((c) => (
              <li key={c.id}>
                <NavLink
                  to={publicationsPath(c.id)}
                  className={({ isActive }) =>
                    `relative inline-block border-b-2 py-3 transition-colors ${
                      isActive
                        ? "border-[var(--color-accent-blue)] text-[var(--color-accent-blue)]"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`
                  }
                >
                  {c.label} <span className="text-gray-400">({c.items.length})</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* key restarts the entrance animation when switching tab or page */}
      <motion.ol key={`${category.id}-${page}`} {...entrance.list} className="space-y-6">
        {items.map((item) => (
          <motion.li key={item.id} {...entrance.item}>
            <PublicationCard item={item} />
          </motion.li>
        ))}
      </motion.ol>

      {pageCount > 1 && <Pagination page={page} pageCount={pageCount} basePath={publicationsPath(category.id)} />}
    </div>
  );
}

function Pagination({ page, pageCount, basePath }) {
  const toTop = () => window.scrollTo({ top: 0 });
  const href = (p) => (p === 1 ? basePath : `${basePath}?page=${p}`);
  const arrow =
    "inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900";

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1 text-sm font-medium">
      {page > 1 && (
        <Link to={href(page - 1)} onClick={toTop} aria-label="Previous page" className={arrow}>
          <ChevronLeft size={18} aria-hidden="true" />
        </Link>
      )}
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          to={href(p)}
          onClick={toTop}
          aria-current={p === page ? "page" : undefined}
          className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 transition-colors ${
            p === page
              ? "bg-[var(--color-accent-blue)] text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          {p}
        </Link>
      ))}
      {page < pageCount && (
        <Link to={href(page + 1)} onClick={toTop} aria-label="Next page" className={arrow}>
          <ChevronRight size={18} aria-hidden="true" />
        </Link>
      )}
    </nav>
  );
}
