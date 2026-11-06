class AppConfig {
  AppConfig._();

  // These are client-safe Supabase settings and match the root .env.example.
  // A publishable key is designed for client apps and must still be protected
  // by Supabase RLS. Never use a service-role or secret API key here.
  static const supabaseUrl = String.fromEnvironment(
    'CARTA_SUPABASE_URL',
    defaultValue: 'https://mvcirldxcuvcuqvlmqxv.supabase.co',
  );
  static const publishableKey = String.fromEnvironment(
    'CARTA_SUPABASE_PUBLISHABLE_KEY',
    defaultValue: 'sb_publishable_UlgCAGqWEYbVJ7inGNX9qA_Rld0VWR3',
  );
  static const apiBaseUrl = String.fromEnvironment(
    'CARTA_API_BASE_URL',
    defaultValue:
        'https://mvcirldxcuvcuqvlmqxv.supabase.co/functions/v1/carta-api',
  );
  static const authRedirectUrl = 'carta://auth-callback';

  static bool get isConfigured =>
      supabaseUrl.startsWith('https://') &&
      publishableKey.startsWith('sb_publishable_') &&
      apiBaseUrl.startsWith('https://');

  static const configurationHelp = '''
CARTA's default public Supabase connection is included in this build.

For another environment, override it with:
--dart-define=CARTA_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
--dart-define=CARTA_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
--dart-define=CARTA_API_BASE_URL=https://YOUR_PROJECT.supabase.co/functions/v1/carta-api

Use a publishable key only. Never place a Supabase service-role key,
database password, OpenAI key or Stripe secret in a mobile build.
''';
}
