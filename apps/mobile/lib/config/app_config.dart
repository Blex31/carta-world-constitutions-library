class AppConfig {
  AppConfig._();

  static const supabaseUrl = String.fromEnvironment('CARTA_SUPABASE_URL');
  static const publishableKey =
      String.fromEnvironment('CARTA_SUPABASE_PUBLISHABLE_KEY');
  static const apiBaseUrl = String.fromEnvironment(
    'CARTA_API_BASE_URL',
    defaultValue:
        'https://mvcirldxcuvcuqvlmqxv.supabase.co/functions/v1/carta-api',
  );
  static const authRedirectUrl = 'carta://auth-callback';

  static bool get isConfigured =>
      supabaseUrl.startsWith('https://') &&
      publishableKey.isNotEmpty &&
      apiBaseUrl.startsWith('https://');

  static const configurationHelp = '''
CARTA needs its public Supabase connection settings.

Run the app with:
--dart-define=CARTA_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
--dart-define=CARTA_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
--dart-define=CARTA_API_BASE_URL=https://YOUR_PROJECT.supabase.co/functions/v1/carta-api

Use the publishable key only. Never place a Supabase service-role key,
database password, OpenAI key or Stripe secret in a mobile build.
''';
}
