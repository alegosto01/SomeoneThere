/**
 * Customer priority checklist (spec §11). Keys are stable identifiers stored in
 * `visit_priorities.priority_key`; labels come from i18n (`priorities.<key>`).
 */
export const PRIORITY_KEYS = [
  'natural_light',
  'street_noise',
  'neighbor_noise',
  'bedroom_size',
  'storage_space',
  'damp_or_mould',
  'water_pressure',
  'drainage',
  'heating',
  'air_conditioning',
  'kitchen_condition',
  'bathroom_condition',
  'furniture',
  'windows',
  'mobile_signal',
  'building_entrance',
  'common_areas',
  'elevator',
  'neighborhood_surroundings',
  'listing_accuracy',
] as const;

export type PriorityKey = (typeof PRIORITY_KEYS)[number];

export function isPriorityKey(value: string): value is PriorityKey {
  return (PRIORITY_KEYS as readonly string[]).includes(value);
}
