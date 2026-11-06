import 'package:carta_mobile/app.dart';
import 'package:carta_mobile/config/app_config.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('includes the client-safe CARTA Supabase project defaults', () {
    expect(AppConfig.isConfigured, isTrue);
    expect(AppConfig.supabaseUrl, startsWith('https://'));
    expect(AppConfig.publishableKey, startsWith('sb_publishable_'));
  });

  testWidgets('shows safe configuration guidance when keys are absent', (tester) async {
    await tester.pumpWidget(const CartaApp(configured: false));

    expect(find.text('CARTA'), findsOneWidget);
    expect(find.textContaining('CARTA_SUPABASE_PUBLISHABLE_KEY'), findsOneWidget);
    expect(find.textContaining('service-role key'), findsOneWidget);
  });
}
