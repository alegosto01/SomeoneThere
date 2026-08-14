import { useState } from 'react';
import { faqs } from '../content';

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="light-section faq-section" id="faq">
      <div className="shell faq-shell">
        <div className="section-heading centered" data-reveal>
          <h2>Frequently asked <span className="green">questions</span></h2>
          <p>Everything you need to know about the live viewing experience.</p>
        </div>
        <div className="faq-list" data-reveal>
          {faqs.map((item, index) => {
            const isOpen = open === index;
            return (
              <article className={`faq-item ${isOpen ? 'open' : ''}`} key={item.q}>
                <button type="button" onClick={() => setOpen(isOpen ? null : index)} aria-expanded={isOpen}>
                  <span>{item.q}</span><b>{isOpen ? '−' : '+'}</b>
                </button>
                <div className="faq-answer"><p>{item.a}</p></div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
