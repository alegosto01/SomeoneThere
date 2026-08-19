import type { VisitStatus } from '@/types';

/**
 * Ordered milestones shown on the customer timeline (spec §15). Several raw
 * statuses collapse into one milestone — the customer cares about "verifier is
 * on the way", not about the difference between `verifier_pending` and
 * `verifier_assigned`.
 */
export const TIMELINE_STEPS = [
  'booking_received',
  'access_confirmed',
  'verifier_assigned',
  'verifier_on_the_way',
  'viewing_started',
  'report_ready',
] as const;

export type TimelineStep = (typeof TIMELINE_STEPS)[number];

/** How far each status has progressed: index into TIMELINE_STEPS, -1 if none. */
const STATUS_PROGRESS: Record<VisitStatus, number> = {
  draft: -1,
  payment_pending: -1,
  request_received: 0,
  access_pending: 0,
  access_confirmed: 1,
  verifier_pending: 1,
  verifier_assigned: 2,
  verifier_en_route: 3,
  verifier_arrived: 3,
  live: 4,
  visit_completed: 4,
  report_pending: 4,
  report_ready: 5,
  cancelled: -1,
  access_failed: -1,
  refunded: -1,
};

export type TimelineState = 'done' | 'current' | 'pending';

export interface TimelineEntry {
  step: TimelineStep;
  state: TimelineState;
}

export function buildTimeline(status: VisitStatus): TimelineEntry[] {
  const reached = STATUS_PROGRESS[status];
  return TIMELINE_STEPS.map((step, index) => ({
    step,
    state: index < reached ? 'done' : index === reached ? 'current' : 'pending',
  }));
}

const TERMINAL_STATUSES: readonly VisitStatus[] = [
  'cancelled',
  'access_failed',
  'refunded',
];

export function isTerminal(status: VisitStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}

export function isCompleted(status: VisitStatus): boolean {
  return status === 'visit_completed' || status === 'report_pending' || status === 'report_ready';
}

/**
 * A visit is "upcoming" while it is neither finished nor completed. Defined in
 * terms of the other two predicates so the Visits tabs cannot both claim the
 * same visit — an earlier version compared progress numbers and listed
 * `report_pending` in both.
 */
export function isUpcoming(status: VisitStatus): boolean {
  return !isTerminal(status) && !isCompleted(status) && STATUS_PROGRESS[status] >= 0;
}

export function hasReport(status: VisitStatus): boolean {
  return status === 'report_ready';
}

/**
 * Tone for the status badge. Never red for ordinary in-progress states — red is
 * reserved for genuine failure (spec §49).
 */
export type StatusTone = 'positive' | 'attention' | 'negative' | 'neutral';

export function statusTone(status: VisitStatus): StatusTone {
  switch (status) {
    case 'access_confirmed':
    case 'verifier_assigned':
    case 'verifier_en_route':
    case 'verifier_arrived':
    case 'live':
    case 'visit_completed':
    case 'report_ready':
      return 'positive';
    case 'draft':
    case 'payment_pending':
    case 'request_received':
    case 'access_pending':
    case 'verifier_pending':
    case 'report_pending':
      return 'attention';
    case 'cancelled':
    case 'access_failed':
      return 'negative';
    case 'refunded':
      return 'neutral';
  }
}

/**
 * Whether the customer may open the live call. Payment and assignment are not
 * enough — an operator/verifier has to mark the session ready (spec §17).
 */
export function canJoinLiveCall(visit: {
  status: VisitStatus;
  live_call_url: string | null;
  live_call_ready: boolean;
}): boolean {
  if (!visit.live_call_url || !visit.live_call_ready) return false;
  return (
    visit.status === 'verifier_arrived' ||
    visit.status === 'verifier_en_route' ||
    visit.status === 'live'
  );
}

/** The customer may cancel until the verifier has physically arrived. */
export function canCustomerCancel(status: VisitStatus): boolean {
  if (isTerminal(status) || isCompleted(status)) return false;
  return status !== 'live' && status !== 'verifier_arrived';
}
