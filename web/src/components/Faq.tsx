import { useState } from 'react';
import { faq } from '../content';

export function Faq() {
  // Only one answer open at a time; null means all collapsed.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="band" aria-labelledby="faq-title">
      <div className="wrap narrow">
        <h2 id="faq-title">Questions</h2>
        <ul className="faq plain-list">
          {faq.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;
            return (
              <li key={item.question}>
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    className="faq-question"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span>{item.question}</span>
                    <span className="faq-icon" aria-hidden="true">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
                  <p className="faq-answer">{item.answer}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
