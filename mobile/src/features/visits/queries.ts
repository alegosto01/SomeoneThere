import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { analytics } from '@/lib/analytics';
import type { CancellationReason } from '@/types';

import * as api from './api';

export const visitKeys = {
  all: ['visits'] as const,
  customer: (customerId: string) => ['visits', 'customer', customerId] as const,
  verifier: (verifierId: string) => ['visits', 'verifier', verifierId] as const,
  detail: (visitId: string) => ['visits', 'detail', visitId] as const,
};

export function useCustomerVisits(customerId: string | undefined) {
  return useQuery({
    queryKey: visitKeys.customer(customerId ?? ''),
    queryFn: () => api.fetchCustomerVisits(customerId!),
    enabled: !!customerId,
  });
}

export function useVerifierVisits(verifierId: string | undefined) {
  return useQuery({
    queryKey: visitKeys.verifier(verifierId ?? ''),
    queryFn: () => api.fetchVerifierVisits(verifierId!),
    enabled: !!verifierId,
  });
}

export function useVisit(visitId: string | undefined) {
  return useQuery({
    queryKey: visitKeys.detail(visitId ?? ''),
    queryFn: () => api.fetchVisit(visitId!),
    enabled: !!visitId,
  });
}

export function useCreateVisitDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createVisitDraft,
    onSuccess: (visit) => {
      void queryClient.invalidateQueries({ queryKey: visitKeys.all });
      analytics.track('property_added', { visit_id: visit.id });
    },
  });
}

export function useCancelVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ visitId, reason }: { visitId: string; reason: CancellationReason }) =>
      api.cancelVisit(visitId, reason),
    onSuccess: (_data, { visitId }) => {
      void queryClient.invalidateQueries({ queryKey: visitKeys.all });
      analytics.track('booking_cancelled', { visit_id: visitId });
    },
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.checkIn,
    onSuccess: (_data, visitId) => {
      void queryClient.invalidateQueries({ queryKey: visitKeys.all });
      analytics.track('verifier_checked_in', { visit_id: visitId });
    },
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.checkOut,
    onSuccess: (_data, visitId) => {
      void queryClient.invalidateQueries({ queryKey: visitKeys.all });
      analytics.track('verifier_checked_out', { visit_id: visitId });
    },
  });
}

export function useRecordConsent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      visitId,
      photosAllowed,
      recordingAllowed,
    }: {
      visitId: string;
      photosAllowed: boolean;
      recordingAllowed: boolean;
    }) => api.recordCaptureConsent(visitId, photosAllowed, recordingAllowed),
    onSuccess: (_data, { visitId }) => {
      void queryClient.invalidateQueries({ queryKey: visitKeys.detail(visitId) });
    },
  });
}

export function useStartLiveCall() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ visitId, url }: { visitId: string; url: string }) =>
      api.startLiveCall(visitId, url),
    onSuccess: (_data, { visitId }) => {
      void queryClient.invalidateQueries({ queryKey: visitKeys.detail(visitId) });
    },
  });
}
