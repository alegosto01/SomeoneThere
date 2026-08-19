import {
  loginSchema,
  preferencesStepSchema,
  prioritiesStepSchema,
  propertyStepSchema,
  registerSchema,
  reportSubmissionSchema,
  viewingStepSchema,
} from '@/utils/validation';

const HOUR = 60 * 60 * 1000;
const future = () => new Date(Date.now() + 48 * HOUR).toISOString();
const past = () => new Date(Date.now() - 48 * HOUR).toISOString();

const validProperty = {
  address_line: 'Calle de Fuencarral 123',
  city: 'Madrid',
  property_type: 'apartment' as const,
};

describe('property step', () => {
  it('accepts a listing without a URL', () => {
    // Plenty of Madrid rentals only ever exist in a WhatsApp message.
    expect(propertyStepSchema.safeParse(validProperty).success).toBe(true);
  });

  it('rejects a malformed listing URL', () => {
    const result = propertyStepSchema.safeParse({ ...validProperty, listing_url: 'not a url' });
    expect(result.success).toBe(false);
  });

  it('accepts a well-formed listing URL', () => {
    const result = propertyStepSchema.safeParse({
      ...validProperty,
      listing_url: 'https://www.idealista.com/inmueble/123/',
    });
    expect(result.success).toBe(true);
  });

  it('requires an address', () => {
    const result = propertyStepSchema.safeParse({ ...validProperty, address_line: '' });
    expect(result.success).toBe(false);
  });
});

describe('viewing step', () => {
  const base = {
    expected_duration_minutes: 30,
    contact_type: 'agent' as const,
    access_confirmed: true,
  };

  it('accepts a future viewing', () => {
    expect(viewingStepSchema.safeParse({ ...base, scheduled_at: future() }).success).toBe(true);
  });

  it('rejects a viewing in the past', () => {
    const result = viewingStepSchema.safeParse({ ...base, scheduled_at: past() });
    expect(result.success).toBe(false);
  });

  it('accepts "access not confirmed yet" as a valid booking state', () => {
    // Not having the contact's agreement yet is normal, not a form error.
    const result = viewingStepSchema.safeParse({
      ...base,
      scheduled_at: future(),
      access_confirmed: false,
    });
    expect(result.success).toBe(true);
  });
});

describe('priorities step', () => {
  it('accepts checklist selections alone', () => {
    const result = prioritiesStepSchema.safeParse({
      priorities: ['natural_light'],
      customer_notes: '',
    });
    expect(result.success).toBe(true);
  });

  it('accepts a free-text note alone', () => {
    const result = prioritiesStepSchema.safeParse({
      priorities: [],
      customer_notes: 'Does the bedroom window face the street?',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an empty step', () => {
    const result = prioritiesStepSchema.safeParse({ priorities: [], customer_notes: '' });
    expect(result.success).toBe(false);
  });
});

describe('preferences step', () => {
  it('defaults recording to off', () => {
    const result = preferencesStepSchema.parse({});
    expect(result.recording_requested).toBe(false);
    expect(result.photos_requested).toBe(true);
    expect(result.live_call_requested).toBe(true);
  });
});

describe('report submission', () => {
  const valid = {
    listing_match: 'minor_differences' as const,
    verifier_summary: 'The studio matched the listing in layout, with a missing desk.',
    observations: [{ category: 'natural_light', rating: 'good' as const, note: null }],
    unchecked_areas: [],
  };

  it('accepts a report with a match, a summary and observations', () => {
    expect(reportSubmissionSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a report with no observations', () => {
    expect(reportSubmissionSchema.safeParse({ ...valid, observations: [] }).success).toBe(false);
  });

  it('rejects a one-word summary', () => {
    expect(reportSubmissionSchema.safeParse({ ...valid, verifier_summary: 'Fine' }).success).toBe(
      false,
    );
  });
});

describe('auth', () => {
  it('rejects a short password on sign-up', () => {
    const result = registerSchema.safeParse({
      first_name: 'Marco',
      email: 'marco@example.com',
      password: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a malformed email', () => {
    expect(loginSchema.safeParse({ email: 'nope', password: 'secret123' }).success).toBe(false);
  });
});
