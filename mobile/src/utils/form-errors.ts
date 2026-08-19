import type { ZodIssue } from 'zod';

/**
 * Turns Zod issues into a { field: message } map for form rendering.
 * Messages are i18n keys, so callers run them through `t()`.
 */
export function fieldErrors(issues: Pick<ZodIssue, 'path' | 'message'>[]): Record<string, string> {
  return Object.fromEntries(
    issues.map((issue) => [String(issue.path[0] ?? 'form'), issue.message]),
  );
}
