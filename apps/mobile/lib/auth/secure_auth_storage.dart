import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// Keeps Supabase sessions and PKCE state in the platform secure store.
class SecureAuthStorage extends AuthAsyncStorage {
  const SecureAuthStorage();

  static const _storage = FlutterSecureStorage();

  @override
  Future<String?> getItem(String key) => _storage.read(key: key);

  @override
  Future<void> setItem(String key, String value) =>
      _storage.write(key: key, value: value);

  @override
  Future<void> removeItem(String key) => _storage.delete(key: key);
}
