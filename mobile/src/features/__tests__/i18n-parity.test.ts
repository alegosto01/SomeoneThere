import en from '@/i18n/locales/en.json';
import es from '@/i18n/locales/es.json';

function keyPaths(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, entry]) =>
    keyPaths(entry, prefix ? `${prefix}.${key}` : key),
  );
}

function valueAt(bundle: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>((node, key) => (node as Record<string, unknown>)?.[key], bundle);
}

describe('translations', () => {
  it('has the same keys in English and Spanish', () => {
    // A missing Spanish key silently falls back to English mid-sentence, which
    // nobody notices until a Spanish-speaking user does.
    expect(keyPaths(es).sort()).toEqual(keyPaths(en).sort());
  });

  it('has no empty strings', () => {
    for (const [name, bundle] of [
      ['en', en],
      ['es', es],
    ] as const) {
      const empties = keyPaths(bundle).filter((path) => {
        const value = valueAt(bundle, path);
        return typeof value === 'string' && value.trim().length === 0;
      });
      expect({ [name]: empties }).toEqual({ [name]: [] });
    }
  });

  it('keeps interpolation placeholders identical across languages', () => {
    // {{address}} missing from the Spanish copy would ship a notification body
    // with a hole in it.
    const placeholder = /\{\{(\w+)\}\}/g;
    for (const path of keyPaths(en)) {
      const source = valueAt(en, path);
      const target = valueAt(es, path);
      if (typeof source !== 'string' || typeof target !== 'string') continue;

      const inSource = [...source.matchAll(placeholder)].map((match) => match[1]).sort();
      const inTarget = [...target.matchAll(placeholder)].map((match) => match[1]).sort();
      expect({ path, placeholders: inTarget }).toEqual({ path, placeholders: inSource });
    }
  });

  it('states what the report is not', () => {
    // The disclaimer is required to *name* the things SomeoneThere is not
    // (spec §28), so it legitimately contains phrases like "certified property
    // inspection" inside a negation. What it must carry is the denial itself.
    expect(en.report.disclaimer).toMatch(/this is not a/i);
    expect(en.report.disclaimer).toMatch(/certified property inspection/i);
    expect(en.report.disclaimer).toMatch(/legal opinion/i);
    expect(en.report.disclaimer).toMatch(/guarantee/i);
    expect(es.report.disclaimer).toMatch(/no es una/i);
    expect(en.report.disclaimer_secondary).toMatch(/change/i);
  });

  it('makes no affirmative safety claim anywhere in the UI copy', () => {
    // The real risk is a *claim*, not a denial: "property is safe", "verified
    // safe", "scam-free" (spec §57). Denials are checked above.
    const claims = [
      /\bproperty is safe\b/i,
      /\bverified safe\b/i,
      /\bscam[- ]free\b/i,
      /\bscam[- ]proof\b/i,
      /\bguaranteed safe\b/i,
      /\blegally verified\b/i,
      /\bapproved landlord\b/i,
      /\bpiso seguro\b/i,
      /\bsin estafas\b/i,
      /\bgarantizado\b/i,
    ];
    for (const bundle of [en, es]) {
      for (const path of keyPaths(bundle)) {
        const value = valueAt(bundle, path);
        if (typeof value !== 'string') continue;
        for (const claim of claims) {
          expect({ path, matches: claim.test(value) }).toEqual({ path, matches: false });
        }
      }
    }
  });

  it('describes the listing match without judging the property', () => {
    const labels = Object.values(en.report.match).join(' ').toLowerCase();
    for (const word of ['safe', 'scam', 'certified', 'guaranteed', 'legitimate']) {
      expect(labels).not.toContain(word);
    }
  });
});
