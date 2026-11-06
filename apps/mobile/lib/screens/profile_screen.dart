import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../config/app_config.dart';
import '../models/carta_models.dart';
import '../services/carta_api.dart';
import '../theme/carta_theme.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({
    required this.supabase,
    required this.api,
    super.key,
  });

  final SupabaseClient supabase;
  final CartaApi api;

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _name = TextEditingController();
  bool _busy = false;
  bool _signUp = false;
  bool _resetMode = false;
  String? _message;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    _name.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() {
      _busy = true;
      _message = null;
    });
    try {
      if (_resetMode) {
        await widget.supabase.auth.resetPasswordForEmail(
          _email.text.trim(),
          redirectTo: AppConfig.authRedirectUrl,
        );
        _message = 'Check your email for a secure password-reset link.';
      } else if (_signUp) {
        final response = await widget.supabase.auth.signUp(
          email: _email.text.trim(),
          password: _password.text,
          emailRedirectTo: AppConfig.authRedirectUrl,
          data: {'display_name': _name.text.trim()},
        );
        _message = response.session == null
            ? 'Account created. Confirm your email before signing in.'
            : 'Your CARTA account has been created.';
      } else {
        await widget.supabase.auth.signInWithPassword(
          email: _email.text.trim(),
          password: _password.text,
        );
        _message = 'You are signed in.';
      }
    } on AuthException catch (error) {
      _message = error.message;
    } catch (error) {
      _message = error.toString();
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _signOut() async {
    try {
      await widget.supabase.auth.signOut();
      if (mounted) setState(() => _message = 'You have signed out.');
    } on AuthException catch (error) {
      if (mounted) setState(() => _message = error.message);
    }
  }

  Future<void> _updatePassword() async {
    if (_password.text.length < 8) {
      setState(() => _message = 'Use a password with at least eight characters.');
      return;
    }
    try {
      await widget.supabase.auth.updateUser(
        UserAttributes(password: _password.text),
      );
      if (mounted) {
        _password.clear();
        setState(() => _message = 'Your password has been updated.');
      }
    } on AuthException catch (error) {
      if (mounted) setState(() => _message = error.message);
    }
  }

  @override
  Widget build(BuildContext context) => StreamBuilder<AuthState>(
        stream: widget.supabase.auth.onAuthStateChange,
        builder: (context, _) {
          final user = widget.supabase.auth.currentUser;
          return Scaffold(
            appBar: AppBar(title: const Text('YOUR CARTA ACCOUNT')),
            body: ListView(
              padding: const EdgeInsets.all(20),
              children: [
                if (user != null) ...[
                  CircleAvatar(
                    radius: 28,
                    backgroundColor: CartaTheme.greenSoft,
                    foregroundColor: CartaTheme.green,
                    child: Text(
                      (user.email ?? 'C').substring(0, 1).toUpperCase(),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    user.email ?? 'CARTA reader',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Your private reading shelf and research history are tied to this account.',
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: _signOut,
                    child: const Text('Sign out'),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Your personal library',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 8),
                  FutureBuilder<UserLibrary>(
                    future: widget.api.getMyLibrary(),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const LinearProgressIndicator();
                      }
                      if (snapshot.hasError) {
                        return Text(snapshot.error.toString());
                      }
                      final library = snapshot.data!;
                      return Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              _CountRow(label: 'Bookmarks', count: library.bookmarks.length),
                              _CountRow(label: 'Highlights', count: library.highlights.length),
                              _CountRow(label: 'Notes', count: library.notes.length),
                              _CountRow(label: 'Saved documents', count: library.downloads.length),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 24),
                  Text('Change password', style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 10),
                  TextField(
                    controller: _password,
                    obscureText: true,
                    decoration: const InputDecoration(
                      labelText: 'New password (8+ characters)',
                    ),
                  ),
                  const SizedBox(height: 10),
                  OutlinedButton(
                    onPressed: _updatePassword,
                    child: const Text('Update password'),
                  ),
                ] else ...[
                  Text(
                    _resetMode
                        ? 'Reset your password'
                        : _signUp
                            ? 'Create your account'
                            : 'Welcome back',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Sign in to sync your reading shelf and keep research conversations private.',
                  ),
                  const SizedBox(height: 16),
                  if (_signUp) ...[
                    TextField(
                      controller: _name,
                      textCapitalization: TextCapitalization.words,
                      decoration: const InputDecoration(labelText: 'Name'),
                    ),
                    const SizedBox(height: 10),
                  ],
                  TextField(
                    controller: _email,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(labelText: 'Email address'),
                  ),
                  if (!_resetMode) ...[
                    const SizedBox(height: 10),
                    TextField(
                      controller: _password,
                      obscureText: true,
                      decoration: const InputDecoration(
                        labelText: 'Password (8+ characters)',
                      ),
                    ),
                  ],
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: _busy ? null : _submit,
                    child: Text(
                      _busy
                          ? 'Please wait…'
                          : _resetMode
                              ? 'Send reset link'
                              : _signUp
                                  ? 'Create account'
                                  : 'Sign in',
                    ),
                  ),
                  Wrap(
                    spacing: 8,
                    children: [
                      TextButton(
                        onPressed: () => setState(() {
                          _signUp = !_signUp;
                          _resetMode = false;
                          _message = null;
                        }),
                        child: Text(
                          _signUp ? 'I already have an account' : 'Create an account',
                        ),
                      ),
                      TextButton(
                        onPressed: () => setState(() {
                          _resetMode = !_resetMode;
                          _signUp = false;
                          _message = null;
                        }),
                        child: Text(
                          _resetMode ? 'Back to sign in' : 'Forgot password?',
                        ),
                      ),
                    ],
                  ),
                ],
                if (_message != null) ...[
                  const SizedBox(height: 16),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(14),
                      child: Text(_message!),
                    ),
                  ),
                ],
              ],
            ),
          );
        },
      );
}

class _CountRow extends StatelessWidget {
  const _CountRow({required this.label, required this.count});

  final String label;
  final int count;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 5),
        child: Row(
          children: [
            Expanded(child: Text(label)),
            Text('$count', style: const TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
      );
}
