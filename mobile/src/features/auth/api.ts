import { supabase } from '@/lib/supabase/client';
import { analytics } from '@/lib/analytics';
import type { LoginInput, RegisterInput } from '@/utils/validation';

export async function signIn(input: LoginInput) {
  const { error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });
  if (error) throw mapAuthError(error.message);
}

export async function signUp(input: RegisterInput) {
  const { error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { first_name: input.first_name, last_name: input.last_name },
    },
  });
  if (error) throw mapAuthError(error.message);
  analytics.track('signup_completed');
}

/**
 * Google sign-in via Supabase OAuth. On native this opens the system browser
 * and returns through the `someonethere://auth/callback` deep link.
 */
export async function signInWithGoogle(redirectTo: string) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error) throw mapAuthError(error.message);
  return data.url;
}

export async function completeOAuthSession(url: string) {
  const params = new URL(url).hash.replace(/^#/, '');
  const search = new URLSearchParams(params);
  const access_token = search.get('access_token');
  const refresh_token = search.get('refresh_token');
  if (!access_token || !refresh_token) throw new Error('auth.errors.invalid_credentials');
  const { error } = await supabase.auth.setSession({ access_token, refresh_token });
  if (error) throw mapAuthError(error.message);
}

/** Supabase messages are English and technical; map the ones users will hit. */
function mapAuthError(message: string): Error {
  if (message.includes('Invalid login credentials')) {
    return new Error('auth.errors.invalid_credentials');
  }
  if (message.includes('already registered') || message.includes('already been registered')) {
    return new Error('auth.errors.email_taken');
  }
  if (message.includes('Password should be')) {
    return new Error('auth.errors.password_too_short');
  }
  return new Error(message);
}
