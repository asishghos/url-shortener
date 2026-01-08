import { useState, useEffect } from 'react';
import { getDailyClicks } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BarChart3, RefreshCw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const AnalyticsChart = ({ refreshTrigger }) => {
  const [dailyClicks, setDailyClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartType, setChartType] = useState('bar');
  const { theme } = useTheme();

  const fetchDailyClicks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getDailyClicks();
      // Transform data for chart
      const transformed = data.map(item => ({
        date: item._id.date,
        clicks: item.clicks
      }));
      setDailyClicks(transformed);
    } catch (err) {
      setError(err.error || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyClicks();
  }, [refreshTrigger]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartColor = theme === 'dark' ? '#646cff' : '#535bf2';
  const gridColor = theme === 'dark' ? '#333' : '#e0e0e0';
  const textColor = theme === 'dark' ? '#fff' : '#213547';

  if (loading && dailyClicks.length === 0) {
    return (
      <div className="analytics-chart">
        <div className="section-header">
          <BarChart3 className="icon" />
          <h2>Daily Clicks Analytics</h2>
          <button onClick={fetchDailyClicks} className="refresh-btn" disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          </button>
        </div>
        <div className="loading-state">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="analytics-chart">
      <div className="section-header">
        <BarChart3 className="icon" />
        <h2>Daily Clicks Analytics</h2>
        <div className="chart-controls">
          <button
            onClick={() => setChartType('bar')}
            className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`}
          >
            Bar
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`}
          >
            Line
          </button>
          <button onClick={fetchDailyClicks} className="refresh-btn" disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {dailyClicks.length === 0 ? (
        <div className="empty-state">
          <p>No analytics data available yet.</p>
        </div>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'bar' ? (
              <BarChart data={dailyClicks}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  stroke={textColor}
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke={textColor} style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
                    border: `1px solid ${gridColor}`,
                    color: textColor,
                    borderRadius: '8px'
                  }}
                  labelFormatter={(value) => `Date: ${formatDate(value)}`}
                />
                <Bar dataKey="clicks" fill={chartColor} radius={[8, 8, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={dailyClicks}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  stroke={textColor}
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke={textColor} style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
                    border: `1px solid ${gridColor}`,
                    color: textColor,
                    borderRadius: '8px'
                  }}
                  labelFormatter={(value) => `Date: ${formatDate(value)}`}
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke={chartColor}
                  strokeWidth={2}
                  dot={{ fill: chartColor, r: 4 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AnalyticsChart;

