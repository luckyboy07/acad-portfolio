import { useState } from "react";

// Email link that never puts the full address in the page as plain text:
// the "@" is drawn by CSS and the mailto: href is only assembled on hover, focus or tap.
export default function Email({ email, className = "", children }) {
  const [href, setHref] = useState(null);
  const address = () => `mailto:${email.user}@${email.domain}`;
  const reveal = () => setHref(address());

  return (
    <a
      href={href ?? "#"}
      onMouseEnter={reveal}
      onFocus={reveal}
      onTouchStart={reveal}
      onClick={(e) => {
        if (href) return;
        e.preventDefault();
        window.location.href = address();
      }}
      aria-label="Send an email"
      className={className}
    >
      {children}
      <span>
        {email.user}
        <span aria-hidden="true" className="before:content-['@']" />
        {email.domain}
      </span>
    </a>
  );
}
