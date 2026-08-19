import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { analytics } from '@/lib/analytics';
import { visitKeys } from '@/features/visits/queries';
import type { ReportMedia } from '@/types';

import * as api from './api';

export const reportKeys = {
  all: ['reports'] as const,
  customer: (customerId: string) => ['reports', 'customer', customerId] as const,
  detail: (reportId: string) => ['reports', 'detail', reportId] as const,
  byVisit: (visitId: string) => ['reports', 'visit', visitId] as const,
  media: (reportId: string) => ['reports', 'media', reportId] as const,
};

export function useCustomerReports(customerId: string | undefined) {
  return useQuery({
    queryKey: reportKeys.customer(customerId ?? ''),
    queryFn: () => api.fetchCustomerReports(customerId!),
    enabled: !!customerId,
  });
}

export function useReport(reportId: string | undefined) {
  return useQuery({
    queryKey: reportKeys.detail(reportId ?? ''),
    queryFn: () => api.fetchReport(reportId!),
    enabled: !!reportId,
  });
}

export function useReportByVisit(visitId: string | undefined) {
  return useQuery({
    queryKey: reportKeys.byVisit(visitId ?? ''),
    queryFn: () => api.fetchReportByVisit(visitId!),
    enabled: !!visitId,
  });
}

/**
 * Signed photo URLs expire, so they are cached for less than their lifetime and
 * refetched rather than persisted.
 */
export function useSignedReportMedia(reportId: string | undefined, media: ReportMedia[]) {
  return useQuery({
    queryKey: reportKeys.media(reportId ?? ''),
    queryFn: () => api.signReportMedia(media),
    enabled: !!reportId && media.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useSaveReportDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.saveReportDraft,
    onSuccess: (_data, { reportId }) => {
      void queryClient.invalidateQueries({ queryKey: reportKeys.detail(reportId) });
    },
  });
}

export function useUpsertObservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.upsertObservation,
    onSuccess: (_data, { reportId }) => {
      void queryClient.invalidateQueries({ queryKey: reportKeys.detail(reportId) });
    },
  });
}

export function useSubmitReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.submitReport,
    onSuccess: (_data, reportId) => {
      void queryClient.invalidateQueries({ queryKey: reportKeys.all });
      void queryClient.invalidateQueries({ queryKey: visitKeys.all });
      analytics.track('report_submitted', { report_id: reportId });
    },
  });
}
