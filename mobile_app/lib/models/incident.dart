class Incident {
  final int id;
  final String type;
  final double latitude;
  final double longitude;
  final String? description;
  final String? videoUrl;
  final DateTime timestamp;
  final String status;

  Incident({
    required this.id,
    required this.type,
    required this.latitude,
    required this.longitude,
    this.description,
    this.videoUrl,
    required this.timestamp,
    required this.status,
  });

  factory Incident.fromJson(Map<String, dynamic> json) {
    return Incident(
      id: json['id'],
      type: json['type'],
      latitude: json['latitude'],
      longitude: json['longitude'],
      description: json['description'],
      videoUrl: json['video_url'],
      timestamp: DateTime.parse(json['timestamp']),
      status: json['status'],
    );
  }
}
