import 'package:flutter/material.dart';

import '../models/carta_models.dart';
import '../services/carta_api.dart';
import '../theme/carta_theme.dart';
import 'reader_screen.dart';

class MyLibraryScreen extends StatefulWidget {
  const MyLibraryScreen({required this.api, super.key});

  final CartaApi api;

  @override
  State<MyLibraryScreen> createState() => _MyLibraryScreenState();
}

class _MyLibraryScreenState extends State<MyLibraryScreen> {
  late Future<_LibrarySnapshot> _future;
  int _selectedTab = 0;
  bool _removing = false;

  static const _tabs = [
    'Saved',
    'Bookmarks',
    'Highlights',
    'Notes',
  ];

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<_LibrarySnapshot> _load() async {
    final library = await widget.api.getMyLibrary();
    final catalogue = await widget.api.getLibrary();
    final documents = <String, LegalDocument>{
      for (final document in catalogue.documents) document.id: document,
    };

    final documentIds = <String>{
      for (final item in library.downloads) readString(item['documentId']),
      for (final item in library.bookmarks) readString(item['documentId']),
      for (final item in library.highlights) readString(item['documentId']),
      for (final item in library.notes) readString(item['documentId']),
    }..removeWhere((id) => id.isEmpty);

    final provisions = <String, Map<String, LegalProvision>>{};
    await Future.wait(documentIds.map((id) async {
      try {
        final detail = await widget.api.getDocument(id);
        provisions[id] = {
          for (final provision in detail.provisions) provision.id: provision,
        };
      } catch (_) {
        // Keep the shelf usable even when a document has been withdrawn.
      }
    }));

    return _LibrarySnapshot(
      library: library,
      documents: documents,
      provisions: provisions,
    );
  }

  Future<void> _refresh() async {
    final next = _load();
    setState(() => _future = next);
    await next;
  }

  Future<void> _remove(Map<String, dynamic> item, String action) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Remove from My Library?'),
        content: Text(
          action == 'note'
              ? 'This private note will be deleted from your account.'
              : 'This item will be removed from your saved library.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(false),
            child: const Text('Keep it'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(dialogContext).pop(true),
            child: const Text('Remove'),
          ),
        ],
      ),
    );
    if (confirmed != true || !mounted) return;

    setState(() => _removing = true);
    try {
      final payload = <String, dynamic>{
        'action': action,
        'operation': 'remove',
      };
      if (item['documentId'] != null) {
        payload['documentId'] = item['documentId'];
      }
      if (item['sectionId'] != null) {
        payload['sectionId'] = item['sectionId'];
      }
      if (item['id'] != null) payload['id'] = item['id'];
      await widget.api.saveLibraryAction(payload);
      await _refresh();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Removed from your library.')),
        );
      }
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Could not remove item: $error')),
        );
      }
    } finally {
      if (mounted) setState(() => _removing = false);
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('MY LIBRARY')),
        body: FutureBuilder<_LibrarySnapshot>(
          future: _future,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }
            if (snapshot.hasError) {
              return Center(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.cloud_off_outlined, size: 40),
                      const SizedBox(height: 12),
                      Text(
                        'Your library could not be loaded.\n${snapshot.error}',
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 12),
                      OutlinedButton(
                        onPressed: _refresh,
                        child: const Text('Try again'),
                      ),
                    ],
                  ),
                ),
              );
            }

            final data = snapshot.data!;
            final lists = [
              data.library.downloads,
              data.library.bookmarks,
              data.library.highlights,
              data.library.notes,
            ];
            final items = lists[_selectedTab];

            return Stack(
              children: [
                RefreshIndicator(
                  onRefresh: _refresh,
                  child: ListView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.fromLTRB(18, 12, 18, 28),
                    children: [
                      Text(
                        'Your reading, all in one place.',
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                              fontWeight: FontWeight.w400,
                            ),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Bookmarks, highlights and notes are private to your CARTA account and sync through the library service.',
                      ),
                      const SizedBox(height: 18),
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: List.generate(_tabs.length, (index) {
                            return Padding(
                              padding: const EdgeInsets.only(right: 8),
                              child: ChoiceChip(
                                label: Text('${_tabs[index]} (${lists[index].length})'),
                                selected: _selectedTab == index,
                                onSelected: (_) => setState(() => _selectedTab = index),
                                selectedColor: CartaTheme.greenSoft,
                              ),
                            );
                          }),
                        ),
                      ),
                      const SizedBox(height: 14),
                      if (items.isEmpty)
                        _EmptyLibraryState(tab: _tabs[_selectedTab])
                      else
                        for (final item in items)
                          _LibraryItemCard(
                            item: item,
                            tab: _selectedTab,
                            document: data.documents[readString(item['documentId'])],
                            provision: data.provisions[readString(item['documentId'])]
                                ?[readString(item['sectionId'])],
                            removing: _removing,
                            onOpen: (document) => Navigator.of(context).push(
                              MaterialPageRoute<void>(
                                builder: (_) => ReaderScreen(
                                  api: widget.api,
                                  document: document,
                                ),
                              ),
                            ),
                            onRemove: (action) => _remove(item, action),
                          ),
                    ],
                  ),
                ),
                if (_removing)
                  const Positioned(
                    top: 0,
                    left: 0,
                    right: 0,
                    child: LinearProgressIndicator(),
                  ),
              ],
            );
          },
        ),
      );
}

class _LibrarySnapshot {
  const _LibrarySnapshot({
    required this.library,
    required this.documents,
    required this.provisions,
  });

  final UserLibrary library;
  final Map<String, LegalDocument> documents;
  final Map<String, Map<String, LegalProvision>> provisions;
}

class _LibraryItemCard extends StatelessWidget {
  const _LibraryItemCard({
    required this.item,
    required this.tab,
    required this.document,
    required this.provision,
    required this.removing,
    required this.onOpen,
    required this.onRemove,
  });

  final JsonMap item;
  final int tab;
  final LegalDocument? document;
  final LegalProvision? provision;
  final bool removing;
  final void Function(LegalDocument document) onOpen;
  final void Function(String action) onRemove;

  @override
  Widget build(BuildContext context) {
    final action = const ['download', 'bookmark', 'highlight', 'note'][tab];
    final heading = provision == null
        ? 'Saved legal material'
        : '${provision!.number} · ${provision!.heading}';
    final detail = switch (tab) {
      0 => 'Saved to your account',
      1 => provision?.originalText ?? 'Bookmarked provision',
      2 => readString(item['selectedText'], provision?.originalText ?? 'Highlighted provision'),
      _ => readString(item['text'], 'Private note'),
    };

    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(14, 8, 6, 8),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: InkWell(
                borderRadius: BorderRadius.circular(12),
                onTap: document == null ? null : () => onOpen(document!),
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        document?.title ?? 'Document no longer available',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 5),
                      Text(
                        tab == 0 ? detail : heading,
                        style: Theme.of(context).textTheme.labelMedium?.copyWith(
                              color: CartaTheme.green,
                            ),
                      ),
                      if (tab != 0) ...[
                        const SizedBox(height: 7),
                        Text(
                          detail,
                          maxLines: 4,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                      if (document == null) ...[
                        const SizedBox(height: 5),
                        const Text(
                          'The source may have been withdrawn or replaced. This saved entry cannot currently be opened.',
                          style: TextStyle(color: CartaTheme.muted, fontSize: 12),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ),
            IconButton(
              tooltip: 'Remove',
              onPressed: removing ? null : () => onRemove(action),
              icon: const Icon(Icons.delete_outline),
            ),
          ],
        ),
      ),
    );
  }
}

class _EmptyLibraryState extends StatelessWidget {
  const _EmptyLibraryState({required this.tab});

  final String tab;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 52, horizontal: 24),
        child: Column(
          children: [
            const Icon(Icons.bookmarks_outlined, size: 42, color: CartaTheme.muted),
            const SizedBox(height: 14),
            Text(
              'No $tab yet',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            const Text(
              'Open a verified document and use its save actions. Your items will appear here once saved.',
              textAlign: TextAlign.center,
            ),
          ],
        ),
      );
}
