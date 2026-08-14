import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Brand } from './components/Brand';
import { Faq } from './components/Faq';
import { Icon } from './components/Icons';
import { aboutPoints, reasons, steps } from './content';
import { config, contactEmailHref } from './config';

function WhatsAppButton({ className = '' }: { className?: string }) {
  return (
    <a
      className={`button button-primary contact-button ${className}`.trim()}
      href={config.whatsappUrl}
      target="_blank"
      rel="noreferrer"
    >
      <Icon name="whatsapp" />
      <span>Book on WhatsApp</span>
    </a>
  );
}

function EmailButton({ className = '' }: { className?: string }) {
  return (
    <a className={`button button-secondary contact-button ${className}`.trim()} href={contactEmailHref}>
      <Icon name="mail" />
      <span>Book by Email</span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="shell header-inner">
        <Brand compact />
        <nav className={open ? 'nav-open' : ''} aria-label="Main navigation">
          <a href="#how" onClick={close}>How it works</a>
          <a href="#students" onClick={close}>For Students</a>
          <a href="#about" onClick={close}>About us</a>
          <a href="#faq" onClick={close}>FAQ</a>
        </nav>
        <div className="header-actions">
          <a className="header-email" href={contactEmailHref} aria-label="Book a visit by email">
            <Icon name="mail" />
            <span>Email</span>
          </a>
          <a
            className="button button-primary header-cta contact-button"
            href={config.whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="whatsapp" />
            <span>Book on WhatsApp</span>
          </a>
        </div>
        <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={open}>
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-glow hero-glow-a" />
      <div className="hero-glow hero-glow-b" />
      <div className="shell hero-grid">
        <div className="hero-copy">
          <h1 data-reveal>
            When you can’t be there,<br />
            <span className="green">SomeoneThere</span> can.
          </h1>
          <p data-reveal>A trusted local attends your rental viewing in Madrid while you join remotely.</p>
          <div className="hero-actions" data-reveal>
            <WhatsAppButton />
            <EmailButton />
          </div>
          <a className="how-link" href="#how" data-reveal>See how it works <span aria-hidden="true">↓</span></a>
          <div className="proof-row" data-reveal>
            <span><b>✓</b> Trusted locals</span>
            <span><b>✓</b> Live video</span>
            <span><b>✓</b> Live insights</span>
            <span><b>✓</b> Peace of mind</span>
          </div>
        </div>
        <div className="phone-visual" data-reveal>
          <div className="phone-orbit orbit-a" />
          <div className="phone-orbit orbit-b" />
          <div className="phone-glow" />
          <img src="/phone-view.png" alt="Phone showing a live remote apartment viewing" />
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="light-section about-section" id="about">
      <div className="shell about-grid">
        <div className="about-copy" data-reveal>
          <h2>Why <span className="green">SomeoneThere</span>?</h2>
          <ul>
            {aboutPoints.map((point) => (
              <li key={point}><span className="round-check">✓</span><span>{point}</span></li>
            ))}
          </ul>
        </div>
        <div className="madrid-photo" data-reveal>
          <img src="/madrid-gran-via.png" alt="Gran Vía in Madrid at sunset" />
        </div>
      </div>
    </section>
  );
}

function HowSection() {
  return (
    <section className="light-section how-section" id="how">
      <div className="shell">
        <div className="section-heading centered" data-reveal>
          <h2>How <span className="green">SomeoneThere</span> works</h2>
          <p>Simple. Transparent. Reliable.</p>
        </div>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <article className="step-card" data-reveal key={step.title} style={{ '--delay': `${index * 80}ms` } as CSSProperties}>
              <div className="step-icon"><Icon name={step.icon} /></div>
              <h3><span>{index + 1}.</span> {step.title}</h3>
              <p>{step.body}</p>
              {index < steps.length - 1 && <span className="step-arrow" aria-hidden="true">→</span>}
            </article>
          ))}
        </div>
        <div className="center-button contact-pair" data-reveal>
          <WhatsAppButton />
          <a className="button button-light-outline contact-button" href={contactEmailHref}>
            <Icon name="mail" />
            <span>Email us</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function StudentsSection() {
  return (
    <section className="light-section students-section" id="students">
      <div className="shell">
        <div className="section-heading centered" data-reveal>
          <h2>Why students and expats<br />choose <span className="green">SomeoneThere</span></h2>
        </div>
        <div className="benefits-grid">
          {reasons.map((reason, index) => (
            <article className="benefit" data-reveal key={reason.title} style={{ '--delay': `${index * 80}ms` } as CSSProperties}>
              <div className="benefit-icon"><Icon name={reason.icon} /></div>
              <h3>{reason.title}</h3>
              <p>{reason.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingFooter() {
  return (
    <section className="dark-cta" id="book">
      <div className="shell cta-top">
        <div data-reveal>
          <h2>Ready to see the place<br />before you pay?</h2>
          <p>Message us on WhatsApp or email the listing to start arranging your visit.</p>
          <div className="booking-actions">
            <WhatsAppButton />
            <EmailButton />
          </div>
          <p className="contact-hint">Send the listing link and your preferred viewing time. We’ll take it from there.</p>
        </div>
        <div className="cta-brand" data-reveal>
          <Brand />
          <p>Your trusted local eyes in Madrid.</p>
          <div className="direct-contact-links">
            <a href={config.whatsappUrl} target="_blank" rel="noreferrer"><Icon name="whatsapp" /><span>WhatsApp</span></a>
            <a href={contactEmailHref}><Icon name="mail" /><span>{config.contactEmail}</span></a>
          </div>
          <div className="social-row">
            <a href={config.instagramUrl} aria-label="Instagram"><Icon name="instagram" /></a>
          </div>
        </div>
      </div>
      <div className="shell footer-nav">
        <nav aria-label="Footer navigation">
          <a href="#how">How it works</a>
          <a href="#students">For Students</a>
          <a href="#about">About us</a>
          <a href="#faq">FAQ</a>
          <a href={config.whatsappUrl} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href={contactEmailHref}>Email</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </nav>
        <p>© {new Date().getFullYear()} SomeoneThere. All rights reserved.</p>
      </div>
    </section>
  );
}

export default function App() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -45px' });

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <AboutSection />
        <HowSection />
        <StudentsSection />
        <Faq />
        <BookingFooter />
      </main>
    </>
  );
}
