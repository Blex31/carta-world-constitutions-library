import 'dart:async';

import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../services/carta_api.dart';
import '../state/library_store.dart';
import 'pages.dart';
import 'profile_screen.dart';

class HomeShell extends StatefulWidget {
  const HomeShell({required this.supabase, super.key});

  final SupabaseClient supabase;

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  late final CartaApi _api;
  late final LibraryStore _store;
  int _index = 0;
  late final List<Widget> _pages;

  @override
  void initState() {
    super.initState();
    _api = CartaApi(widget.supabase);
    _store = LibraryStore(_api);
    unawaited(_store.load());
    _pages = [
      HomePage(store: _store),
      CataloguePage(store: _store),
      SearchPage(store: _store, api: _api),
      UpdatesPage(store: _store),
      ResearchPage(store: _store, api: _api, supabase: widget.supabase),
    ];
  }

  @override
  void dispose() {
    _store.dispose();
    _api.close();
    super.dispose();
  }

  void _openProfile() {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => ProfileScreen(supabase: widget.supabase, api: _api),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('CARTA'),
        actions: [
          IconButton(
            tooltip: 'My account and library',
            onPressed: _openProfile,
            icon: const Icon(Icons.account_circle_outlined),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: IndexedStack(index: _index, children: _pages),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (value) => setState(() => _index = value),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.public),
            label: 'Countries',
          ),
          NavigationDestination(
            icon: Icon(Icons.search),
            label: 'Search',
          ),
          NavigationDestination(
            icon: Icon(Icons.newspaper_outlined),
            label: 'Updates',
          ),
          NavigationDestination(
            icon: Icon(Icons.balance_outlined),
            label: 'Research',
          ),
        ],
      ),
    );
  }
}
