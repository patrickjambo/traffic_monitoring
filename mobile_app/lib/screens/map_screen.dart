import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../models/incident.dart';

class MapScreen extends StatelessWidget {
  final List<Incident> incidents;

  const MapScreen({super.key, required this.incidents});

  @override
  Widget build(BuildContext context) {
    return FlutterMap(
      options: MapOptions(
        initialCenter: LatLng(-1.9441, 30.0619), // Kigali
        initialZoom: 13.0,
      ),
      children: [
        TileLayer(
          urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          userAgentPackageName: 'com.example.traffic_monitoring_app',
        ),
        MarkerLayer(
          markers: incidents.map((incident) {
            return Marker(
              point: LatLng(incident.latitude, incident.longitude),
              width: 40,
              height: 40,
              child: Icon(
                Icons.location_on,
                color: incident.type == 'accident' ? Colors.red : 
                       incident.type == 'congestion' ? Colors.orange : Colors.blue,
                size: 40,
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}
