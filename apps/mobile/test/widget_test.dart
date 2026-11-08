import 'package:carta_mobile/app.dart';
import 'package:carta_mobile/config/app_config.dart';
import 'package:carta_mobile/models/carta_models.dart';
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


  test('personal library parser preserves item identifiers for deletion', () {
    final library = UserLibrary.fromJson({
      'bookmarks': [
        {'id': 'bookmark-1', 'documentId': 'document-1', 'sectionId': 'section-1'},
      ],
      'highlights': [
        {'id': 'highlight-1', 'documentId': 'document-1', 'sectionId': 'section-1'},
      ],
      'notes': [
        {'id': 'note-1', 'documentId': 'document-1', 'sectionId': 'section-1', 'text': 'A private note'},
      ],
      'downloads': [
        {'documentId': 'document-1'},
      ],
    });

    expect(library.bookmarks.single['id'], 'bookmark-1');
    expect(library.highlights.single['id'], 'highlight-1');
    expect(library.notes.single['id'], 'note-1');
    expect(library.downloads.single['documentId'], 'document-1');
  });
