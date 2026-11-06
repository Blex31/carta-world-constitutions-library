typedef JsonMap = Map<String, dynamic>;

String readString(dynamic value, [String fallback = '']) =>
    value is String ? value : fallback;

class Jurisdiction {
  const Jurisdiction({
    required this.id,
    required this.name,
    required this.flag,
    required this.status,
    this.kind = 'unclassified',
  });

  final String id;
  final String name;
  final String flag;
  final String status;
  final String kind;

  factory Jurisdiction.fromJson(JsonMap json) => Jurisdiction(
        id: readString(json['iso'] ?? json['id']),
        name: readString(json['name'], 'Unnamed jurisdiction'),
        flag: readString(json['flag'], '🌐'),
        status: readString(json['constitutionStatus'], 'metadata_only'),
        kind: readString(json['jurisdictionKind'], 'unclassified'),
      );
}

class LegalDocument {
  const LegalDocument({
    required this.id,
    required this.title,
    required this.countryId,
    required this.type,
    required this.year,
    required this.version,
    required this.officialUrl,
    required this.licenseStatus,
    required this.commercialUseAllowed,
  });

  final String id;
  final String title;
  final String countryId;
  final String type;
  final String year;
  final String version;
  final String officialUrl;
  final String licenseStatus;
  final bool commercialUseAllowed;

  factory LegalDocument.fromJson(JsonMap json) => LegalDocument(
        id: readString(json['id']),
        title: readString(json['title'], 'Untitled legal document'),
        countryId: readString(json['countryId'] ?? json['country_id']),
        type: readString(json['type'], 'document'),
        year: readString(json['year']),
        version: readString(json['version'] ?? json['version_label']),
        officialUrl: readString(json['officialUrl'] ?? json['official_url']),
        licenseStatus: readString(json['licenseStatus'] ?? json['license_status']),
        commercialUseAllowed:
            json['commercialUseAllowed'] == true ||
            json['commercial_use_allowed'] == true,
      );
}

class LegalProvision {
  const LegalProvision({
    required this.id,
    required this.documentId,
    required this.number,
    required this.heading,
    required this.originalText,
    required this.summary,
    required this.sourceLocation,
  });

  final String id;
  final String documentId;
  final String number;
  final String heading;
  final String originalText;
  final String summary;
  final String sourceLocation;

  factory LegalProvision.fromJson(JsonMap json) => LegalProvision(
        id: readString(json['id']),
        documentId: readString(json['documentId'] ?? json['document_id']),
        number: readString(json['articleNumber'] ?? json['section_number']),
        heading: readString(json['title'] ?? json['heading'], 'Provision'),
        originalText: readString(json['originalText'] ?? json['original_text']),
        summary: readString(json['simplifiedText'] ?? json['plain_language_summary']),
        sourceLocation: readString(json['sourceReference'] ?? json['source_location']),
      );
}

class DailyUpdate {
  const DailyUpdate({
    required this.id,
    required this.title,
    required this.summary,
    required this.type,
    required this.jurisdiction,
    required this.sourceName,
    required this.sourceUrl,
    required this.publishedAt,
  });

  final String id;
  final String title;
  final String summary;
  final String type;
  final String jurisdiction;
  final String sourceName;
  final String sourceUrl;
  final DateTime? publishedAt;

  factory DailyUpdate.fromJson(JsonMap json) => DailyUpdate(
        id: readString(json['id']),
        title: readString(json['title'], 'Official update'),
        summary: readString(json['summary'] ?? json['body']),
        type: readString(json['item_type'] ?? json['type'], 'UPDATE'),
        jurisdiction: readString(
          json['jurisdiction_name'] ??
              json['jurisdictionIso'] ??
              json['jurisdiction_iso'],
        ),
        sourceName: readString(json['source_name'] ?? json['tag']),
        sourceUrl: readString(json['canonical_url'] ?? json['sourceUrl']),
        publishedAt: DateTime.tryParse(
          readString(json['published_at'] ?? json['publishedAt']),
        ),
      );
}

class SearchHit {
  const SearchHit({
    required this.chunkId,
    required this.documentId,
    required this.documentTitle,
    required this.heading,
    required this.content,
    required this.officialUrl,
  });

  final String chunkId;
  final String documentId;
  final String documentTitle;
  final String heading;
  final String content;
  final String officialUrl;

  factory SearchHit.fromJson(JsonMap json) => SearchHit(
        chunkId: readString(json['chunk_id']),
        documentId: readString(json['document_id']),
        documentTitle: readString(json['document_title'], 'Legal document'),
        heading: readString(json['heading']),
        content: readString(json['content']),
        officialUrl: readString(json['official_url']),
      );
}

class UserLibrary {
  const UserLibrary({
    this.bookmarks = const [],
    this.highlights = const [],
    this.notes = const [],
    this.downloads = const [],
  });

  final List<JsonMap> bookmarks;
  final List<JsonMap> highlights;
  final List<JsonMap> notes;
  final List<JsonMap> downloads;

  factory UserLibrary.fromJson(JsonMap json) => UserLibrary(
        bookmarks: _maps(json['bookmarks']),
        highlights: _maps(json['highlights']),
        notes: _maps(json['notes']),
        downloads: _maps(json['downloads']),
      );

  static List<JsonMap> _maps(dynamic value) => value is List
      ? value
          .whereType<Map>()
          .map((item) => Map<String, dynamic>.from(item))
          .toList()
      : const [];
}

class DocumentDetail {
  const DocumentDetail({required this.document, required this.provisions});

  final JsonMap document;
  final List<LegalProvision> provisions;

  factory DocumentDetail.fromJson(JsonMap json) => DocumentDetail(
        document: json['document'] is Map
            ? Map<String, dynamic>.from(json['document'] as Map)
            : const {},
        provisions: (json['sections'] as List? ?? const [])
            .whereType<Map>()
            .map(
              (item) => LegalProvision.fromJson(
                Map<String, dynamic>.from(item),
              ),
            )
            .toList(),
      );
}
