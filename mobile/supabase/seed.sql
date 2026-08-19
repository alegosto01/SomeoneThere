-- SomeoneThere — demo data (spec §68)
--
-- Creates one customer, one verifier, and three visits (upcoming, assigned,
-- completed-with-report) so the UI can be reviewed without hand-building rows.
--
-- Run against a LOCAL stack only:  supabase db reset
-- The passwords below are throwaway local values. Never point this at production.

do $$
declare
  customer_id uuid := '11111111-1111-1111-1111-111111111111';
  verifier_id uuid := '22222222-2222-2222-2222-222222222222';
  prop_1 uuid := gen_random_uuid();
  prop_2 uuid := gen_random_uuid();
  prop_3 uuid := gen_random_uuid();
  visit_1 uuid := gen_random_uuid();
  visit_2 uuid := gen_random_uuid();
  visit_3 uuid := gen_random_uuid();
  report_3 uuid := gen_random_uuid();
begin
  insert into auth.users (id, instance_id, aud, role, email, encrypted_password,
                          email_confirmed_at, raw_user_meta_data)
  values
    (customer_id, '00000000-0000-0000-0000-000000000000', 'authenticated',
     'authenticated', 'customer@example.com', crypt('demo-password', gen_salt('bf')),
     now(), '{"first_name":"Marco","last_name":"Rossi"}'),
    (verifier_id, '00000000-0000-0000-0000-000000000000', 'authenticated',
     'authenticated', 'verifier@example.com', crypt('demo-password', gen_salt('bf')),
     now(), '{"first_name":"Lucia","last_name":"Moreno"}')
  on conflict (id) do nothing;

  update profiles set role = 'verifier', preferred_language = 'es' where id = verifier_id;
  update profiles set preferred_language = 'en', phone = '+34600000000' where id = customer_id;

  insert into verifier_profiles (user_id, bio, identity_verified, languages,
                                 completed_visits, average_rating, active)
  values (verifier_id,
          'Madrid local. I attend viewings carefully and report only what I observe.',
          true, array['es', 'en'], 23, 4.9, true)
  on conflict (user_id) do nothing;

  insert into properties (id, customer_id, listing_url, address_line, city, postal_code,
                          neighborhood, property_type, advertised_rent)
  values
    (prop_1, customer_id, 'https://www.idealista.com/inmueble/00000001/',
     'Calle de Fuencarral 123', 'Madrid', '28004', 'Malasana', 'apartment', 1250),
    (prop_2, customer_id, null, 'Calle de Toledo 44', 'Madrid', '28005', 'La Latina', 'room', 620),
    (prop_3, customer_id, 'https://www.idealista.com/inmueble/00000003/',
     'Calle de Atocha 81', 'Madrid', '28012', 'Lavapies', 'studio', 950);

  -- 1) Upcoming, verifier assigned, access confirmed.
  insert into visits (id, customer_id, property_id, verifier_id, scheduled_at,
                      expected_duration_minutes, status, live_call_url, live_call_provider,
                      live_call_ready, photos_requested, access_confirmed, customer_notes)
  values (visit_1, customer_id, prop_1, verifier_id, now() + interval '1 day',
          30, 'verifier_assigned', 'https://meet.google.com/demo-abc-xyz', 'google_meet',
          false, true, true,
          'Please check whether the bedroom window faces the street and ask if utilities are included.');

  insert into property_contacts (visit_id, name, contact_type, phone, email)
  values (visit_1, 'Carlos', 'agent', '+34600111222', 'carlos@example.com');

  insert into visit_priorities (visit_id, priority_key)
  values (visit_1, 'natural_light'), (visit_1, 'street_noise'),
         (visit_1, 'bedroom_size'), (visit_1, 'damp_or_mould');

  insert into visit_events (visit_id, event_type)
  values (visit_1, 'booking_received'), (visit_1, 'access_confirmed'),
         (visit_1, 'verifier_assigned');

  insert into payments (visit_id, customer_id, stripe_payment_intent_id, amount, currency, status)
  values (visit_1, customer_id, 'pi_demo_visit_1', 49.00, 'EUR', 'succeeded');

  -- 2) Upcoming, awaiting verifier assignment.
  insert into visits (id, customer_id, property_id, scheduled_at, expected_duration_minutes,
                      status, photos_requested, access_confirmed)
  values (visit_2, customer_id, prop_2, now() + interval '4 days', 30,
          'verifier_pending', true, true);

  insert into property_contacts (visit_id, name, contact_type, phone)
  values (visit_2, 'Ana', 'landlord', '+34600333444');

  insert into visit_priorities (visit_id, priority_key)
  values (visit_2, 'listing_accuracy'), (visit_2, 'neighbor_noise'), (visit_2, 'storage_space');

  insert into visit_events (visit_id, event_type)
  values (visit_2, 'booking_received'), (visit_2, 'access_confirmed');

  insert into payments (visit_id, customer_id, stripe_payment_intent_id, amount, currency, status)
  values (visit_2, customer_id, 'pi_demo_visit_2', 49.00, 'EUR', 'succeeded');

  -- 3) Completed, report submitted.
  insert into visits (id, customer_id, property_id, verifier_id, scheduled_at,
                      expected_duration_minutes, status, photos_requested, photos_allowed,
                      access_confirmed, checked_in_at, checked_out_at)
  values (visit_3, customer_id, prop_3, verifier_id, now() - interval '3 days', 30,
          'report_ready', true, true, true,
          now() - interval '3 days', now() - interval '3 days' + interval '34 minutes');

  insert into property_contacts (visit_id, name, contact_type)
  values (visit_3, 'Javier', 'agent');

  insert into visit_priorities (visit_id, priority_key)
  values (visit_3, 'natural_light'), (visit_3, 'damp_or_mould'), (visit_3, 'listing_accuracy');

  insert into visit_events (visit_id, event_type)
  values (visit_3, 'booking_received'), (visit_3, 'access_confirmed'),
         (visit_3, 'verifier_assigned'), (visit_3, 'verifier_arrived'),
         (visit_3, 'live_started'), (visit_3, 'live_ended'),
         (visit_3, 'visit_completed'), (visit_3, 'report_ready');

  insert into payments (visit_id, customer_id, stripe_payment_intent_id, amount, currency, status)
  values (visit_3, customer_id, 'pi_demo_visit_3', 49.00, 'EUR', 'succeeded');

  insert into reports (id, visit_id, listing_match, verifier_summary, submitted_at)
  values (report_3, visit_3, 'minor_differences',
          'The studio matched the listing in layout and size. Natural light was good in the '
          'main room. The desk shown in the listing photos was not present, and the living-room '
          'window faces an internal courtyard rather than the street. No visible damp observed. '
          'The agent answered questions directly; some answers could not be independently checked.',
          now() - interval '3 days' + interval '2 hours');

  insert into report_observations (report_id, category, rating, note, sort_order)
  values
    (report_3, 'natural_light', 'good', 'Main room bright in the afternoon.', 1),
    (report_3, 'street_noise', 'acceptable', 'Traffic audible with the window open.', 2),
    (report_3, 'visible_damp', 'good', 'None observed in the areas shown.', 3),
    (report_3, 'visible_mould', 'good', null, 4),
    (report_3, 'bathroom', 'acceptable', 'Clean; sealant around the shower is worn.', 5),
    (report_3, 'kitchen', 'good', null, 6),
    (report_3, 'windows', 'acceptable', 'Single glazing on the courtyard side.', 7),
    (report_3, 'building_entrance', 'good', 'Locked entrance, intercom working.', 8),
    (report_3, 'water_pressure', 'not_checked', 'Agent asked me not to run the taps.', 9),
    (report_3, 'elevator', 'not_applicable', 'Building has no elevator.', 10);

  insert into report_differences (report_id, description)
  values
    (report_3, 'The desk shown in the listing photos was not present.'),
    (report_3, 'The living-room window faces an internal courtyard, not the street.');

  insert into report_questions (report_id, question, answer, answer_source)
  values
    (report_3, 'Are utilities included?', 'No.', 'agent'),
    (report_3, 'What is the minimum stay?', '12 months.', 'agent'),
    (report_3, 'How many people currently live here?', 'The studio is empty.', 'agent');

  insert into report_unchecked_areas (report_id, description)
  values
    (report_3, 'Storage room in the basement'),
    (report_3, 'Heating system operation'),
    (report_3, 'Roof terrace');
end;
$$;
