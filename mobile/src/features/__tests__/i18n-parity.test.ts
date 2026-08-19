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

  it('keeps guarantee language out of the report disclaimer', () => {
    // Product language rules (spec §57) — these must never reach a report.
    const banned = [
      'guaranteed',
      'scam-proof',
      'certified property',
      'legally verified',
      'garantizado',
      'a prueba de estafas',
    ];
    const disclaimer = `${en.report.disclaimer} ${es.report.disclaimer}`.toLowerCase();
    for (const word of banned) {
      expect(disclaimer).not.toContain(word);
    }
  });

  it('describes the listing match without judging the property', () => {
    const labels = Object.values(en.report.match).join(' ').toLowerCase();
    for (const word of ['safe', 'scam', 'certified', 'guaranteed', 'legitimate']) {
      expect(labels).not.toContain(word);
    }
  });
});
