import 'package:flutter/material.dart';

import '../models/carta_models.dart';
import '../services/carta_api.dart';
import '../theme/carta_theme.dart';

class ReaderScreen extends StatefulWidget {
  const ReaderScreen({required this.api, required this.document, super.key});

  final CartaApi api;
  final LegalDocument document;

  @override
  State<ReaderScreen> createState() => _ReaderScreenState();
}

class _ReaderScreenState extends State<ReaderScreen> {
  late Future<DocumentDetail> _future;

  void _showMessage(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  Future<void> _bookmark(LegalProvision provision) async {
    try {
      await widget.api.saveLibraryAction({
        'action': 'bookmark',
        'documentId': widget.document.id,
        'sectionId': provision.id,
      });
      _showMessage('Provision saved to your library.');
    } catch (error) {
      _showMessage(error.toString());
    }
  }

  Future<void> _highlight(LegalProvision provision) async {
    if (provision.originalText.trim().isEmpty) {
      _showMessage('There is no verified text to highlight yet.');
      return;
    }
    try {
      await widget.api.saveLibraryAction({
        'action': 'highlight',
        'documentId': widget.document.id,
        'sectionId': provision.id,
        'selectedText': provision.originalText,
      });
      _showMessage('Provision highlighted in your library.');
    } catch (error) {
      _showMessage(error.toString());
    }
  }

  Future<void> _addNote(LegalProvision provision) async {
    final controller = TextEditingController();
    final note = await showDialog<String>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Text('Note on ${provision.number}'),
        content: TextField(
          controller: controller,
          autofocus: true,
          minLines: 3,
          maxLines: 7,
          maxLength: 10000,
          textCapitalization: TextCapitalization.sentences,
          decoration: const InputDecoration(
            hintText: 'Write a private note about this provision…',
            alignLabelWithHint: true,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(dialogContext).pop(controller.text),
            child: const Text('Save note'),
          ),
        ],
      ),
    );
    controller.dispose();
    if (note == null || note.trim().isEmpty) return;

    try {
      await widget.api.saveLibraryAction({
        'action': 'note',
        'documentId': widget.document.id,
        'sectionId': provision.id,
        'text': note.trim(),
      });
      _showMessage('Private note saved.');
    } catch (error) {
      _showMessage(error.toString());
    }
  }

  Future<void> _handleProvisionAction(
    String action,
    LegalProvision provision,
  ) async {
    switch (action) {
      case 'bookmark':
        await _bookmark(provision);
      case 'highlight':
        await _highlight(provision);
      case 'note':
        await _addNote(provision);
    }
  }

  @override
  void initState() {
    super.initState();
    _future = widget.api.getDocument(widget.document.id);
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(
          title: const Text('Read document'),
          actions: [
            IconButton(
              tooltip: 'Save document to My Library',
              icon: const Icon(Icons.bookmark_add_outlined),
              onPressed: () async {
                try {
                  await widget.api.saveLibraryAction({
                    'action': 'download',
                    'operation': 'save',
                    'documentId': widget.document.id,
                  });
                  _showMessage('Document saved to My Library.');
                } catch (error) {
                  _showMessage(error.toString());
                }
              },
            ),
          ],
        ),
        body: FutureBuilder<DocumentDetail>(
          future: _future,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }
            if (snapshot.hasError) {
              return Center(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Text(snapshot.error.toString(), textAlign: TextAlign.center),
                ),
              );
            }
            final detail = snapshot.data!;
            return ListView(
              padding: const EdgeInsets.all(20),
              children: [
                Text(widget.document.title, style: Theme.of(context).textTheme.headlineSmall),
                const SizedBox(height: 8),
                Text('Version ${widget.document.version} · ${widget.document.year}'),
                const SizedBox(height: 18),
                if (detail.provisions.isEmpty)
                  const Text('This verified document has no provisions indexed yet.'),
                for (final provision in detail.provisions) ...[
                  const Divider(height: 32),
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          '${provision.number} · ${provision.heading}',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                      ),
                      PopupMenuButton<String>(
                        tooltip: 'Save provision',
                        onSelected: (action) => _handleProvisionAction(action, provision),
                        itemBuilder: (context) => const [
                          PopupMenuItem(
                            value: 'bookmark',
                            child: ListTile(
                              leading: Icon(Icons.bookmark_add_outlined),
                              title: Text('Bookmark'),
                              contentPadding: EdgeInsets.zero,
                            ),
                          ),
                          PopupMenuItem(
                            value: 'highlight',
                            child: ListTile(
                              leading: Icon(Icons.highlight_outlined),
                              title: Text('Highlight provision'),
                              contentPadding: EdgeInsets.zero,
                            ),
                          ),
                          PopupMenuItem(
                            value: 'note',
                            child: ListTile(
                              leading: Icon(Icons.note_add_outlined),
                              title: Text('Add private note'),
                              contentPadding: EdgeInsets.zero,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  SelectableText(
                    provision.originalText,
                    style: const TextStyle(fontSize: 17, height: 1.8),
                  ),
                  if (provision.summary.isNotEmpty) ...[
                    const SizedBox(height: 14),
                    Text(
                      'IN PLAIN LANGUAGE',
                      style: Theme.of(context).textTheme.labelSmall?.copyWith(
                            color: CartaTheme.green,
                            letterSpacing: 1.3,
                          ),
                    ),
                    const SizedBox(height: 6),
                    Text(provision.summary),
                  ],
                ],
                const SizedBox(height: 24),
                if (widget.document.officialUrl.isNotEmpty)
                  SelectableText('Official source: ${widget.document.officialUrl}'),
              ],
            );
          },
        ),
      );
}
