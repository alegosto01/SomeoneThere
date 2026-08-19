import * as ImageManipulator from 'expo-image-manipulator';

import {
  addReportMedia,
  replaceDifferences,
  replaceQuestions,
  replaceUncheckedAreas,
  saveReportDraft,
  upsertObservation,
} from '@/features/reports/api';
import { captureError } from '@/lib/monitoring';
import { uploadVisitMedia } from '@/lib/supabase/storage';
import type { ReportDraft } from '@/store/checklist-draft';

/**
 * Pushes a locally-held report draft to the backend (spec §47).
 *
 * Called opportunistically — after each checklist section and again before
 * submission. Failures are swallowed and reported to monitoring rather than
 * thrown, because the local draft is still intact and a retry will follow; only
 * the final submit surfaces an error to the verifier.
 */
export async function syncReportDraft(draft: ReportDraft): Promise<boolean> {
  if (!draft.reportId) return false;

  try {
    await saveReportDraft({
      reportId: draft.reportId,
      listingMatch: draft.listing_match,
      verifierSummary: draft.verifier_summary || null,
    });

    const categories = Object.entries(draft.observations);
    for (const [index, [category, observation]] of categories.entries()) {
      await upsertObservation({
        reportId: draft.reportId,
        category,
        rating: observation.rating,
        note: observation.note || null,
        sortOrder: index,
      });
    }

    await replaceDifferences(draft.reportId, draft.differences);
    await replaceUncheckedAreas(draft.reportId, draft.unchecked_areas);
    await replaceQuestions(
      draft.reportId,
      draft.questions
        .filter((entry) => entry.question.trim().length > 0)
        .map((entry) => ({
          question: entry.question,
          answer: entry.answer,
          answer_source: entry.answer_source,
        })),
    );

    return true;
  } catch (error) {
    captureError(error, { area: 'report_sync' });
    return false;
  }
}

/**
 * Uploads one queued photo. Images are compressed and re-encoded before upload,
 * which also drops the EXIF block — location and device metadata never reach
 * the bucket (spec §27).
 */
export async function uploadQueuedPhoto(params: {
  visitId: string;
  reportId: string;
  uri: string;
  caption: string;
}): Promise<boolean> {
  try {
    const processed = await ImageManipulator.manipulateAsync(
      params.uri,
      [{ resize: { width: 1600 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
    );

    const storagePath = await uploadVisitMedia({
      visitId: params.visitId,
      reportId: params.reportId,
      fileUri: processed.uri,
      contentType: 'image/jpeg',
      fileName: 'photo.jpg',
    });

    await addReportMedia({
      reportId: params.reportId,
      storagePath,
      caption: params.caption || null,
    });

    return true;
  } catch (error) {
    captureError(error, { area: 'media_upload' });
    return false;
  }
}
