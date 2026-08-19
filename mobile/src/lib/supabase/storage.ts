import { supabase } from './client';
import { STORAGE_BUCKET_AVATARS, STORAGE_BUCKET_VISIT_MEDIA } from '@/constants/config';

/**
 * Visit media lives in a private bucket and is only ever served through short
 * lived signed URLs (spec §27, §44). Nothing here should ever call getPublicUrl
 * on `visit-media`.
 */
const SIGNED_URL_TTL_SECONDS = 60 * 10;

export async function signVisitMediaUrl(storagePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET_VISIT_MEDIA)
    .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS);
  if (error) throw error;
  return data.signedUrl;
}

export async function signVisitMediaUrls(
  storagePaths: string[],
): Promise<Record<string, string>> {
  if (storagePaths.length === 0) return {};
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET_VISIT_MEDIA)
    .createSignedUrls(storagePaths, SIGNED_URL_TTL_SECONDS);
  if (error) throw error;
  // createSignedUrls reports per-object failures inline rather than throwing, so
  // entries with no path or no URL are dropped instead of being cast away.
  const signed: Record<string, string> = {};
  for (const item of data) {
    if (item.path && item.signedUrl) signed[item.path] = item.signedUrl;
  }
  return signed;
}

export async function uploadVisitMedia(params: {
  visitId: string;
  reportId: string;
  fileUri: string;
  contentType: string;
  fileName: string;
}): Promise<string> {
  // Path prefix is `${visitId}/` — the storage RLS policies key off the first
  // path segment to decide who may read the object.
  const storagePath = `${params.visitId}/${params.reportId}/${Date.now()}-${params.fileName}`;
  const response = await fetch(params.fileUri);
  const arrayBuffer = await response.arrayBuffer();

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET_VISIT_MEDIA)
    .upload(storagePath, arrayBuffer, {
      contentType: params.contentType,
      upsert: false,
    });
  if (error) throw error;
  return storagePath;
}

export async function uploadAvatar(userId: string, fileUri: string): Promise<string> {
  const storagePath = `${userId}/avatar-${Date.now()}.jpg`;
  const response = await fetch(fileUri);
  const arrayBuffer = await response.arrayBuffer();
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET_AVATARS)
    .upload(storagePath, arrayBuffer, { contentType: 'image/jpeg', upsert: true });
  if (error) throw error;
  return storagePath;
}
