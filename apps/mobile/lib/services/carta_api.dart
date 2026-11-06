import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:supabase_flutter/supabase_flutter.dart';

import '../config/app_config.dart';
import '../models/carta_models.dart';

class CartaApiException implements Exception {
  const CartaApiException(this.message, {this.statusCode});

  final String message;
  final int? statusCode;

  @override
  String toString() => message;
}

class ChatAnswer {
  const ChatAnswer({
    required this.text,
    required this.conversationId,
    required this.sources,
    required this.noVerifiedSources,
  });

  final String text;
  final String conversationId;
  final List<JsonMap> sources;
  final bool noVerifiedSources;
}

class CartaApi {
  CartaApi(this._supabase, {http.Client? client})
      : _client = client ?? http.Client();

  final SupabaseClient _supabase;
  final http.Client _client;

  Uri _uri(String path, [Map<String, String>? query]) {
    final base = AppConfig.apiBaseUrl.replaceFirst(RegExp(r'/+$'), '');
    return Uri.parse('$base$path').replace(queryParameters: query);
  }

  Future<Map<String, String>> _headers({bool jsonBody = false}) async {
    final headers = <String, String>{
      'apikey': AppConfig.publishableKey,
      'Accept': 'application/json',
    };
    if (jsonBody) headers['Content-Type'] = 'application/json';
    final token = _supabase.auth.currentSession?.accessToken;
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  Future<JsonMap> _get(String path, [Map<String, String>? query]) async {
    final response = await _client.get(
      _uri(path, query),
      headers: await _headers(),
    );
    return _decodeJson(response);
  }

  Future<JsonMap> _post(String path, JsonMap body) async {
    final response = await _client.post(
      _uri(path),
      headers: await _headers(jsonBody: true),
      body: jsonEncode(body),
    );
    return _decodeJson(response);
  }

  JsonMap _decodeJson(http.Response response) {
    JsonMap payload = {};
    try {
      final decoded = jsonDecode(response.body);
      if (decoded is Map) payload = Map<String, dynamic>.from(decoded);
    } on FormatException {
      payload = {};
    }
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw CartaApiException(
        readString(
          payload['error'] ?? payload['message'],
          'CARTA request failed.',
        ),
        statusCode: response.statusCode,
      );
    }
    return payload;
  }

  Future<({List<Jurisdiction> countries, List<LegalDocument> documents})>
      getLibrary() async {
    final json = await _get('/api/library');
    return (
      countries: (json['countries'] as List? ?? const [])
          .whereType<Map>()
          .map(
            (item) => Jurisdiction.fromJson(
              Map<String, dynamic>.from(item),
            ),
          )
          .toList(),
      documents: (json['documents'] as List? ?? const [])
          .whereType<Map>()
          .map(
            (item) => LegalDocument.fromJson(
              Map<String, dynamic>.from(item),
            ),
          )
          .toList(),
    );
  }

  Future<List<DailyUpdate>> getFeed({
    String? country,
    int limit = 40,
  }) async {
    final query = <String, String>{'limit': '$limit'};
    if (country != null && country.isNotEmpty) query['country'] = country;
    final json = await _get('/api/feed', query);
    return (json['items'] as List? ?? const [])
        .whereType<Map>()
        .map(
          (item) => DailyUpdate.fromJson(
            Map<String, dynamic>.from(item),
          ),
        )
        .toList();
  }

  Future<List<SearchHit>> search(String term, {String? country}) async {
    final query = <String, String>{'q': term};
    if (country != null && country.isNotEmpty) query['country'] = country;
    final json = await _get('/api/search', query);
    return (json['results'] as List? ?? const [])
        .whereType<Map>()
        .map(
          (item) => SearchHit.fromJson(
            Map<String, dynamic>.from(item),
          ),
        )
        .toList();
  }

  Future<DocumentDetail> getDocument(String id) async {
    final json = await _get('/api/documents/$id');
    return DocumentDetail.fromJson(json);
  }

  Future<UserLibrary> getMyLibrary() async {
    final json = await _get('/api/library/me');
    return UserLibrary.fromJson(json);
  }

  Future<void> saveLibraryAction(JsonMap action) async {
    await _post('/api/library/me', action);
  }

  Future<ChatAnswer> askLegalQuestion(
    String question, {
    String? jurisdictionIso,
    String? conversationId,
  }) async {
    final response = await _client.post(
      _uri('/api/legal-chat'),
      headers: await _headers(jsonBody: true),
      body: jsonEncode({
        'question': question,
        if (jurisdictionIso != null) 'jurisdictionIso': jurisdictionIso,
        if (conversationId != null) 'conversationId': conversationId,
      }),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      final error = _decodeJson(response);
      throw CartaApiException(
        readString(error['error'], 'The legal research request failed.'),
        statusCode: response.statusCode,
      );
    }

    final sources = <JsonMap>[];
    final buffer = StringBuffer();
    var currentEvent = '';
    var returnedConversationId = conversationId ?? '';
    var noSources = false;

    for (final line in const LineSplitter().convert(response.body)) {
      if (line.startsWith('event:')) {
        currentEvent = line.substring(6).trim();
      } else if (line.startsWith('data:')) {
        final raw = line.substring(5).trim();
        if (raw.isEmpty) continue;
        try {
          final decoded = jsonDecode(raw);
          if (decoded is! Map) continue;
          final data = Map<String, dynamic>.from(decoded);
          if (currentEvent == 'meta') {
            returnedConversationId = readString(
              data['conversationId'],
              returnedConversationId,
            );
            sources.addAll(_asMaps(data['sources']));
          } else if (currentEvent == 'delta') {
            buffer.write(readString(data['text']));
          } else if (currentEvent == 'done') {
            noSources = data['noVerifiedSources'] == true;
          }
        } on FormatException {
          // Ignore malformed event frames; never invent missing answer text.
        }
      }
    }

    return ChatAnswer(
      text: buffer.toString().isEmpty
          ? 'CARTA did not return a readable answer.'
          : buffer.toString(),
      conversationId: returnedConversationId,
      sources: sources,
      noVerifiedSources: noSources,
    );
  }

  List<JsonMap> _asMaps(dynamic value) => value is List
      ? value
          .whereType<Map>()
          .map((item) => Map<String, dynamic>.from(item))
          .toList()
      : const [];

  void close() => _client.close();
}
