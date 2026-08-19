import * as SecureStore from 'expo-secure-store';

import { secureSessionStorage } from '@/lib/supabase/session-storage';

const store = (SecureStore as unknown as { __store: Map<string, string> }).__store;

describe('secure session storage', () => {
  beforeEach(() => store.clear());

  it('round-trips a short value', async () => {
    await secureSessionStorage.setItem('sb-session', 'abc');
    expect(await secureSessionStorage.getItem('sb-session')).toBe('abc');
  });

  it('round-trips a value larger than the SecureStore item limit', async () => {
    // A Supabase session with a fat JWT exceeds 2048 bytes, which is the whole
    // reason the adapter chunks at all.
    const long = 'x'.repeat(9000);
    await secureSessionStorage.setItem('sb-session', long);
    expect(await secureSessionStorage.getItem('sb-session')).toBe(long);
  });

  it('returns null for a key that was never written', async () => {
    expect(await secureSessionStorage.getItem('sb-session')).toBeNull();
  });

  it('cleans up chunks when a value shrinks', async () => {
    await secureSessionStorage.setItem('sb-session', 'y'.repeat(9000));
    await secureSessionStorage.setItem('sb-session', 'short');

    expect(await secureSessionStorage.getItem('sb-session')).toBe('short');
    // Only one chunk plus the index entry should remain — stale chunks from the
    // longer value would otherwise linger in the keystore.
    expect([...store.keys()].sort()).toEqual(['sb-session.0', 'sb-session.chunks']);
  });

  it('removes everything on sign-out', async () => {
    await secureSessionStorage.setItem('sb-session', 'z'.repeat(5000));
    await secureSessionStorage.removeItem('sb-session');

    expect(await secureSessionStorage.getItem('sb-session')).toBeNull();
    expect(store.size).toBe(0);
  });

  it('treats a partially-written session as absent', async () => {
    // If a write was interrupted, handing back a truncated token would produce
    // confusing auth failures rather than a clean signed-out state.
    await secureSessionStorage.setItem('sb-session', 'w'.repeat(5000));
    store.delete('sb-session.1');

    expect(await secureSessionStorage.getItem('sb-session')).toBeNull();
  });
});
