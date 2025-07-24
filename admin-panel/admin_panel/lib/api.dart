import 'dart:convert';
import 'package:http/http.dart' as http;

class TopLink {
  final String shortId;
  final int clicks;

  TopLink({required this.shortId, required this.clicks});

  factory TopLink.fromJson(Map<String, dynamic> json) {
    return TopLink(shortId: json['_id'] ?? 'N/A', clicks: json['clicks'] ?? 0);
  }
}

class DailyClick {
  final String date;
  final int clicks;

  DailyClick({required this.date, required this.clicks});

  factory DailyClick.fromJson(Map<String, dynamic> json) {
    final dateString = (json['_id'] != null && json['_id']['date'] != null)
        ? json['_id']['date']
        : 'Unknown Date';

    return DailyClick(date: dateString, clicks: json['clicks'] ?? 0);
  }
}

class AnalyticsService {
  final String _baseUrl =
      "https://url-shortener-a3a7.onrender.com/api/analytics";

  // Fetches the list of top 10 most clicked links
  Future<List<TopLink>> getTopLinks() async {
    try {
      final response = await http.get(Uri.parse('$_baseUrl/top-links'));

      if (response.statusCode == 200) {
        // Decode the JSON response and map it to a list of TopLink objects
        final List<dynamic> jsonData = json.decode(response.body);
        return jsonData.map((item) => TopLink.fromJson(item)).toList();
      } else {
        // If the server did not return a 200 OK response, throw an exception.
        throw Exception(
          'Failed to load top links. Status code: ${response.statusCode}',
        );
      }
    } catch (e) {
      // Handle potential network errors or exceptions during parsing
      throw Exception('Failed to fetch top links: $e');
    }
  }

  // Fetches the total number of clicks for each day
  Future<List<DailyClick>> getDailyClicks() async {
    try {
      final response = await http.get(Uri.parse('$_baseUrl/daily-clicks'));

      if (response.statusCode == 200) {
        // Decode the JSON response and map it to a list of DailyClick objects
        final List<dynamic> jsonData = json.decode(response.body);
        return jsonData.map((item) => DailyClick.fromJson(item)).toList();
      } else {
        throw Exception(
          'Failed to load daily clicks. Status code: ${response.statusCode}',
        );
      }
    } catch (e) {
      throw Exception('Failed to fetch daily clicks: $e');
    }
  }
}
