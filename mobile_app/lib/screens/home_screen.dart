import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../models/incident.dart';
import '../services/api_service.dart';
import '../widgets/incident_card.dart';
import 'map_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ApiService apiService = ApiService();
  late Future<List<Incident>> futureIncidents;
  int _selectedIndex = 0;

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
    return Scaffold(
      extendBody: true,
      body: Container(
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment.topRight,
            radius: 1.5,
            colors: [
              Color(0xFF1E293B), // Slate 800
              Color(0xFF050B14), // Deepest Slate
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Custom Header
              Padding(
                padding: const EdgeInsets.all(20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'TRAFFIC AI',
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.primary,
                            fontWeight: FontWeight.w900,
                            fontSize: 24,
                            letterSpacing: 1.5,
                          ),
                        ).animate().shimmer(duration: 2000.ms),
                        const Text(
                          'SYSTEM ONLINE',
                          style: TextStyle(
                            color: Colors.green,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 2,
                          ),
                        ),
                      ],
                    ),
                    IconButton(
                      onPressed: _refresh,
                      icon: const Icon(Icons.refresh_rounded),
                      style: IconButton.styleFrom(
                        backgroundColor: Colors.white.withOpacity(0.05),
                        foregroundColor: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),

              // Content
              Expanded(
                child: FutureBuilder<List<Incident>>(
                  future: futureIncidents,
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return const Center(child: CircularProgressIndicator());
                    } else if (snapshot.hasError) {
                      return Center(child: Text('Error: ${snapshot.error}', style: const TextStyle(color: Colors.red)));
                    } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                      return const Center(child: Text('No incidents found.', style: TextStyle(color: Colors.grey)));
                    }

                    final incidents = snapshot.data!;

                    return IndexedStack(
                      index: _selectedIndex,
                      children: [
                        // List View
                        ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          itemCount: incidents.length,
                          itemBuilder: (context, index) {
                            return IncidentCard(incident: incidents[index]);
                          },
                        ),
                        // Map View
                        ClipRRect(
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
                          child: MapScreen(incidents: incidents),
                        ),
                      ],
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: Container(
        margin: const EdgeInsets.all(20),
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: const Color(0xFF0A0F1E).withOpacity(0.9),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white.withOpacity(0.1)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.3),
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _buildNavItem(0, Icons.list_alt_rounded, 'Feed'),
            _buildNavItem(1, Icons.map_rounded, 'Map'),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    final isSelected = _selectedIndex == index;
    final color = isSelected ? Theme.of(context).colorScheme.primary : Colors.grey;

    return GestureDetector(
      onTap: () => setState(() => _selectedIndex = index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? color.withOpacity(0.1) : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            Icon(icon, color: color),
            if (isSelected) ...[
              const SizedBox(width: 8),
              Text(
                label,
                style: TextStyle(
                  color: color,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
