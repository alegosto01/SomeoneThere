import { config, contactEmailHref } from '../config';
import {
  checklist,
  checklistNote,
  footer,
  hero,
  howItWorks,
  independentPerspective,
  nav,
  pilot,
  problem,
  safetyBoundaries,
  safetyNote,
} from '../content';

function PilotLink({ variant = 'primary' }: { variant?: 'primary' | 'compact' }) {
  return (
    <a
      className={variant === 'compact' ? 'btn btn-primary btn-compact' : 'btn btn-primary'}
      href={config.pilotFormUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      Request a pilot visit
    </a>
  );
}

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <a className="wordmark" href="#top">
          House<span>Check</span>
        </a>
        <nav className="site-nav" aria-label="Main">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <PilotLink variant="compact" />
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero-inner">
        <p className="eyebrow">Madrid · Pilot</p>
        <h1 id="hero-title">{hero.headline}</h1>
        <p className="lead">{hero.body}</p>
        <div className="cta-row">
          <PilotLink />
          <a className="btn btn-secondary" href="#how-it-works">
            See how it works
          </a>
        </div>
        <p className="trust-line">{hero.trustLine}</p>
      </div>
    </section>
  );
}

export function ProblemSection() {
  return (
    <section id="problem" aria-labelledby="problem-title">
      <div className="wrap">
        <h2 id="problem-title">{problem.title}</h2>
        <p className="section-intro">{problem.intro}</p>
        <ul className="card-grid plain-list">
          {problem.points.map((point) => (
            <li className="card" key={point.title}>
              <h3>{point.title}</h3>
              <p>{point.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="band" aria-labelledby="how-it-works-title">
      <div className="wrap">
        <h2 id="how-it-works-title">How it works</h2>
        <p className="section-intro">
          Three steps. Everything is arranged by a person — there is no app to install.
        </p>
        <ol className="steps plain-list">
          {howItWorks.map((step, index) => (
            <li className="card step" key={step.title}>
              <span className="step-number" aria-hidden="true">
                {index + 1}
              </span>
              <h3>
                <span className="step-label">Step {index + 1}:</span> {step.title}
              </h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ChecklistSection() {
  return (
    <section id="what-we-check" aria-labelledby="what-we-check-title">
      <div className="wrap">
        <h2 id="what-we-check-title">What SomeoneThere checks</h2>
        <p className="section-intro">
          The verifier follows a structured checklist during the viewing, plus any questions you add
          beforehand.
        </p>
        <ul className="checklist plain-list">
          {checklist.map((item) => (
            <li key={item}>
              <span className="tick" aria-hidden="true">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
        <p className="note">{checklistNote}</p>
      </div>
    </section>
  );
}

export function IndependentPerspective() {
  return (
    <section id="independent" className="band" aria-labelledby="independent-title">
      <div className="wrap narrow">
        <h2 id="independent-title">{independentPerspective.title}</h2>
        <p className="lead">{independentPerspective.body}</p>
        <p className="note">{independentPerspective.note}</p>
      </div>
    </section>
  );
}

export function SafetySection() {
  return (
    <section id="boundaries" aria-labelledby="boundaries-title">
      <div className="wrap">
        <h2 id="boundaries-title">Where SomeoneThere stops</h2>
        <p className="section-intro">
          These limits are part of the service, not fine print. They protect you, the verifier, and
          the people who live in or manage the property.
        </p>
        <ul className="boundaries plain-list">
          {safetyBoundaries.map((item) => (
            <li key={item}>
              <span className="bullet" aria-hidden="true">
                —
              </span>
              {item}
            </li>
          ))}
        </ul>
        <p className="note">{safetyNote}</p>
      </div>
    </section>
  );
}

export function PilotCTA() {
  return (
    <section id="pilot" className="pilot" aria-labelledby="pilot-title">
      <div className="wrap narrow">
        <h2 id="pilot-title">{pilot.title}</h2>
        <p className="lead">{pilot.body}</p>
        <div className="cta-row">
          <PilotLink />
          <a
            className="btn btn-secondary"
            href={config.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Message us on WhatsApp
          </a>
        </div>
        <p className="note">{pilot.note}</p>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div>
          <p className="wordmark">
            House<span>Check</span>
          </p>
          <p className="note">{footer.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="plain-list">
            <li>
              <a href={contactEmailHref}>{config.contactEmail}</a>
            </li>
            <li>
              <a href={config.privacyUrl}>Privacy (placeholder)</a>
            </li>
            <li>
              <a href={config.termsUrl}>Terms (placeholder)</a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="wrap">
        <p className="disclaimer">{footer.disclaimer}</p>
      </div>
    </footer>
  );
}
