/**
 * CARTA Mobile Application Entry Point
 * 
 * This is the main entry point for the Flutter-based CARTA mobile app
 * supporting both Android and iOS platforms.
 * 
 * INITIALIZATION:
 * 1. WidgetsFlutterBinding.ensureInitialized() - Required for Flutter
 * 2. Supabase.initialize() - Configures Supabase client with:
 *    - Custom secure auth storage (SecureAuthStorage)
 *    - Supabase URL and publishable key from AppConfig
 * 3. runApp() - Starts the CARTA application
 * 
 * CONFIGURATION:
 * App configuration is loaded from AppConfig which reads from:
 * - Environment variables (preferred)
 * - Build-time constants
 * - Default values
 * 
 * SECURITY:
 * - SecureAuthStorage: Encrypted storage for auth tokens
 * - Service role key: NEVER stored in mobile app (server-only)
 * - All sensitive operations go through Edge Functions
 * 
 * PLATFORMS:
 * - Android: MainActivity.kt handles deep links
 * - iOS: AppDelegate.swift handles deep links
 * 
 * ENVIRONMENT VARIABLES:
 * - SUPABASE_URL: Supabase project URL
 * - SUPABASE_PUBLISHABLE_KEY: Supabase anon key
 * - CARTA_SITE_URL: Production web URL for deep linking
 */
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
