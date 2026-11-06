import 'package:flutter/material.dart';

import '../models/carta_models.dart';
import '../services/carta_api.dart';
import '../theme/carta_theme.dart';

class ReaderScreen extends StatefulWidget {
  const ReaderScreen({
    required this.api,
    required this.document,
    super.key,
  });

  final CartaApi api;
  final LegalDocument document;

  @override
  State<ReaderScreen> createState() => _ReaderScreenState();
}

class _ReaderScreenState extends State<ReaderScreen> {
  late Future<DocumentDetail> _future;

  Future<void> _bookmark(LegalProvision provision) async {
    try {
      await widget.api.saveLibraryAction({
        'action': 'bookmark',
        'documentId': widget.document.id,
        'sectionId': provision.id,
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Provision saved to your library.')),
        );
      }
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(error.toString())),
        );
      }
    }
  }

  @override
  void initState() {
    super.initState();
    _future = widget.api.getDocument(widget.document.id);
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('Read document')),
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
                  child: Text(
                    snapshot.error.toString(),
                    textAlign: TextAlign.center,
                  ),
                ),
              );
            }
            final detail = snapshot.data!;
            return ListView(
              padding: const EdgeInsets.all(20),
              children: [
                Text(
                  widget.document.title,
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
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
                      IconButton(
                        tooltip: 'Bookmark this provision',
                        onPressed: () => _bookmark(provision),
                        icon: const Icon(Icons.bookmark_add_outlined),
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
                  SelectableText(
                    'Official source: ${widget.document.officialUrl}',
                  ),
              ],
            );
          },
        ),
      );
}
