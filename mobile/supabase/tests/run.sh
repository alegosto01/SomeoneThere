#!/usr/bin/env bash
# Applies the schema to a throwaway Postgres container and runs the RLS tests.
#
#   ./supabase/tests/run.sh
#
# Verifies SQL that `supabase db reset` would also verify, but without needing
# the Supabase CLI or the full local stack. It does NOT exercise GoTrue, Storage
# or Realtime — auth.users and storage.objects are stubbed in 00_supabase_stubs.sql.
set -euo pipefail
cd "$(dirname "$0")/../.."

CONTAINER=st-pg-test
docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
docker run -d --name "$CONTAINER" -e POSTGRES_PASSWORD=postgres postgres:15 >/dev/null

# pg_isready goes true briefly during initdb before the server restarts, so wait
# on a real query instead.
for _ in $(seq 1 60); do
  docker exec "$CONTAINER" psql -U postgres -d postgres -c 'select 1' >/dev/null 2>&1 && break
  sleep 1
done

run() { docker exec -i "$CONTAINER" psql -U postgres -d postgres -v ON_ERROR_STOP=1 -q "$@"; }

echo "--> stubs"
run < supabase/tests/00_supabase_stubs.sql
for f in supabase/migrations/0*.sql; do
  echo "--> $f"
  run < "$f"
done
echo "--> seed"
run < supabase/seed.sql

status=0
for t in supabase/tests/0[1-9]_*.sql; do
  echo "--> $t"
  set +e
  docker exec -i "$CONTAINER" psql -U postgres -d postgres -v ON_ERROR_STOP=1 \
    < "$t" 2>&1 | grep -E '^(NOTICE|ERROR|FAIL)' | sed -e 's/^NOTICE:  //'
  rc=${PIPESTATUS[0]}
  set -e
  [ "$rc" -ne 0 ] && status=$rc
done

docker rm -f "$CONTAINER" >/dev/null
if [ "$status" -ne 0 ]; then
  echo "SQL TESTS FAILED"
  exit 1
fi
echo "SQL TESTS PASSED"
