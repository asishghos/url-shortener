import 'package:admin_panel/api.dart';
import 'package:flutter/material.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final AnalyticsService _analyticsService = AnalyticsService();

  late Future<List<TopLink>> _topLinksFuture;
  late Future<List<DailyClick>> _dailyClicksFuture;

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  void _fetchData() {
    _topLinksFuture = _analyticsService.getTopLinks();
    _dailyClicksFuture = _analyticsService.getDailyClicks();
  }

  Future<void> _onRefresh() async {
    setState(() {
      _fetchData();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('URL Shortener Analytics'),
        backgroundColor: Colors.blueGrey[900],
        elevation: 4,
      ),
      body: RefreshIndicator(
        onRefresh: _onRefresh,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildSectionTitle('Top 10 Links'),
              _buildTopLinksList(),
              const SizedBox(height: 24),
              _buildSectionTitle('Daily Clicks'),
              _buildDailyClicksList(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Text(
        title,
        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
          fontWeight: FontWeight.bold,
          color: Colors.blueGrey[800],
        ),
      ),
    );
  }

  Widget _buildTopLinksList() {
    return FutureBuilder<List<TopLink>>(
      future: _topLinksFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        }
        if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return const Center(child: Text('No top links data available.'));
        }

        final topLinks = snapshot.data!;
        return _buildCard(
          child: ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: topLinks.length,
            itemBuilder: (context, index) {
              final link = topLinks[index];
              return ListTile(
                leading: CircleAvatar(
                  backgroundColor: Colors.blueGrey[800],
                  child: Text(
                    '${index + 1}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                title: Text(
                  'Short ID: ${link.shortId}',
                  style: const TextStyle(fontWeight: FontWeight.w500),
                ),
                trailing: Text(
                  '${link.clicks} Clicks',
                  style: TextStyle(color: Colors.grey[600], fontSize: 16),
                ),
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildDailyClicksList() {
    return FutureBuilder<List<DailyClick>>(
      future: _dailyClicksFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        }
        if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return const Center(child: Text('No daily click data available.'));
        }

        final dailyClicks = snapshot.data!;
        return _buildCard(
          child: ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: dailyClicks.length,
            itemBuilder: (context, index) {
              final clickData = dailyClicks[index];
              return ListTile(
                leading: Icon(
                  Icons.calendar_today,
                  color: Colors.blueGrey[700],
                ),
                title: Text(
                  clickData.date,
                  style: const TextStyle(fontWeight: FontWeight.w500),
                ),
                trailing: Text(
                  '${clickData.clicks} Clicks',
                  style: TextStyle(color: Colors.grey[600], fontSize: 16),
                ),
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildCard({required Widget child}) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8.0),
        child: child,
      ),
    );
  }
}
