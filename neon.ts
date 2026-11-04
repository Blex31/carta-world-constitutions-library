import { defineConfig } from '@neon/config/v1';

// CARTA's backend runs on Neon Functions and Lakebase Postgres.
// Neon Auth is Managed Better Auth; browser code uses VITE_NEON_AUTH_URL.
// The Function verifies short-lived Neon Auth JWTs against injected JWKS.
export default defineConfig({
  auth: true,
  functions: {
    carta: {
      name: 'CARTA API',
      source: 'neon/functions/carta/index.ts',
    },
  },
  triggers: {
    'daily-legal-feed': {
      type: 'schedule',
      function: 'carta',
      // Poll once per hour; each publisher is rate-limited by its own poll_interval_minutes.
      // Each reader selects a fresh daily item after 06:00 in their local timezone.
      cron: '0 * * * *',
      functionPath: '/cron/ingest',
      enabled: true,
    },
  },
});
