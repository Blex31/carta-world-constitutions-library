import 'package:flutter/foundation.dart';

import '../models/carta_models.dart';
import '../services/carta_api.dart';

class LibraryStore extends ChangeNotifier {
  LibraryStore(this.api);

  final CartaApi api;

  bool isLoading = false;
  String? error;
  List<Jurisdiction> countries = [];
  List<LegalDocument> documents = [];
  List<DailyUpdate> updates = [];
  String selectedCountry = 'KE';

  List<LegalDocument> documentsFor(String countryId) => documents
      .where((document) => document.countryId == countryId)
      .toList();

  Jurisdiction? get selectedJurisdiction {
    for (final country in countries) {
      if (country.id == selectedCountry) return country;
    }
    return null;
  }

  Future<void> load() async {
    isLoading = true;
    error = null;
    notifyListeners();
    try {
      final libraryFuture = api.getLibrary();
      final feedFuture = api.getFeed();
      final library = await libraryFuture;
      final feed = await feedFuture;
      countries = library.countries;
      documents = library.documents;
      updates = feed;
      if (!countries.any((item) => item.id == selectedCountry) &&
          countries.isNotEmpty) {
        selectedCountry = countries.first.id;
      }
    } catch (exception) {
      error = exception.toString();
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  void selectCountry(String id) {
    selectedCountry = id;
    notifyListeners();
  }

  Future<void> refreshUpdates() async {
    try {
      updates = await api.getFeed(country: selectedCountry);
      notifyListeners();
    } catch (exception) {
      error = exception.toString();
      notifyListeners();
    }
  }
}
