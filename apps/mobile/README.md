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

## Release builds (CI)

On-demand release builds run from [.github/workflows/mobile-release.yml](../.github/workflows/mobile-release.yml). Open Actions → "CARTA Mobile Release" → Run workflow on `main`, or push a `v*` tag. The workflow uploads three artifacts (90-day retention):

- `carta-android-release-apk` — release-mode APK. Without keystore secrets it is debug-signed: installable for testing (enable "Install unknown apps"), never for store distribution.
- `carta-android-release-aab` — release AAB for the Google Play Console once the upload keystore is configured.
- `carta-ios-unsigned-archive` — unsigned release .xcarchive. Apple requires a paid Apple Developer Program membership before any iOS device install or TestFlight upload; until then this artifact only proves the release build compiles.

### Play Store signing (when ready)

Generate an upload keystore once, add four repository secrets, and the same workflow signs release builds automatically:

    keytool -genkeypair -v -keystore upload-keystore.jks -alias upload \
      -keyalg RSA -keysize 2048 -validity 10000
    base64 -w0 upload-keystore.jks   # paste the output as the ANDROID_KEYSTORE_B64 secret

Secrets: `ANDROID_KEYSTORE_B64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`. Then create the app in the Google Play Console (one-time $25) and upload the signed AAB.

### iOS / TestFlight (when ready)

Enroll in the Apple Developer Program ($99/yr). A Mac is not required: GitHub's macOS runners can sign and upload once you add an App Store Connect API key and signing material as repository secrets; extend the iOS job with fastlane pilot (or xcrun altool) to push signed builds to TestFlight.

Bump the `version:` field in `apps/mobile/pubspec.yaml` before each store submission so the Android versionCode and iOS build number advance together.
