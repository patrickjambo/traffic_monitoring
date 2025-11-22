import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/incident.dart';

class ApiService {
  // Use 10.0.2.2 for Android Emulator to access localhost of the host machine
  static const String baseUrl = 'http://10.0.2.2:8000'; 

  Future<List<Incident>> fetchIncidents() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/incidents/'));

      if (response.statusCode == 200) {
        List<dynamic> body = jsonDecode(response.body);
        List<Incident> incidents = body.map((dynamic item) => Incident.fromJson(item)).toList();
        return incidents;
      } else {
        throw Exception('Failed to load incidents');
      }
    } catch (e) {
      throw Exception('Error fetching data: $e');
    }
  }
}
