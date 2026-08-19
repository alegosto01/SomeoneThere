import { format, formatDistanceToNowStrict, isToday, isTomorrow, parseISO } from 'date-fns';
import { enGB, es } from 'date-fns/locale';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

import { MARKET_TIMEZONE } from '@/constants/config';

/**
 * Timestamps are stored in UTC and rendered in the visit's local timezone
 * (spec §52). Never format a user-facing time by hand-concatenating strings.
 */

function localeFor(language: string) {
  return language.startsWith('es') ? es : enGB;
}

export function toMarketTime(iso: string, timeZone = MARKET_TIMEZONE): Date {
  return toZonedTime(parseISO(iso), timeZone);
}

export function formatVisitDateTime(
  iso: string,
  language = 'en',
  timeZone = MARKET_TIMEZONE,
): string {
  return formatInTimeZone(parseISO(iso), timeZone, 'd MMM · HH:mm', {
    locale: localeFor(language),
  });
}

export function formatVisitDateLong(
  iso: string,
  language = 'en',
  timeZone = MARKET_TIMEZONE,
): string {
  return formatInTimeZone(parseISO(iso), timeZone, 'd MMMM yyyy', {
    locale: localeFor(language),
  });
}

export function formatTime(iso: string, timeZone = MARKET_TIMEZONE): string {
  return formatInTimeZone(parseISO(iso), timeZone, 'HH:mm');
}

/**
 * "Today" / "Tomorrow" / neither — used on the home screen's next-visit card.
 * Returns a key so the caller keeps control of the language.
 */
export function relativeDayKey(
  iso: string,
  timeZone = MARKET_TIMEZONE,
): 'today' | 'tomorrow' | null {
  const zoned = toZonedTime(parseISO(iso), timeZone);
  if (isToday(zoned)) return 'today';
  if (isTomorrow(zoned)) return 'tomorrow';
  return null;
}

export function isFuture(iso: string): boolean {
  return parseISO(iso).getTime() > Date.now();
}

export function durationBetween(startIso: string, endIso: string): number {
  return Math.max(
    0,
    Math.round((parseISO(endIso).getTime() - parseISO(startIso).getTime()) / 60000),
  );
}

export function timeAgo(iso: string, language = 'en'): string {
  return formatDistanceToNowStrict(parseISO(iso), {
    addSuffix: true,
    locale: localeFor(language),
  });
}

export { format };
