import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'app.dart';
import 'auth/secure_auth_storage.dart';
import 'config/app_config.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  if (AppConfig.isConfigured) {
    await Supabase.initialize(
      url: AppConfig.supabaseUrl,
      publishableKey: AppConfig.publishableKey,
      authOptions: const FlutterAuthClientOptions(
        localStorage: SecureAuthStorage(),
      ),
    );
  }

  runApp(CartaApp(configured: AppConfig.isConfigured));
}
