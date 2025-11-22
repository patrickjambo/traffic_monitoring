import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/incident.dart';
import '../services/api_service.dart';
import 'map_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ApiService apiService = ApiService();
  late Future<List<Incident>> futureIncidents;

  @override
  void initState() {
    super.initState();
    futureIncidents = apiService.fetchIncidents();
  }

  void _refresh() {
    setState(() {
      futureIncidents = apiService.fetchIncidents();
    });
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Kigali Traffic Monitor'),
          bottom: const TabBar(
            tabs: [
              Tab(icon: Icon(Icons.list), text: 'List'),
              Tab(icon: Icon(Icons.map), text: 'Map'),
            ],
          ),
          actions: [
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: _refresh,
            )
          ],
        ),
        body: FutureBuilder<List<Incident>>(
          future: futureIncidents,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            } else if (snapshot.hasError) {
              return Center(child: Text('Error: ${snapshot.error}'));
            } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
              return const Center(child: Text('No incidents found.'));
            }

            final incidents = snapshot.data!;

            return TabBarView(
              children: [
                // List View
                ListView.builder(
                  itemCount: incidents.length,
                  itemBuilder: (context, index) {
                    final incident = incidents[index];
                    return Card(
                      margin: const EdgeInsets.all(8.0),
                      child: ListTile(
                        leading: Icon(
                          Icons.warning,
                          color: incident.type == 'accident' ? Colors.red : 
                                 incident.type == 'congestion' ? Colors.orange : Colors.blue,
                        ),
                        title: Text(incident.type.toUpperCase()),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(incident.description ?? 'No description'),
                            Text(
                              DateFormat('yyyy-MM-dd HH:mm').format(incident.timestamp),
                              style: const TextStyle(fontSize: 12, color: Colors.grey),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
                // Map View
                MapScreen(incidents: incidents),
              ],
            );
          },
        ),
      ),
    );
  }
}
