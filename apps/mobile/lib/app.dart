import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'config/app_config.dart';
import 'screens/home_shell.dart';
import 'theme/carta_theme.dart';

class CartaApp extends StatelessWidget {
  const CartaApp({required this.configured, super.key});

  final bool configured;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CARTA',
      debugShowCheckedModeBanner: false,
      theme: CartaTheme.light,
      home: configured
          ? HomeShell(supabase: Supabase.instance.client)
          : const _ConfigurationScreen(),
    );
  }
}

class _ConfigurationScreen extends StatelessWidget {
  const _ConfigurationScreen();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) => SingleChildScrollView(
            child: ConstrainedBox(
              constraints: BoxConstraints(minHeight: constraints.maxHeight),
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(28),
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 520),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'CARTA',
                          style: TextStyle(
                            color: CartaTheme.green,
                            fontSize: 34,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 5,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'Every Constitution. Every Country. In Plain Language.',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 24),
                        const Text(
                          'The mobile client is ready for its Supabase connection. '
                          'No privileged credentials are required in the app.',
                        ),
                        const SizedBox(height: 20),
                        const SelectableText(AppConfig.configurationHelp),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
