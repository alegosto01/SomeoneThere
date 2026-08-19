import type { ObservationRating } from '@/types';

/** Report observation categories (spec §23). */
export const OBSERVATION_CATEGORIES = [
  'natural_light',
  'street_noise',
  'internal_noise',
  'visible_damp',
  'visible_mould',
  'water_pressure',
  'drainage',
  'storage',
  'heating',
  'air_conditioning',
  'windows',
  'furniture',
  'kitchen',
  'bathroom',
  'building_entrance',
  'common_areas',
  'elevator',
  'mobile_signal',
  'general_cleanliness',
] as const;

export type ObservationCategory = (typeof OBSERVATION_CATEGORIES)[number];

/**
 * Verifier checklist groups (spec §35). Each entry maps a walkthrough section to
 * the observation categories captured there, so the verifier fills the report in
 * the order they physically move through the property.
 */
export interface ChecklistSection {
  key: string;
  categories: readonly ObservationCategory[];
}

export const CHECKLIST_SECTIONS: readonly ChecklistSection[] = [
  {
    key: 'bedroom',
    categories: [
      'natural_light',
      'windows',
      'storage',
      'furniture',
      'visible_damp',
      'visible_mould',
      'internal_noise',
    ],
  },
  {
    key: 'bathroom',
    categories: ['bathroom', 'water_pressure', 'drainage'],
  },
  {
    key: 'kitchen',
    categories: ['kitchen', 'general_cleanliness'],
  },
  {
    key: 'property',
    categories: ['heating', 'air_conditioning', 'mobile_signal'],
  },
  {
    key: 'building',
    categories: ['building_entrance', 'elevator', 'common_areas'],
  },
  {
    key: 'surroundings',
    categories: ['street_noise'],
  },
] as const;

/**
 * Categories a submitted report must have an explicit rating for (spec §37).
 * "not_checked" counts as an answer — the verifier saying "I could not look at
 * this" is information; leaving it blank is not.
 */
export const REQUIRED_OBSERVATION_CATEGORIES: readonly ObservationCategory[] = [
  'natural_light',
  'street_noise',
  'visible_damp',
  'visible_mould',
  'bathroom',
  'kitchen',
  'windows',
  'building_entrance',
];

export const OBSERVATION_RATINGS: readonly ObservationRating[] = [
  'good',
  'acceptable',
  'concern',
  'not_checked',
  'not_applicable',
];
