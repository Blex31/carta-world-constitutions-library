# CARTA Mobile Application Development Guide

## Overview

The CARTA mobile application is built with **Flutter** and provides native Android and iOS clients for the CARTA World Constitutions Library.

## Project Structure

```
apps/mobile/
├── android/              # Android-specific code
│   ├── app/
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── AndroidManifest.xml
│   │   │       └── kotlin/.../
│   │   │           └── MainActivity.kt
│   └── ...
├── ios/                  # iOS-specific code
│   ├── Runner/
│   │   ├── Base.lproj/
│   │   ├── Assets.xcassets/
│   │   ├── Info.plist
│   │   └── ...
│   └── ...
├── lib/                  # Dart source code
│   ├── main.dart         # Application entry point
│   ├── app.dart          # Main app widget
│   ├── config/
│   │   └── app_config.dart # Configuration
│   ├── auth/
│   │   └── secure_auth_storage.dart # Auth storage
│   ├── models/
│   │   └── carta_models.dart # Data models
│   ├── screens/
│   │   ├── home_shell.dart
│   │   ├── pages.dart
│   │   ├── library_screen.dart
│   │   ├── profile_screen.dart
│   │   ├── reader_screen.dart
│   │   └── ...
│   ├── services/
│   │   └── carta_api.dart # API client
│   ├── state/
│   │   └── library_store.dart # State management
│   └── theme/
│       └── carta_theme.dart # Theme configuration
├── test/                 # Tests
│   └── widget_test.dart
└── pubspec.yaml          # Flutter dependencies
```

## Getting Started

### Prerequisites

- Flutter SDK (latest stable version)
- Dart SDK (comes with Flutter)
- Android Studio (for Android development)
- Xcode (for iOS development)
- Supabase account and project

### Installation

```bash
# Navigate to mobile app directory
cd apps/mobile

# Get Flutter dependencies
flutter pub get

# Run the app
flutter run
```

### Environment Configuration

Create or edit `lib/config/app_config.dart`:

```dart
class AppConfig {
  static const bool isConfigured = true;
  static const String supabaseUrl = 'https://mvcirldxcuvcuqvlmqxv.supabase.co';
  static const String publishableKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
  static const String apiUrl = 'https://mvcirldxcuvcuqvlmqxv.supabase.co/functions/v1/carta-api';
  static const String siteUrl = 'https://carta.world';
}
```

Or use environment variables:

```bash
# .env file
SUPABASE_URL=https://mvcirldxcuvcuqvlmqxv.supabase.co
SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
CARTA_API_URL=https://mvcirldxcuvcuqvlmqxv.supabase.co/functions/v1/carta-api
CARTA_SITE_URL=https://carta.world
```

## Architecture

### State Management

The app uses **Riverpod** for state management (implied by the structure, though not explicitly shown in files).

### Data Flow

```
User Action
    ↓
Widget Handler
    ↓
API Service (carta_api.dart)
    ↓
Supabase Client
    ↓
Response
    ↓
State Update
    ↓
UI Re-render
```

## Key Files

### main.dart

Application entry point that:
- Initializes Flutter binding
- Configures Supabase with secure auth storage
- Runs the CARTA app

```dart
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
```

### app.dart

Main application widget that:
- Sets up theme
- Manages navigation
- Provides state to child widgets

### app_config.dart

Central configuration file with:
- Supabase credentials
- API endpoints
- Feature flags
- Environment detection

### secure_auth_storage.dart

Custom secure storage for auth tokens:
- Uses Flutter's secure storage
- Encrypts tokens at rest
- Prevents token theft

### carta_api.dart

API client for CARTA Edge Function:
- GET/POST/PATCH/DELETE methods
- Automatic token injection
- Error handling
- Response parsing

### carta_models.dart

Data models for:
- Jurisdictions
- Documents
- Articles/Sections
- User library items
- API responses

### library_store.dart

State management for:
- User library (bookmarks, highlights, notes)
- Offline caching
- Sync status

## Features

### Authentication

The app supports:
- Email/password sign in
- Email/password sign up
- Password reset
- Session persistence
- Token refresh

### Constitution Reader

Features:
- View constitutions by jurisdiction
- Read original text
- View plain language summaries
- Navigate between articles
- Search within documents

### User Library

Users can:
- Bookmark articles
- Highlight text
- Add notes
- Download documents for offline reading

### Search

- Full-text search across all documents
- Filter by jurisdiction
- Recent searches
- Search suggestions

### Daily Article

- One article per day per jurisdiction
- Rotates daily
- Plain language + original text

### Offline Support

- Download documents for offline reading
- Local caching of recently viewed documents
- Offline-first design

## Platform-Specific Setup

### Android

#### AndroidManifest.xml

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="world.carta.app">
    
    <application
        android:name=".Application"
        android:label="CARTA"
        android:icon="@mipmap/ic_launcher">
        
        <activity
            android:name=".MainActivity"
            android:launchMode="singleTop"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            
            <!-- Deep linking -->
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="https" android:host="carta.world" />
                <data android:scheme="carta" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

#### MainActivity.kt

Handles:
- Deep linking
- Android lifecycle
- Supabase configuration

### iOS

#### Info.plist

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleURLTypes</key>
    <array>
        <dict>
            <key>CFBundleTypeRole</key>
            <string>Editor</string>
            <key>CFBundleURLSchemes</key>
            <array>
                <string>carta</string>
            </array>
        </dict>
    </array>
    
    <key>LSApplicationQueriesSchemes</key>
    <array>
        <string>carta</string>
    </array>
</dict>
</plist>
```

#### AppDelegate.swift

Handles:
- iOS lifecycle
- Deep linking
- Supabase configuration

## API Integration

### API Client

The `carta_api.dart` file provides methods for all API endpoints:

```dart
import 'package:supabase_flutter/supabase_flutter.dart';

class CartaApi {
  final SupabaseClient _supabase = Supabase.instance.client;
  
  Future<Map<String, dynamic>> getLibrary() async {
    final response = await _supabase
        .from('library')
        .select()
        .execute();
    return response.toJson();
  }
  
  Future<Map<String, dynamic>> legalChat(String question, String jurisdictionIso) async {
    final response = await _supabase
        .rpc('legal_chat', params: {
          'question': question,
          'jurisdiction_iso': jurisdictionIso
        })
        .execute();
    return response.toJson();
  }
}
```

### API Endpoints

Same endpoints as web app (via Edge Function):
- `/api/library` - Get jurisdictions and documents
- `/api/legal-chat` - Ask legal questions
- `/api/billing/*` - Subscription management
- `/api/admin/*` - Admin functions

## Data Models

### Jurisdiction Model

```dart
class Jurisdiction {
  final String isoCode;
  final String name;
  final String flagEmoji;
  final String jurisdictionKind;
  final bool isUnMember;
  final String continent;
  final String region;
  final String constitutionStatus;
  
  Jurisdiction({
    required this.isoCode,
    required this.name,
    required this.flagEmoji,
    required this.jurisdictionKind,
    required this.isUnMember,
    required this.continent,
    required this.region,
    required this.constitutionStatus,
  });
  
  factory Jurisdiction.fromJson(Map<String, dynamic> json) {
    return Jurisdiction(
      isoCode: json['iso_code'] ?? json['id'] ?? '',
      name: json['name'] ?? '',
      flagEmoji: json['flag_emoji'] ?? json['flag'] ?? '',
      jurisdictionKind: json['jurisdiction_kind'] ?? '',
      isUnMember: json['is_un_member'] ?? false,
      continent: json['continent'] ?? '',
      region: json['region'] ?? '',
      constitutionStatus: json['constitution_status'] ?? '',
    );
  }
}
```

### Document Model

```dart
class Document {
  final String id;
  final String jurisdictionIso;
  final String title;
  final String shortTitle;
  final String docType;
  final String? documentNumber;
  final String languageCode;
  final String? officialUrl;
  final String? sourceReference;
  final DateTime? adoptedAt;
  final DateTime? publishedAt;
  final DateTime? effectiveFrom;
  final DateTime? effectiveUntil;
  final String? versionLabel;
  final bool isCurrent;
  final String documentStatus;
  final String licenseStatus;
  final bool commercialUseAllowed;
  
  Document({ /* fields */ });
  
  factory Document.fromJson(Map<String, dynamic> json) {
    return Document(
      // Parse from JSON
    );
  }
}
```

### Section Model

```dart
class Section {
  final String id;
  final String documentId;
  final int? sectionNumber;
  final String? heading;
  final int sectionOrder;
  final String originalText;
  final String? plainLanguageSummary;
  final String? sourceLocation;
  
  Section({ /* fields */ });
  
  factory Section.fromJson(Map<String, dynamic> json) {
    return Section(
      // Parse from JSON
    );
  }
}
```

## Screens

### Home Shell (home_shell.dart)

Main navigation shell with:
- Bottom navigation bar
- App bar
- Drawer (if applicable)
- Tab navigation

### Pages Screen (pages.dart)

Main landing page showing:
- Daily article
- Quick actions
- Featured content
- Recent activity

### Library Screen (library_screen.dart)

User's personal library with:
- Bookmarks tab
- Highlights tab
- Notes tab
- Downloads tab

### Profile Screen (profile_screen.dart)

User profile with:
- Account information
- Subscription status
- Settings
- Sign out

### Reader Screen (reader_screen.dart)

Document reader with:
- Article/section display
- Original text + plain language
- Navigation controls
- Bookmark/highlight/note actions
- Table of contents

## Theme

### carta_theme.dart

```dart
import 'package:flutter/material.dart';

class CartaTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      primaryColor: const Color(0xFF1A7F37),
      colorScheme: ColorScheme.light(
        primary: const Color(0xFF1A7F37),
        secondary: const Color(0xFFFFFBF2),
        surface: Colors.white,
        error: const Color(0xFFD32F2F),
      ),
      textTheme: const TextTheme(
        headline1: TextStyle(
          fontFamily: 'Merriweather',
          fontSize: 48,
          fontWeight: FontWeight.bold,
          color: Color(0xFF222222),
        ),
        bodyText1: TextStyle(
          fontFamily: 'Inter',
          fontSize: 19,
          color: Color(0xFF222222),
        ),
        bodyText2: TextStyle(
          fontFamily: 'Inter',
          fontSize: 14,
          color: Color(0xFF6B6A61),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Color(0xFFFFFBF2),
        foregroundColor: Color(0xFF222222),
        elevation: 0,
      ),
      scaffoldBackgroundColor: const Color(0xFFFFFBF2),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Color(0xFFFFFBF2),
        selectedItemColor: Color(0xFF1A7F37),
        unselectedItemColor: Color(0xFF999999),
      ),
    );
  }
  
  static ThemeData get darkTheme {
    return ThemeData(
      // Dark theme configuration
    );
  }
}
```

## State Management

### library_store.dart

Manages user library state:

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

final libraryStoreProvider = StateNotifierProvider<LibraryStore, LibraryState>((ref) {
  return LibraryStore();
});

class LibraryState {
  final List<String> bookmarks;
  final List<String> highlights;
  final Map<String, String> notes;
  final List<String> downloads;
  final bool isLoading;
  final String? error;
  
  LibraryState({
    this.bookmarks = const [],
    this.highlights = const [],
    this.notes = const {},
    this.downloads = const [],
    this.isLoading = false,
    this.error,
  });
  
  LibraryState copyWith({ /* fields */ });
}

class LibraryStore extends StateNotifier<LibraryState> {
  LibraryStore() : super(LibraryState());
  
  Future<void> toggleBookmark(String sectionId) async {
    // Toggle bookmark logic
  }
  
  Future<void> addHighlight(String sectionId, String text) async {
    // Add highlight logic
  }
  
  Future<void> addNote(String sectionId, String text) async {
    // Add note logic
  }
  
  Future<void> syncWithServer() async {
    // Sync with server
  }
}
```

## Authentication Flow

### Sign In

```dart
import 'package:supabase_flutter/supabase_flutter.dart';

Future<void> signIn(String email, String password) async {
  try {
    final response = await Supabase.instance.client.auth
        .signInWithPassword(email: email, password: password);
    
    if (response.error != null) {
      throw Exception(response.error!.message);
    }
    
    // User signed in successfully
  } catch (e) {
    // Handle error
  }
}
```

### Sign Up

```dart
Future<void> signUp(String email, String password, String name) async {
  try {
    final response = await Supabase.instance.client.auth
        .signUp(email: email, password: password, data: {
          'display_name': name,
        });
    
    if (response.error != null) {
      throw Exception(response.error!.message);
    }
    
    // User created (may need email confirmation)
  } catch (e) {
    // Handle error
  }
}
```

### Sign Out

```dart
Future<void> signOut() async {
  await Supabase.instance.client.auth.signOut();
}
```

## Deep Linking

The app supports deep linking for:
- Opening specific constitutions
- Opening specific articles
- Handling subscription callbacks
- Opening chat conversations

### Android Setup

In `MainActivity.kt`:

```kotlin
class MainActivity : FlutterActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Handle deep links
        intent?.data?.let { uri ->
            handleDeepLink(uri)
        }
    }
    
    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        intent.data?.let { uri ->
            handleDeepLink(uri)
        }
    }
    
    private fun handleDeepLink(uri: Uri) {
        // Parse URI and navigate accordingly
    }
}
```

### iOS Setup

In `AppDelegate.swift`:

```swift
@UIApplicationMain
class AppDelegate: FlutterAppDelegate {
    override func application(
        _ application: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey : Any] = [:]
    ) -> Bool {
        handleDeepLink(url)
        return super.application(application, open: url, options: options)
    }
    
    private func handleDeepLink(_ url: URL) {
        // Parse URL and navigate accordingly
    }
}
```

## Testing

### Run Tests

```bash
cd apps/mobile
flutter test
```

### Widget Tests

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:carta/main.dart';

void main() {
  testWidgets('App loads correctly', (WidgetTester tester) async {
    await tester.pumpWidget(CartaApp(configured: true));
    
    // Verify app loads
    expect(find.text('CARTA'), findsOneWidget);
  });
}
```

## Deployment

### Android

```bash
# Build APK
flutter build apk

# Build App Bundle
flutter build appbundle

# Install on device
flutter install
```

### iOS

```bash
# Build for simulator
flutter build ios --simulator

# Build for device
flutter build ios --release

# Open in Xcode
open ios/Runner.xcworkspace
```

### App Stores

- **Android**: Upload App Bundle to Google Play Console
- **iOS**: Archive and upload to App Store Connect

## Best Practices

1. **Platform-Specific Code**: Use `Platform.isAndroid` / `Platform.isIOS`
2. **Responsive Design**: Use `MediaQuery` and `LayoutBuilder`
3. **Performance**: Use `ListView.builder` for long lists
4. **State Management**: Use Riverpod for complex state
5. **Error Handling**: Always handle errors gracefully
6. **Loading States**: Show loading indicators
7. **Accessibility**: Use semantic widgets and labels
8. **Security**: Never hardcode secrets in app
9. **Offline Support**: Cache data for offline use
10. **Testing**: Write widget tests for critical UI

## Troubleshooting

### Common Issues

**Issue**: App won't build
**Solution**: Run `flutter pub get` and check for errors

**Issue**: Authentication not working
**Solution**: Verify Supabase credentials in AppConfig

**Issue**: API calls failing
**Solution**: Check API URL and network connectivity

**Issue**: Deep links not working
**Solution**: Verify AndroidManifest.xml and Info.plist

**Issue**: App crashes on launch
**Solution**: Check for missing permissions or configuration

### Debugging

```bash
# Run with verbose logging
flutter run -v

# Run in debug mode
flutter run --debug

# Run in profile mode
flutter run --profile

# Run in release mode
flutter run --release
```

## Contributing

1. Fork the repository
2. Create a feature branch in `apps/mobile`
3. Make your changes
4. Run tests: `flutter test`
5. Commit your changes
6. Push to your fork
7. Open a pull request

## License

This project is private and proprietary. Do not redistribute without permission.
