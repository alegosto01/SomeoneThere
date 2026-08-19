import { z } from 'zod';

import { PRIORITY_KEYS } from '@/constants/priorities';
import { DEFAULT_CITY } from '@/constants/config';

/** Form validation rules (spec §63). */

export const emailSchema = z.string().trim().min(1).email();

export const passwordSchema = z
  .string()
  .min(8, 'auth.errors.password_too_short')
  .max(128);

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'auth.errors.password_required'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  first_name: z.string().trim().min(1, 'auth.errors.first_name_required').max(80),
  last_name: z.string().trim().max(80).optional().default(''),
  email: emailSchema,
  password: passwordSchema,
});
export type RegisterInput = z.infer<typeof registerSchema>;

/** Step 1 — Property. Listing URL is optional but must parse if provided. */
export const propertyStepSchema = z.object({
  listing_url: z
    .string()
    .trim()
    .url('request.errors.invalid_url')
    .optional()
    .or(z.literal('')),
  address_line: z.string().trim().min(3, 'request.errors.address_required').max(200),
  city: z.string().trim().min(1).max(80).default(DEFAULT_CITY),
  postal_code: z.string().trim().max(12).optional().or(z.literal('')),
  neighborhood: z.string().trim().max(80).optional().or(z.literal('')),
  property_type: z.enum(['room', 'studio', 'apartment', 'other']),
  advertised_rent: z
    .number({ invalid_type_error: 'request.errors.rent_number' })
    .positive()
    .max(100000)
    .nullable()
    .optional(),
});
export type PropertyStepInput = z.infer<typeof propertyStepSchema>;

/** Step 2 — Viewing details. Scheduled time must be in the future. */
export const viewingStepSchema = z.object({
  scheduled_at: z
    .string()
    .datetime({ offset: true })
    .refine((value) => new Date(value).getTime() > Date.now(), {
      message: 'request.errors.date_must_be_future',
    }),
  expected_duration_minutes: z.number().int().min(10).max(180).default(30),
  contact_name: z.string().trim().max(120).optional().or(z.literal('')),
  contact_type: z.enum(['landlord', 'agent', 'tenant', 'other']),
  contact_phone: z.string().trim().max(32).optional().or(z.literal('')),
  contact_email: z.string().trim().email().optional().or(z.literal('')),
  access_confirmed: z.boolean(),
});
export type ViewingStepInput = z.infer<typeof viewingStepSchema>;

/** Step 3 — At least one priority OR a free-text note. */
export const prioritiesStepSchema = z
  .object({
    priorities: z.array(z.enum(PRIORITY_KEYS)).default([]),
    customer_notes: z.string().trim().max(2000).default(''),
  })
  .refine((value) => value.priorities.length > 0 || value.customer_notes.length > 0, {
    message: 'request.errors.priorities_required',
    path: ['priorities'],
  });
export type PrioritiesStepInput = z.infer<typeof prioritiesStepSchema>;

/**
 * Step 4 — Preferences. A recording *request* never sets `recording_allowed`;
 * that flag is only ever set on site by the verifier (spec §63).
 */
export const preferencesStepSchema = z.object({
  live_call_requested: z.boolean().default(true),
  live_call_provider: z.enum(['google_meet', 'whatsapp', 'zoom', 'other']).default('google_meet'),
  recording_requested: z.boolean().default(false),
  photos_requested: z.boolean().default(true),
});
export type PreferencesStepInput = z.infer<typeof preferencesStepSchema>;

/** Report submission minimums (spec §37). */
export const reportSubmissionSchema = z.object({
  listing_match: z.enum([
    'consistent',
    'minor_differences',
    'major_differences',
    'unable_to_determine',
  ]),
  verifier_summary: z.string().trim().min(20, 'verifier.errors.summary_too_short').max(4000),
  observations: z
    .array(
      z.object({
        category: z.string(),
        rating: z.enum(['good', 'acceptable', 'concern', 'not_checked', 'not_applicable']),
        note: z.string().trim().max(1000).nullable().optional(),
      }),
    )
    .min(1, 'verifier.errors.observations_required'),
  unchecked_areas: z.array(z.string().trim().min(1).max(300)).default([]),
});
export type ReportSubmissionInput = z.infer<typeof reportSubmissionSchema>;

export const profileSchema = z.object({
  first_name: z.string().trim().min(1).max(80),
  last_name: z.string().trim().max(80).optional().or(z.literal('')),
  phone: z.string().trim().max(32).optional().or(z.literal('')),
  preferred_language: z.enum(['en', 'es']),
});
export type ProfileInput = z.infer<typeof profileSchema>;
