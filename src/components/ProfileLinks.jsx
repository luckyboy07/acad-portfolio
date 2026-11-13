import scholarLogo from "../assets/social-media/GoogleScholar.svg";
import scopusLogo from "../assets/social-media/scopus.svg";
import wosLogo from "../assets/social-media/webofscience.svg";
import orcidLogo from "../assets/social-media/orcid.svg";
import linkedinLogo from "../assets/social-media/linkedin.svg";
import facebookLogo from "../assets/social-media/facebook.svg";
import { profileLinks } from "../data/site";
import { external } from "../lib/links";

// Fallback monogram mark for profiles without a logo file.
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

// Brand logos (full colour) from assets/social-media; ResearchGate has none yet, so it falls back to a monogram.
const logos = {
  scholar: scholarLogo,
  scopus: scopusLogo,
  wos: wosLogo,
  orcid: orcidLogo,
  linkedin: linkedinLogo,
  facebook: facebookLogo,
};

const icon = (key, size) =>
  logos[key] ? (
    <img src={logos[key]} alt="" width={size} height={size} className="block object-contain" />
  ) : (
    <Monogram text="RG" size={size} />
  );

// Icon-only profile links; renders nothing until at least one URL is set in site.js.
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
            className="inline-flex rounded text-gray-500 opacity-90 transition hover:opacity-100 hover:scale-110 motion-reduce:transform-none"
          >
            {icon(key, size)}
          </a>
        </li>
      ))}
    </ul>
  );
}
