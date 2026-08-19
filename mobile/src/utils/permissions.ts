import type { Visit } from '@/types';

/**
 * Capture permissions (spec §12, §32, §63).
 *
 * The governing rule: a *request* from the customer never implies *consent*
 * from the property contact. `*_requested` is what the customer asked for;
 * `*_allowed` is what the property contact agreed to on site. Only the second
 * one may unlock capture.
 */

export interface CapturePermissions {
  canTakePhotos: boolean;
  canRecordVideo: boolean;
  /** Customer asked for photos but on-site permission is still missing. */
  photosPendingPermission: boolean;
  recordingPendingPermission: boolean;
}

export function capturePermissions(
  visit: Pick<
    Visit,
    'photos_requested' | 'photos_allowed' | 'recording_requested' | 'recording_allowed'
  >,
): CapturePermissions {
  return {
    canTakePhotos: visit.photos_requested && visit.photos_allowed,
    canRecordVideo: visit.recording_requested && visit.recording_allowed,
    photosPendingPermission: visit.photos_requested && !visit.photos_allowed,
    recordingPendingPermission: visit.recording_requested && !visit.recording_allowed,
  };
}

/**
 * A verifier may only start the visit once third-party attendance is confirmed
 * and they have been assigned to it.
 */
export function canVerifierCheckIn(
  visit: Pick<Visit, 'access_confirmed' | 'verifier_id' | 'status' | 'checked_in_at'>,
  verifierId: string,
): boolean {
  if (visit.verifier_id !== verifierId) return false;
  if (visit.checked_in_at) return false;
  if (!visit.access_confirmed) return false;
  return visit.status === 'verifier_assigned' || visit.status === 'verifier_en_route';
}

export function canVerifierCheckOut(
  visit: Pick<Visit, 'verifier_id' | 'status' | 'checked_in_at' | 'checked_out_at'>,
  verifierId: string,
): boolean {
  if (visit.verifier_id !== verifierId) return false;
  if (!visit.checked_in_at || visit.checked_out_at) return false;
  return visit.status === 'verifier_arrived' || visit.status === 'live';
}

/** Verifiers may edit a report only until it is submitted (spec §43). */
export function canEditReport(
  report: { submitted_at: string | null },
  visit: Pick<Visit, 'verifier_id'>,
  verifierId: string,
): boolean {
  return report.submitted_at === null && visit.verifier_id === verifierId;
}
