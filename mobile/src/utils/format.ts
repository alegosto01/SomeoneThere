import { DEFAULT_CURRENCY } from '@/constants/config';

export function formatMoney(
  amount: number,
  currency = DEFAULT_CURRENCY,
  language = 'en',
): string {
  return new Intl.NumberFormat(language.startsWith('es') ? 'es-ES' : 'en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

/**
 * Customers see a verifier's first name and last initial only (spec §16) —
 * never the full surname.
 */
export function verifierDisplayName(firstName: string, lastInitial: string | null): string {
  return lastInitial ? `${firstName} ${lastInitial}.` : firstName;
}

export function initials(firstName?: string | null, lastName?: string | null): string {
  const a = firstName?.trim()?.[0] ?? '';
  const b = lastName?.trim()?.[0] ?? '';
  return (a + b).toUpperCase() || '?';
}

/** Single-line address for cards: "Calle de Fuencarral 123". */
export function shortAddress(addressLine: string): string {
  return addressLine.split('\n')[0]?.trim() ?? addressLine;
}

export function fullAddress(property: {
  address_line: string;
  postal_code?: string | null;
  city: string;
}): string {
  return [property.address_line, property.postal_code, property.city]
    .filter(Boolean)
    .join(', ');
}

/**
 * Strip control characters and clamp length before a value reaches the database
 * (spec §58: sanitised text inputs).
 */
const CONTROL_CHARS = new RegExp('[\\u0000-\\u001F\\u007F]', 'g');

export function sanitizeText(input: string, maxLength = 2000): string {
  return input.replace(CONTROL_CHARS, '').trim().slice(0, maxLength);
}
