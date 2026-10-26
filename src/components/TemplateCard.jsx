import { Link } from 'react-router-dom';
import './template-card.css';

const mono = "'IBM Plex Mono', monospace";

/** A catalogue card: desktop screenshot with the phone version on top, then name, price and links. */
export default function TemplateCard({ template: t, onRequest }) {
  const base = `/templates/${t.slug}`;
  return (
    <article className="tc">
      <Link to={base} className="tc-shot" aria-label={`Open the ${t.name} live demo`}>
        <img className="tc-desk" src={`${base}/thumb-desktop.jpg`} alt="" loading="lazy" decoding="async" />
        <span className="tc-phone">
          <img src={`${base}/thumb-phone.jpg`} alt="" loading="lazy" decoding="async" />
        </span>
        <span className="tc-cta">View live demo</span>
      </Link>
      <div className="tc-meta">
        <h3>{t.name}</h3>
        <span style={{ fontFamily: mono }}>{t.price}</span>
      </div>
      <p className="tc-blurb">{t.blurb}</p>
      <div className="tc-links">
        <Link to={base} className="tc-link">
          View live demo →
        </Link>
        <Link to={`${base}/customize`} className="tc-link">
          Customize
        </Link>
        <a href="#contact" onClick={onRequest} className="tc-link tc-link--muted">
          Request this design
        </a>
      </div>
    </article>
  );
}
