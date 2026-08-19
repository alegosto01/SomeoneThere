/**
 * Account deletion (spec §59: "ability to delete account").
 *
 * A client holding an anon key cannot delete an auth user, so it asks here and
 * this function does it with the service role. Every owned row — profile,
 * properties, visits, reports, media rows, payments, device tokens — cascades
 * from `auth.users`, so one delete is genuinely one delete.
 *
 * Deploy: supabase functions deploy delete-account
 * Secrets: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'unauthorized' }, 401);

    // Identify the caller from their own token — the id to delete is never
    // taken from the request body.
    const asUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData, error: userError } = await asUser.auth.getUser();
    if (userError || !userData.user) return json({ error: 'unauthorized' }, 401);

    const userId = userData.user.id;
    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Refuse while a visit is still live. Deleting the customer mid-viewing
    // would strand a verifier who is standing in someone's flat.
    const { data: active } = await admin
      .from('visits')
      .select('id')
      .eq('customer_id', userId)
      .in('status', ['verifier_en_route', 'verifier_arrived', 'live'])
      .limit(1);

    if (active && active.length > 0) {
      return json({ error: 'visit_in_progress' }, 409);
    }

    // Stored objects do not cascade with the row that references them.
    for (const bucket of ['avatars', 'visit-media']) {
      const { data: files } = await admin.storage.from(bucket).list(userId);
      if (files?.length) {
        await admin.storage
          .from(bucket)
          .remove(files.map((file) => `${userId}/${file.name}`));
      }
    }

    const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
    if (deleteError) throw deleteError;

    return json({ deleted: true });
  } catch (error) {
    console.error('delete-account failed', error);
    return json({ error: 'delete_failed' }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
