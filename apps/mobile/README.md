# CARTA Mobile — Flutter Android + iOS

This is the native Flutter client for CARTA. It uses the existing Supabase project and the same carta-api Edge Function as the React web app. It does not connect directly to PostgreSQL.

## Toolchain

- Flutter stable 3.47.0
- Dart SDK 3.10 or later
- Android Studio / Android SDK for Android builds
- Xcode on macOS for iOS builds

Supabase Flutter 2.18.3 is used with flutter_secure_storage. Supabase sessions and PKCE state are stored in Keychain / Android encrypted storage, not ordinary preferences.

## Configure

The CARTA Supabase URL, publishable key and API URL already have client-safe defaults matching the repository root .env.example, so the checked-in debug build connects to the CARTA project without extra flags. Override them at build/run time when using another environment:

    cd apps/mobile
    flutter pub get
    flutter run \
      --dart-define=CARTA_SUPABASE_URL=https://YOUR_PROJECT.supabase.co \
      --dart-define=CARTA_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY \
      --dart-define=CARTA_API_BASE_URL=https://YOUR_PROJECT.supabase.co/functions/v1/carta-api

The publishable key is designed for client use with RLS. Never place a service-role key, database password, OpenAI key or Stripe secret in this app.

## Generate native platform runners

The Dart application source is committed. Generate the standard Android and iOS runner projects with:

    cd apps/mobile
    bash tool/bootstrap_platforms.sh

This uses Flutter's official project generator and preserves the checked-in Dart source and package manifest. On Windows, run the equivalent flutter create command with --platforms=android,ios and --org com.aztechnor --project-name carta_mobile, then keep the checked-in lib, test and pubspec.yaml files.

## Implemented in this first native slice

- Supabase email sign-up and sign-in.
- Password reset request and password update.
- Secure persisted Supabase sessions.
- Global jurisdiction directory.
- Honest empty states for metadata-only countries.
- Verified-document reader using the existing public API.
- Verified legal passage search.
- Official updates feed.
- Authenticated legal research request.
- Account and personal-library summary.
- Dedicated My Library with Saved, Bookmarks, Highlights and Notes tabs; open linked documents, remove saved items, refresh and retain account-scoped data.
- Shared CARTA palette and mobile navigation.

## Not enabled yet

- Offline document storage. The API does not yet expose a per-document permission flag specifically for offline/device copies. The mobile app must not cache legal texts until that is added and approved.
- Push notifications. This requires Firebase project registration, Android google-services.json, iOS GoogleService-Info.plist, APNs credentials, a device-token registry and user opt-in.
- Home-screen widgets. Android AppWidget and iOS WidgetKit require native runner extensions and a verified daily content snapshot.
- Mobile subscriptions. Do not send app users to web Stripe checkout. Use the applicable Google Play Billing and Apple In-App Purchase flow, validate receipts on the backend and map entitlements to the existing CARTA user.

## Deep link

The auth callback is carta://auth-callback. Add it to the Supabase Auth redirect allow-list and the generated Android/iOS runner projects before testing email confirmation and password reset on a device.

## Run checks

    flutter analyze
    flutter test
    flutter build apk --debug

For iOS, run flutter build ios --no-codesign on macOS after generating the iOS runner.

## CI and test artifact

GitHub Actions runs Flutter analysis, widget tests, an Android debug APK build/upload and an unsigned iOS build. The verified implementation baseline `b1655a982eb879fdcbe24846c606082594406fbd` passed Mobile CI #47: analysis, all three widget tests, Android debug APK build and artifact upload, and unsigned iOS build. The ZIP artifact is available from [Mobile CI #47](https://github.com/Blex31/carta-world-constitutions-library/actions/runs/42474119289) as `carta-android-debug` (artifact ID `13614652238`). Debug APKs are for testing only; they are not signed Play Store releases.
