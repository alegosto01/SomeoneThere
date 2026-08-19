import { supabase, toUserFacingError } from '@/lib/supabase/client';
import type { Profile, VerifierProfile } from '@/types';
import type { ProfileInput } from '@/utils/validation';

export async function updateProfile(userId: string, input: ProfileInput): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      first_name: input.first_name,
      last_name: input.last_name || null,
      phone: input.phone || null,
      preferred_language: input.preferred_language,
    })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw toUserFacingError(error);
  return data;
}

export async function fetchVerifierProfile(userId: string): Promise<VerifierProfile | null> {
  const { data, error } = await supabase
    .from('verifier_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw toUserFacingError(error);
  return data;
}

export async function updateVerifierProfile(
  userId: string,
  input: { bio: string | null; languages: string[] },
): Promise<VerifierProfile> {
  const { data, error } = await supabase
    .from('verifier_profiles')
    .update({ bio: input.bio, languages: input.languages })
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw toUserFacingError(error);
  return data;
}

/**
 * Account deletion (spec §59). A client cannot delete an auth user, so this asks
 * the backend to; every owned row cascades from `auth.users`.
 */
export async function requestAccountDeletion() {
  const { data, error } = await supabase.functions.invoke('delete-account');
  if (error) throw toUserFacingError(error);
  // Deletion is refused while a viewing is actually happening — that would
  // strand a verifier standing in someone's flat.
  if (data?.error === 'visit_in_progress') throw new Error('profile.delete_blocked');
  await supabase.auth.signOut();
}
