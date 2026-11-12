import { GraduationCap } from "lucide-react";
import { profileLinks } from "../data/site";
import { external } from "../lib/links";

// lucide-react has no brand icons, so these are simple monogram marks in the brand's style.
const Monogram = ({ text, round = false, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    {round ? (
      <circle cx="12" cy="12" r="11" fill="currentColor" />
    ) : (
      <rect x="1" y="1" width="22" height="22" rx="4" fill="currentColor" />
    )}
    <text
      x="12"
      y="16.2"
      textAnchor="middle"
      fontSize={text.length > 2 ? 9 : 11}
      fontWeight="700"
      fontFamily="Arial, Helvetica, sans-serif"
      fill="white"
    >
      {text}
    </text>
  </svg>
);

const icons = {
  scholar: (size) => <GraduationCap size={size} aria-hidden="true" />,
  orcid: (size) => <Monogram text="iD" round size={size} />,
  researchgate: (size) => <Monogram text="RG" size={size} />,
  linkedin: (size) => <Monogram text="in" size={size} />,
};

// Icon-only academic profile links; renders nothing until at least one URL is set in site.js.
export default function ProfileLinks({ className = "", size = 18 }) {
  if (profileLinks.length === 0) return null;

  return (
    <ul aria-label="Academic profiles" className={`flex items-center gap-3 ${className}`}>
      {profileLinks.map(({ key, label, url }) => (
        <li key={key}>
          <a
            href={url}
            {...external}
            aria-label={`${label} (opens in a new tab)`}
            title={label}
            className="inline-flex text-gray-500 transition-colors hover:text-[var(--color-accent-blue)]"
          >
            {icons[key](size)}
          </a>
        </li>
      ))}
    </ul>
  );
}
