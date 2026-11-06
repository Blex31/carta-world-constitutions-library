import 'package:carta_mobile/app.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('shows safe configuration guidance when keys are absent', (tester) async {
    await tester.pumpWidget(const CartaApp(configured: false));

    expect(find.text('CARTA'), findsOneWidget);
    expect(find.textContaining('CARTA_SUPABASE_PUBLISHABLE_KEY'), findsOneWidget);
    expect(find.textContaining('service-role key'), findsOneWidget);
  });
}
