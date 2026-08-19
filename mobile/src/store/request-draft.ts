import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_CITY } from '@/constants/config';
import type { PriorityKey } from '@/constants/priorities';
import type { LiveCallProvider, PropertyContactType, PropertyType } from '@/types';

/**
 * The in-progress request wizard (spec §8–§13).
 *
 * Persisted so a customer who is interrupted halfway through — a phone call, a
 * dead battery — comes back to the answers they already gave rather than an
 * empty form. Cleared once the visit draft has been created.
 */
export interface RequestDraft {
  listing_url: string;
  address_line: string;
  city: string;
  postal_code: string;
  neighborhood: string;
  property_type: PropertyType;
  advertised_rent: string;

  scheduled_at: string | null;
  expected_duration_minutes: number;
  contact_name: string;
  contact_type: PropertyContactType;
  contact_phone: string;
  contact_email: string;
  access_confirmed: boolean;

  priorities: PriorityKey[];
  customer_notes: string;

  live_call_requested: boolean;
  live_call_provider: LiveCallProvider;
  recording_requested: boolean;
  photos_requested: boolean;
}

const EMPTY: RequestDraft = {
  listing_url: '',
  address_line: '',
  city: DEFAULT_CITY,
  postal_code: '',
  neighborhood: '',
  property_type: 'apartment',
  advertised_rent: '',

  scheduled_at: null,
  expected_duration_minutes: 30,
  contact_name: '',
  contact_type: 'agent',
  contact_phone: '',
  contact_email: '',
  access_confirmed: false,

  priorities: [],
  customer_notes: '',

  live_call_requested: true,
  live_call_provider: 'google_meet',
  // No recording by default, ever (spec §12).
  recording_requested: false,
  photos_requested: true,
};

interface RequestDraftStore {
  draft: RequestDraft;
  update: (patch: Partial<RequestDraft>) => void;
  togglePriority: (key: PriorityKey) => void;
  reset: () => void;
}

export const useRequestDraft = create<RequestDraftStore>()(
  persist(
    (set) => ({
      draft: EMPTY,
      update: (patch) => set((state) => ({ draft: { ...state.draft, ...patch } })),
      togglePriority: (key) =>
        set((state) => ({
          draft: {
            ...state.draft,
            priorities: state.draft.priorities.includes(key)
              ? state.draft.priorities.filter((item) => item !== key)
              : [...state.draft.priorities, key],
          },
        })),
      reset: () => set({ draft: EMPTY }),
    }),
    {
      name: 'someonethere.request-draft',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const EMPTY_REQUEST_DRAFT = EMPTY;
