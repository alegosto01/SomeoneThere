import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AnswerSource, ListingMatch, ObservationRating } from '@/types';

/**
 * Offline protection for the verifier (spec §47).
 *
 * A verifier is often inside a building with no usable signal. Everything they
 * type is written to device storage first and synced opportunistically, so a
 * dropped connection can never lose a note. The remote write is best-effort;
 * this store is the source of truth until submission succeeds.
 */

export interface ObservationDraft {
  rating: ObservationRating;
  note: string;
}

export interface QuestionDraft {
  question: string;
  answer: string;
  answer_source: AnswerSource | null;
}

export interface ReportDraft {
  visitId: string;
  reportId: string | null;
  listing_match: ListingMatch | null;
  verifier_summary: string;
  observations: Record<string, ObservationDraft>;
  differences: string[];
  questions: QuestionDraft[];
  unchecked_areas: string[];
  /** Local file URIs queued for upload once there is a connection. */
  pending_photos: { uri: string; caption: string }[];
  updated_at: string;
}

function emptyDraft(visitId: string): ReportDraft {
  return {
    visitId,
    reportId: null,
    listing_match: null,
    verifier_summary: '',
    observations: {},
    differences: [],
    questions: [],
    unchecked_areas: [],
    pending_photos: [],
    updated_at: new Date().toISOString(),
  };
}

interface ChecklistStore {
  drafts: Record<string, ReportDraft>;
  getDraft: (visitId: string) => ReportDraft;
  setReportId: (visitId: string, reportId: string) => void;
  setObservation: (visitId: string, category: string, value: Partial<ObservationDraft>) => void;
  setField: <K extends keyof ReportDraft>(visitId: string, key: K, value: ReportDraft[K]) => void;
  addDifference: (visitId: string, description: string) => void;
  removeDifference: (visitId: string, index: number) => void;
  addQuestion: (visitId: string, question: QuestionDraft) => void;
  updateQuestion: (visitId: string, index: number, patch: Partial<QuestionDraft>) => void;
  removeQuestion: (visitId: string, index: number) => void;
  addUncheckedArea: (visitId: string, description: string) => void;
  removeUncheckedArea: (visitId: string, index: number) => void;
  queuePhoto: (visitId: string, uri: string, caption: string) => void;
  dequeuePhoto: (visitId: string, uri: string) => void;
  clear: (visitId: string) => void;
}

export const useChecklistDraft = create<ChecklistStore>()(
  persist(
    (set, get) => {
      const mutate = (visitId: string, apply: (draft: ReportDraft) => ReportDraft) =>
        set((state) => {
          const current = state.drafts[visitId] ?? emptyDraft(visitId);
          return {
            drafts: {
              ...state.drafts,
              [visitId]: { ...apply(current), updated_at: new Date().toISOString() },
            },
          };
        });

      return {
        drafts: {},

        getDraft: (visitId) => get().drafts[visitId] ?? emptyDraft(visitId),

        setReportId: (visitId, reportId) => mutate(visitId, (d) => ({ ...d, reportId })),

        setObservation: (visitId, category, value) =>
          mutate(visitId, (d) => ({
            ...d,
            observations: {
              ...d.observations,
              [category]: {
                rating: value.rating ?? d.observations[category]?.rating ?? 'not_checked',
                note: value.note ?? d.observations[category]?.note ?? '',
              },
            },
          })),

        setField: (visitId, key, value) => mutate(visitId, (d) => ({ ...d, [key]: value })),

        addDifference: (visitId, description) =>
          mutate(visitId, (d) => ({ ...d, differences: [...d.differences, description] })),

        removeDifference: (visitId, index) =>
          mutate(visitId, (d) => ({
            ...d,
            differences: d.differences.filter((_, i) => i !== index),
          })),

        addQuestion: (visitId, question) =>
          mutate(visitId, (d) => ({ ...d, questions: [...d.questions, question] })),

        updateQuestion: (visitId, index, patch) =>
          mutate(visitId, (d) => ({
            ...d,
            questions: d.questions.map((q, i) => (i === index ? { ...q, ...patch } : q)),
          })),

        removeQuestion: (visitId, index) =>
          mutate(visitId, (d) => ({
            ...d,
            questions: d.questions.filter((_, i) => i !== index),
          })),

        addUncheckedArea: (visitId, description) =>
          mutate(visitId, (d) => ({ ...d, unchecked_areas: [...d.unchecked_areas, description] })),

        removeUncheckedArea: (visitId, index) =>
          mutate(visitId, (d) => ({
            ...d,
            unchecked_areas: d.unchecked_areas.filter((_, i) => i !== index),
          })),

        queuePhoto: (visitId, uri, caption) =>
          mutate(visitId, (d) => ({
            ...d,
            pending_photos: [...d.pending_photos, { uri, caption }],
          })),

        dequeuePhoto: (visitId, uri) =>
          mutate(visitId, (d) => ({
            ...d,
            pending_photos: d.pending_photos.filter((photo) => photo.uri !== uri),
          })),

        clear: (visitId) =>
          set((state) => {
            const next = { ...state.drafts };
            delete next[visitId];
            return { drafts: next };
          }),
      };
    },
    {
      name: 'someonethere.report-drafts',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export { emptyDraft };
