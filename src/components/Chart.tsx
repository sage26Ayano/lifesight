import { memo, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import '../styles/layout.css';

const Chart = memo(() => {
  const { filteredData } = useDashboard();

  // Aggregate data by channel - OPTIMIZED: using Map for O(n) instead of O(n²) with find()
  const chartData = useMemo(() => {
    // Use Map for O(1) lookup instead of find() which is O(n)
    const channelMap = new Map<string, { channel: string; spend: number; conversions: number }>();
    
    for (let i = 0; i < filteredData.length; i++) {
      const item = filteredData[i];
      const existing = channelMap.get(item.channel);
      
      if (existing) {
        existing.spend += item.spend;
        existing.conversions += item.conversions;
      } else {
        channelMap.set(item.channel, {
          channel: item.channel,
          spend: item.spend,
          conversions: item.conversions,
        });
      }
    }

    // Convert Map values to array, sort, and take top 10
    const aggregated = Array.from(channelMap.values());
    aggregated.sort((a, b) => b.spend - a.spend);
    return aggregated.slice(0, 10);
  }, [filteredData]);

  return (
    <div className="chart-section">
      <h3 className="chart-title">Performance by Channel (Top 10)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="channel" angle={-45} textAnchor="end" height={100} />
          <YAxis yAxisId="left" orientation="left" stroke="#2563eb" />
          <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="spend" fill="#2563eb" name="Spend ($)" />
          <Bar yAxisId="right" dataKey="conversions" fill="#10b981" name="Conversions" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

Chart.displayName = 'Chart';

export default Chart;
