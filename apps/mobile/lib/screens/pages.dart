import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../models/carta_models.dart';
import '../services/carta_api.dart';
import '../state/library_store.dart';
import '../theme/carta_theme.dart';
import 'reader_screen.dart';

class HomePage extends StatelessWidget {
  const HomePage({required this.store, super.key});
  final LibraryStore store;

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: store,
        builder: (context, _) {
          final selected = store.selectedJurisdiction;
          final documents = store.documentsFor(store.selectedCountry);
          return RefreshIndicator(
            onRefresh: store.load,
            child: ListView(
              padding: const EdgeInsets.fromLTRB(20, 10, 20, 28),
              children: [
                Text(
                  'A world of law,\nmade more accessible.',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.w300,
                        height: 1.22,
                      ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Read constitutional texts, understand their structure and trace every provision to its source.',
                ),
                const SizedBox(height: 22),
                _InfoCard(
                  title: 'YOUR SELECTED JURISDICTION',
                  headline: selected == null
                      ? 'Loading the global directory…'
                      : '${selected.flag}  ${selected.name}',
                  detail: documents.isEmpty
                      ? 'Catalogue entry only · no verified documents published yet'
                      : '${documents.length} verified documents available',
                  onTap: selected == null
                      ? null
                      : () => Navigator.of(context).push(
                            MaterialPageRoute<void>(
                              builder: (_) => _CountryDocumentsScreen(
                                store: store,
                                country: selected,
                              ),
                            ),
                          ),
                ),
                const SizedBox(height: 14),
                _InfoCard(
                  title: 'DAILY LEGAL READING',
                  headline: store.updates.isEmpty
                      ? 'Your daily legal reading is being prepared'
                      : store.updates.first.title,
                  detail: store.updates.isEmpty
                      ? 'Official updates appear after a publisher is approved and verified.'
                      : store.updates.first.summary,
                ),
                const SizedBox(height: 24),
                Text('Explore CARTA', style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 12),
                const _FeatureTile(
                  icon: Icons.menu_book_outlined,
                  title: 'Constitution library',
                  detail: 'Browse jurisdictions and verified legal texts.',
                ),
                const _FeatureTile(
                  icon: Icons.manage_search,
                  title: 'Legal search',
                  detail: 'Find provisions across the approved collection.',
                ),
                const _FeatureTile(
                  icon: Icons.auto_awesome_outlined,
                  title: 'Legal research assistant',
                  detail: 'Ask questions with source-linked answers when evidence is available.',
                ),
                if (store.error != null) ...[
                  const SizedBox(height: 12),
                  _ErrorCard(message: store.error!),
                ],
                if (store.isLoading) const LinearProgressIndicator(),
              ],
            ),
          );
        },
      );
}

class CataloguePage extends StatefulWidget {
  const CataloguePage({required this.store, super.key});
  final LibraryStore store;

  @override
  State<CataloguePage> createState() => _CataloguePageState();
}

class _CataloguePageState extends State<CataloguePage> {
  final _filter = TextEditingController();

  @override
  void dispose() {
    _filter.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: widget.store,
        builder: (context, _) {
          final query = _filter.text.trim().toLowerCase();
          final countries = widget.store.countries.where((country) {
            return country.name.toLowerCase().contains(query) ||
                country.id.toLowerCase().contains(query);
          }).toList();
          return ListView(
            padding: const EdgeInsets.all(20),
            children: [
              Text('Explore the world', style: Theme.of(context).textTheme.headlineSmall),
              const SizedBox(height: 6),
              const Text(
                'A country in the directory is not proof that its constitution has been verified or published.',
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _filter,
                onChanged: (_) => setState(() {}),
                decoration: const InputDecoration(
                  hintText: 'Search a country or ISO code',
                  prefixIcon: Icon(Icons.search),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                '${countries.length} directory records · ${widget.store.countries.where((country) => country.isUnMember).length} UN Member States · ${widget.store.countries.where((country) => const ['VA', 'PS'].contains(country.id) && !country.isUnMember).length} observer states',
                style: Theme.of(context).textTheme.labelLarge,
              ),
              const SizedBox(height: 8),
              for (final country in countries)
                Card(
                  child: ListTile(
                    leading: Text(country.flag, style: const TextStyle(fontSize: 25)),
                    title: Text(country.name),
                    subtitle: Text([
                      country.isUnMember
                          ? 'UN Member State'
                          : (const ['VA', 'PS'].contains(country.id)
                              ? 'UN observer state'
                              : 'Country / area record'),
                      if (country.region.isNotEmpty) country.region,
                      _statusLabel(country.status),
                    ].join(' · ')),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {
                      widget.store.selectCountry(country.id);
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => _CountryDocumentsScreen(
                            store: widget.store,
                            country: country,
                          ),
                        ),
                      );
                    },
                  ),
                ),
              if (widget.store.isLoading) const Center(child: CircularProgressIndicator()),
              if (widget.store.error != null) _ErrorCard(message: widget.store.error!),
            ],
          );
        },
      );
}

class _CountryDocumentsScreen extends StatelessWidget {
  const _CountryDocumentsScreen({
    required this.store,
    required this.country,
  });

  final LibraryStore store;
  final Jurisdiction country;

  @override
  Widget build(BuildContext context) {
    final documents = store.documentsFor(country.id);
    return Scaffold(
      appBar: AppBar(title: Text('${country.flag} ${country.name}')),
      body: documents.isEmpty
          ? const _EmptyState(
              icon: Icons.library_books_outlined,
              title: 'No verified texts yet',
              detail:
                  'This jurisdiction is in CARTA’s directory, but no legal document has passed currentness and reuse review. We will not substitute sample or unverified text.',
            )
          : ListView(
              padding: const EdgeInsets.all(20),
              children: [
                for (final document in documents)
                  Card(
                    child: ListTile(
                      title: Text(document.title),
                      subtitle: Text(
                        '${document.type} · ${document.year} · ${document.version}',
                      ),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () => Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => ReaderScreen(
                            api: store.api,
                            document: document,
                          ),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
    );
  }
}

class SearchPage extends StatefulWidget {
  const SearchPage({required this.store, required this.api, super.key});
  final LibraryStore store;
  final CartaApi api;

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final _controller = TextEditingController();
  List<SearchHit> _results = [];
  bool _busy = false;
  String? _error;
  bool _searched = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _search() async {
    final value = _controller.text.trim();
    if (value.length < 2) return;
    setState(() {
      _busy = true;
      _error = null;
      _results = [];
      _searched = true;
    });
    try {
      _results = await widget.api.search(
        value,
        country: widget.store.selectedCountry,
      );
    } catch (error) {
      _error = error.toString();
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) => ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text('Search the law', style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 8),
          const Text(
            'Search returns only passages in CARTA’s verified publication set.',
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _controller,
            textInputAction: TextInputAction.search,
            onSubmitted: (_) => _search(),
            decoration: InputDecoration(
              hintText: 'Try “public participation”',
              prefixIcon: const Icon(Icons.search),
              suffixIcon: IconButton(
                onPressed: _busy ? null : _search,
                icon: const Icon(Icons.arrow_forward),
              ),
            ),
          ),
          const SizedBox(height: 14),
          if (_busy) const Center(child: CircularProgressIndicator()),
          if (_error != null) _ErrorCard(message: _error!),
          if (!_busy && _error == null && _searched && _results.isEmpty)
            const _EmptyState(
              icon: Icons.manage_search,
              title: 'No matching passages',
              detail:
                  'The search service found no qualifying passages. CARTA does not use unverified or sample legal text to fill the gap.',
            ),
          if (!_searched && !_busy)
            const _EmptyState(
              icon: Icons.search,
              title: 'Search verified law',
              detail: 'Enter at least two characters to search the approved legal collection.',
            ),
          for (final hit in _results)
            Card(
              child: ListTile(
                title: Text(hit.heading.isEmpty ? hit.documentTitle : hit.heading),
                subtitle: Text(
                  '${hit.documentTitle}\n${hit.content}',
                  maxLines: 5,
                  overflow: TextOverflow.ellipsis,
                ),
                isThreeLine: true,
                onTap: () {
                  LegalDocument? document;
                  for (final candidate in widget.store.documents) {
                    if (candidate.id == hit.documentId) {
                      document = candidate;
                      break;
                    }
                  }
                  final selectedDocument = document;
                  if (selectedDocument != null) {
                    Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => ReaderScreen(
                          api: widget.api,
                          document: selectedDocument,
                        ),
                      ),
                    );
                  }
                },
              ),
            ),
        ],
      );
}

class UpdatesPage extends StatelessWidget {
  const UpdatesPage({required this.store, super.key});
  final LibraryStore store;

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: store,
        builder: (context, _) => RefreshIndicator(
          onRefresh: store.refreshUpdates,
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              Text('Official updates', style: Theme.of(context).textTheme.headlineSmall),
              const SizedBox(height: 8),
              const Text(
                'Legal updates are shown only when their publisher and source have been verified.',
              ),
              const SizedBox(height: 18),
              if (store.updates.isEmpty)
                const _EmptyState(
                  icon: Icons.newspaper_outlined,
                  title: 'No verified updates yet',
                  detail:
                      'The daily publisher check is running, but no publisher is currently approved for ingestion. Updates will appear here after a source is cleared.',
                ),
              for (final item in store.updates)
                Card(
                  child: ListTile(
                    title: Text(item.title),
                    subtitle: Text(
                      '${item.type} · ${item.jurisdiction}\n${item.summary}',
                    ),
                    isThreeLine: true,
                    onTap: item.sourceUrl.isEmpty
                        ? null
                        : () => _showSource(context, item),
                  ),
                ),
            ],
          ),
        ),
      );

  void _showSource(BuildContext context, DailyUpdate item) {
    showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(item.sourceName.isEmpty ? 'Official source' : item.sourceName),
        content: SelectableText(item.sourceUrl),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }
}

class ResearchPage extends StatefulWidget {
  const ResearchPage({
    required this.store,
    required this.api,
    required this.supabase,
    super.key,
  });

  final LibraryStore store;
  final CartaApi api;
  final SupabaseClient supabase;

  @override
  State<ResearchPage> createState() => _ResearchPageState();
}

class _ResearchPageState extends State<ResearchPage> {
  final _question = TextEditingController();
  final List<({String role, String text})> _messages = [];
  bool _busy = false;
  String? _error;

  @override
  void dispose() {
    _question.dispose();
    super.dispose();
  }

  Future<void> _ask() async {
    final text = _question.text.trim();
    if (text.length < 5) return;
    if (widget.supabase.auth.currentSession == null) {
      setState(() => _error = 'Sign in from your account page to use the research assistant.');
      return;
    }
    setState(() {
      _busy = true;
      _error = null;
      _messages.add((role: 'You', text: text));
      _question.clear();
    });
    try {
      final result = await widget.api.askLegalQuestion(
        text,
        jurisdictionIso: widget.store.selectedCountry,
      );
      if (mounted) {
        setState(() => _messages.add((role: 'CARTA', text: result.text)));
      }
    } catch (error) {
      if (mounted) setState(() => _error = error.toString());
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) => StreamBuilder<AuthState>(
        stream: widget.supabase.auth.onAuthStateChange,
        builder: (context, _) => ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Text('Legal research', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            const Text(
              'CARTA answers from verified legal passages and refuses to invent a legal source when the library has no evidence.',
            ),
            const SizedBox(height: 14),
            if (widget.supabase.auth.currentSession == null)
              const _EmptyState(
                icon: Icons.lock_outline,
                title: 'Sign in to begin',
                detail:
                    'Your research conversations are private to your account. Open your account page to sign in.',
              ),
            for (final message in _messages)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        message.role,
                        style: const TextStyle(
                          color: CartaTheme.green,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 6),
                      SelectableText(message.text),
                    ],
                  ),
                ),
              ),
            if (_error != null) _ErrorCard(message: _error!),
            TextField(
              controller: _question,
              minLines: 2,
              maxLines: 5,
              decoration: const InputDecoration(
                hintText: 'Ask a question about a legal provision…',
              ),
            ),
            const SizedBox(height: 10),
            ElevatedButton.icon(
              onPressed: _busy ? null : _ask,
              icon: const Icon(Icons.send),
              label: Text(_busy ? 'Researching…' : 'Ask CARTA'),
            ),
            if (_busy) const LinearProgressIndicator(),
          ],
        ),
      );
}

class _InfoCard extends StatelessWidget {
  const _InfoCard({
    required this.title,
    required this.headline,
    required this.detail,
    this.onTap,
  });

  final String title;
  final String headline;
  final String detail;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) => Card(
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(20),
          child: Padding(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                        letterSpacing: 1.4,
                        color: CartaTheme.green,
                      ),
                ),
                const SizedBox(height: 10),
                Text(headline, style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 6),
                Text(detail, style: Theme.of(context).textTheme.bodySmall),
              ],
            ),
          ),
        ),
      );
}

class _FeatureTile extends StatelessWidget {
  const _FeatureTile({
    required this.icon,
    required this.title,
    required this.detail,
  });

  final IconData icon;
  final String title;
  final String detail;

  @override
  Widget build(BuildContext context) => Card(
        child: ListTile(
          leading: Icon(icon, color: CartaTheme.green),
          title: Text(title),
          subtitle: Text(detail),
        ),
      );
}

class _EmptyState extends StatelessWidget {
  const _EmptyState({
    required this.icon,
    required this.title,
    required this.detail,
  });

  final IconData icon;
  final String title;
  final String detail;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 28),
        child: Column(
          children: [
            Icon(icon, size: 44, color: CartaTheme.green),
            const SizedBox(height: 12),
            Text(title, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            Text(detail, textAlign: TextAlign.center),
          ],
        ),
      );
}

class _ErrorCard extends StatelessWidget {
  const _ErrorCard({required this.message});
  final String message;

  @override
  Widget build(BuildContext context) => Card(
        color: Colors.red.shade50,
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Text(
            message,
            style: TextStyle(color: Colors.red.shade900),
          ),
        ),
      );
}

String _statusLabel(String status) {
  switch (status) {
    case 'verified_current':
      return 'Verified constitution available';
    case 'text_loaded':
      return 'Text loaded · verification pending';
    default:
      return 'Catalogue entry · text not verified';
  }
}
