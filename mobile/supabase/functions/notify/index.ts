/**
 * Push notifications for visit events (spec §38, §64).
 *
 * Triggered by backend events — a database webhook on `visit_events` insert, or
 * a direct call from another function — never by mobile state changes, so a
 * customer is notified even with the app closed.
 *
 * Deploy: supabase functions deploy notify
 * Secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const admin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const EXPO_PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';

/** Event -> i18n key. Bodies are built from the address, never the report text. */
const NOTIFIABLE: Record<string, string> = {
  booking_received: 'notifications.booking_received',
  access_confirmed: 'notifications.access_confirmed',
  access_failed: 'notifications.access_failed',
  verifier_assigned: 'notifications.verifier_assigned',
  verifier_en_route: 'notifications.verifier_en_route',
  verifier_arrived: 'notifications.verifier_arrived',
  live_started: 'notifications.live_ready',
  visit_completed: 'notifications.visit_completed',
  report_ready: 'notifications.report_ready',
  visit_cancelled: 'notifications.visit_cancelled',
  refund_issued: 'notifications.refund_issued',
};

const COPY: Record<string, Record<string, { title: string; body: string }>> = {
  en: {
    'notifications.booking_received': { title: 'Request received', body: 'We are confirming access for {{address}}.' },
    'notifications.access_confirmed': { title: 'Access confirmed', body: 'Your viewing at {{address}} can go ahead.' },
    'notifications.access_failed': { title: 'Access could not be arranged', body: 'We could not arrange access at {{address}}. Open the app for details.' },
    'notifications.verifier_assigned': { title: 'Verifier assigned', body: 'A local verifier will attend {{address}} for you.' },
    'notifications.verifier_en_route': { title: 'Verifier on the way', body: 'Your verifier is heading to {{address}}.' },
    'notifications.verifier_arrived': { title: 'Verifier arrived', body: 'Your verifier is at {{address}}.' },
    'notifications.live_ready': { title: 'Live viewing ready', body: 'Join the viewing at {{address}} now.' },
    'notifications.visit_completed': { title: 'Viewing completed', body: 'The viewing at {{address}} is finished. The report is being written.' },
    'notifications.report_ready': { title: 'Your SomeoneThere report is ready', body: 'The viewing at {{address}} has been completed.' },
    'notifications.visit_cancelled': { title: 'Visit cancelled', body: 'Your viewing at {{address}} was cancelled.' },
    'notifications.refund_issued': { title: 'Refund issued', body: 'A refund for {{address}} has been issued.' },
  },
  es: {
    'notifications.booking_received': { title: 'Solicitud recibida', body: 'Estamos confirmando el acceso a {{address}}.' },
    'notifications.access_confirmed': { title: 'Acceso confirmado', body: 'Tu visita a {{address}} puede seguir adelante.' },
    'notifications.access_failed': { title: 'No se pudo gestionar el acceso', body: 'No pudimos gestionar el acceso a {{address}}. Abre la app para ver los detalles.' },
    'notifications.verifier_assigned': { title: 'Verificador asignado', body: 'Un verificador local acudira a {{address}} por ti.' },
    'notifications.verifier_en_route': { title: 'Verificador en camino', body: 'Tu verificador se dirige a {{address}}.' },
    'notifications.verifier_arrived': { title: 'Verificador en el inmueble', body: 'Tu verificador esta en {{address}}.' },
    'notifications.live_ready': { title: 'Videollamada lista', body: 'Unete ahora a la visita en {{address}}.' },
    'notifications.visit_completed': { title: 'Visita completada', body: 'La visita a {{address}} ha terminado. Estamos preparando el informe.' },
    'notifications.report_ready': { title: 'Tu informe de SomeoneThere esta listo', body: 'La visita a {{address}} se ha completado.' },
    'notifications.visit_cancelled': { title: 'Visita cancelada', body: 'Tu visita a {{address}} fue cancelada.' },
    'notifications.refund_issued': { title: 'Reembolso emitido', body: 'Se ha emitido un reembolso para {{address}}.' },
  },
};

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    // Database-webhook shape: { type: 'INSERT', record: { ... } }
    const record = payload.record ?? payload;
    const eventType: string = record.event_type;
    const visitId: string = record.visit_id;

    const key = NOTIFIABLE[eventType];
    if (!key || !visitId) return json({ skipped: true });

    const { data: visit } = await admin
      .from('visits')
      .select('id, customer_id, properties:property_id (address_line)')
      .eq('id', visitId)
      .single();
    if (!visit) return json({ skipped: true });

    const { data: profile } = await admin
      .from('profiles')
      .select('preferred_language')
      .eq('id', visit.customer_id)
      .single();

    const language = profile?.preferred_language === 'es' ? 'es' : 'en';
    const address =
      (visit.properties as { address_line?: string } | null)?.address_line ?? '';
    const copy = COPY[language][key];

    const { data: tokens } = await admin
      .from('device_tokens')
      .select('token')
      .eq('user_id', visit.customer_id);

    if (!tokens?.length) return json({ sent: 0 });

    const messages = tokens.map((row) => ({
      to: row.token,
      sound: 'default',
      title: copy.title,
      body: copy.body.replace('{{address}}', address),
      data: { visit_id: visitId, event_type: eventType },
    }));

    const response = await fetch(EXPO_PUSH_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messages),
    });

    return json({ sent: messages.length, ok: response.ok });
  } catch (error) {
    console.error('notify failed', error);
    return json({ error: 'notify_failed' }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
