import {
  canEditReport,
  canVerifierCheckIn,
  canVerifierCheckOut,
  capturePermissions,
} from '@/utils/permissions';

const VERIFIER = 'verifier-1';
const OTHER_VERIFIER = 'verifier-2';

describe('capture permissions', () => {
  it('does not treat a customer request as consent', () => {
    // The single most important rule in the product: asking for photos when
    // booking never authorises taking them (spec §63).
    const permissions = capturePermissions({
      photos_requested: true,
      photos_allowed: false,
      recording_requested: true,
      recording_allowed: false,
    });

    expect(permissions.canTakePhotos).toBe(false);
    expect(permissions.canRecordVideo).toBe(false);
    expect(permissions.photosPendingPermission).toBe(true);
    expect(permissions.recordingPendingPermission).toBe(true);
  });

  it('allows capture only when requested and allowed agree', () => {
    const permissions = capturePermissions({
      photos_requested: true,
      photos_allowed: true,
      recording_requested: false,
      recording_allowed: false,
    });

    expect(permissions.canTakePhotos).toBe(true);
    expect(permissions.canRecordVideo).toBe(false);
    expect(permissions.photosPendingPermission).toBe(false);
  });

  it('refuses capture that was never requested, even if a flag says allowed', () => {
    // Defensive: a stale or tampered `allowed` flag must not unlock recording
    // the customer never asked for.
    const permissions = capturePermissions({
      photos_requested: false,
      photos_allowed: true,
      recording_requested: false,
      recording_allowed: true,
    });

    expect(permissions.canTakePhotos).toBe(false);
    expect(permissions.canRecordVideo).toBe(false);
  });
});

describe('verifier check-in', () => {
  const visit = {
    access_confirmed: true,
    verifier_id: VERIFIER,
    status: 'verifier_assigned' as const,
    checked_in_at: null,
  };

  it('is allowed for the assigned verifier on a confirmed visit', () => {
    expect(canVerifierCheckIn(visit, VERIFIER)).toBe(true);
  });

  it('is refused for a verifier who is not assigned', () => {
    expect(canVerifierCheckIn(visit, OTHER_VERIFIER)).toBe(false);
  });

  it('is refused before access has been confirmed', () => {
    expect(canVerifierCheckIn({ ...visit, access_confirmed: false }, VERIFIER)).toBe(false);
  });

  it('is refused twice', () => {
    expect(
      canVerifierCheckIn({ ...visit, checked_in_at: '2026-08-19T15:00:00Z' }, VERIFIER),
    ).toBe(false);
  });
});

describe('verifier check-out', () => {
  const visit = {
    verifier_id: VERIFIER,
    status: 'verifier_arrived' as const,
    checked_in_at: '2026-08-19T15:00:00Z',
    checked_out_at: null,
  };

  it('is allowed after check-in', () => {
    expect(canVerifierCheckOut(visit, VERIFIER)).toBe(true);
  });

  it('is refused before check-in', () => {
    expect(canVerifierCheckOut({ ...visit, checked_in_at: null }, VERIFIER)).toBe(false);
  });

  it('is refused for another verifier', () => {
    expect(canVerifierCheckOut(visit, OTHER_VERIFIER)).toBe(false);
  });
});

describe('report editing', () => {
  it('is allowed to the assigned verifier before submission', () => {
    expect(canEditReport({ submitted_at: null }, { verifier_id: VERIFIER }, VERIFIER)).toBe(true);
  });

  it('is refused once the report has been submitted', () => {
    expect(
      canEditReport({ submitted_at: '2026-08-19T18:00:00Z' }, { verifier_id: VERIFIER }, VERIFIER),
    ).toBe(false);
  });

  it('is refused to an unrelated verifier', () => {
    expect(canEditReport({ submitted_at: null }, { verifier_id: VERIFIER }, OTHER_VERIFIER)).toBe(
      false,
    );
  });
});
