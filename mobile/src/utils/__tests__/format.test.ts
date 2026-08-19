import {
  fullAddress,
  initials,
  sanitizeText,
  shortAddress,
  verifierDisplayName,
} from '@/utils/format';

describe('verifier display name', () => {
  it('shows first name and last initial only', () => {
    // Customers must never see a verifier's full surname (spec §16).
    expect(verifierDisplayName('Lucía', 'M')).toBe('Lucía M.');
  });

  it('falls back to the first name when there is no initial', () => {
    expect(verifierDisplayName('Lucía', null)).toBe('Lucía');
  });
});

describe('addresses', () => {
  it('takes the first line for cards', () => {
    expect(shortAddress('Calle de Atocha 81\n3ºB')).toBe('Calle de Atocha 81');
  });

  it('joins the parts it has, skipping the ones it does not', () => {
    expect(fullAddress({ address_line: 'Calle de Atocha 81', city: 'Madrid' })).toBe(
      'Calle de Atocha 81, Madrid',
    );
    expect(
      fullAddress({ address_line: 'Calle de Atocha 81', postal_code: '28012', city: 'Madrid' }),
    ).toBe('Calle de Atocha 81, 28012, Madrid');
  });
});

describe('sanitizeText', () => {
  it('strips control characters', () => {
    expect(sanitizeText('note\u0000with\u001Fcontrol')).toBe('notewithcontrol');
  });

  it('trims surrounding whitespace', () => {
    expect(sanitizeText('  damp on the north wall  ')).toBe('damp on the north wall');
  });

  it('keeps ordinary punctuation and accents', () => {
    expect(sanitizeText('Baño con humedad — sin comprobar.')).toBe(
      'Baño con humedad — sin comprobar.',
    );
  });

  it('clamps to the maximum length', () => {
    expect(sanitizeText('x'.repeat(5000))).toHaveLength(2000);
  });
});

describe('initials', () => {
  it('builds initials from both names', () => {
    expect(initials('Marco', 'Rossi')).toBe('MR');
  });

  it('falls back when there is no name at all', () => {
    expect(initials(null, null)).toBe('?');
  });
});
