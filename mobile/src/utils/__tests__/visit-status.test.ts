import {
  buildTimeline,
  canCustomerCancel,
  canJoinLiveCall,
  hasReport,
  isCompleted,
  isTerminal,
  isUpcoming,
  statusTone,
  TIMELINE_STEPS,
} from '@/utils/visit-status';
import { VISIT_STATUSES, type VisitStatus } from '@/types';

describe('visit status mapping', () => {
  it('gives every status a timeline and a tone', () => {
    // A status added to the enum without updating these maps would render an
    // undefined badge, so the exhaustiveness is asserted rather than assumed.
    for (const status of VISIT_STATUSES) {
      expect(buildTimeline(status)).toHaveLength(TIMELINE_STEPS.length);
      expect(['positive', 'attention', 'negative', 'neutral']).toContain(statusTone(status));
    }
  });

  it('marks reached steps done and the current step current', () => {
    const timeline = buildTimeline('verifier_assigned');
    expect(timeline.map((entry) => entry.state)).toEqual([
      'done',
      'done',
      'current',
      'pending',
      'pending',
      'pending',
    ]);
  });

  it('shows nothing as reached before payment clears', () => {
    for (const status of ['draft', 'payment_pending'] as VisitStatus[]) {
      expect(buildTimeline(status).every((entry) => entry.state === 'pending')).toBe(true);
    }
  });

  it('marks a ready report as the final step', () => {
    const timeline = buildTimeline('report_ready');
    expect(timeline[timeline.length - 1]?.state).toBe('current');
    expect(hasReport('report_ready')).toBe(true);
    expect(hasReport('visit_completed')).toBe(false);
  });

  it('treats cancelled, failed access and refunded as terminal', () => {
    expect(isTerminal('cancelled')).toBe(true);
    expect(isTerminal('access_failed')).toBe(true);
    expect(isTerminal('refunded')).toBe(true);
    expect(isTerminal('verifier_assigned')).toBe(false);
  });

  it('never lists a visit as both upcoming and completed', () => {
    for (const status of VISIT_STATUSES) {
      expect(isUpcoming(status) && isCompleted(status)).toBe(false);
    }
  });

  it('never lists a terminal visit as upcoming', () => {
    for (const status of VISIT_STATUSES) {
      if (isTerminal(status)) expect(isUpcoming(status)).toBe(false);
    }
  });
});

describe('joining the live call', () => {
  const base = { status: 'verifier_arrived' as VisitStatus, live_call_url: 'https://meet.example/x', live_call_ready: true };

  it('opens once the verifier is at the property and the call is ready', () => {
    expect(canJoinLiveCall(base)).toBe(true);
  });

  it('stays shut without a URL', () => {
    expect(canJoinLiveCall({ ...base, live_call_url: null })).toBe(false);
  });

  it('stays shut until someone marks the call ready', () => {
    // Payment and assignment are not enough — a customer dialling into an empty
    // room before the verifier arrives is the failure this prevents.
    expect(canJoinLiveCall({ ...base, live_call_ready: false })).toBe(false);
  });

  it('stays shut while the visit is only booked', () => {
    expect(canJoinLiveCall({ ...base, status: 'verifier_assigned' })).toBe(false);
    expect(canJoinLiveCall({ ...base, status: 'request_received' })).toBe(false);
  });

  it('stays shut after the visit is over', () => {
    expect(canJoinLiveCall({ ...base, status: 'visit_completed' })).toBe(false);
    expect(canJoinLiveCall({ ...base, status: 'report_ready' })).toBe(false);
  });
});

describe('customer cancellation', () => {
  it('is allowed while the visit is still ahead', () => {
    expect(canCustomerCancel('request_received')).toBe(true);
    expect(canCustomerCancel('verifier_assigned')).toBe(true);
    expect(canCustomerCancel('verifier_en_route')).toBe(true);
  });

  it('is blocked once the verifier has arrived or the visit is over', () => {
    expect(canCustomerCancel('verifier_arrived')).toBe(false);
    expect(canCustomerCancel('live')).toBe(false);
    expect(canCustomerCancel('visit_completed')).toBe(false);
    expect(canCustomerCancel('report_ready')).toBe(false);
  });

  it('is blocked on an already-terminal visit', () => {
    expect(canCustomerCancel('cancelled')).toBe(false);
    expect(canCustomerCancel('refunded')).toBe(false);
  });
});
