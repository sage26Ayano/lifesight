import { memo, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import '../styles/layout.css';

// Memoized formatters - created once outside component
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(Math.round(num));
};

const formatCurrency = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(num);
};

const Summary = memo(() => {
  const { totalSpend, totalConversions, totalImpressions, ctr } = useDashboard();

  // Memoize formatted values to prevent recalculation on every render
  const formattedValues = useMemo(() => ({
    spend: formatCurrency(totalSpend),
    conversions: formatNumber(totalConversions),
    impressions: formatNumber(totalImpressions),
    ctr: ctr.toFixed(3),
  }), [totalSpend, totalConversions, totalImpressions, ctr]);

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <div className="metric-label">Total Spend</div>
        <div className="metric-value">{formattedValues.spend}</div>
      </div>
      
      <div className="metric-card">
        <div className="metric-label">Total Conversions</div>
        <div className="metric-value success">{formattedValues.conversions}</div>
      </div>
      
      <div className="metric-card">
        <div className="metric-label">Total Impressions</div>
        <div className="metric-value">{formattedValues.impressions}</div>
      </div>
      
      <div className="metric-card">
        <div className="metric-label">CTR (Conversion Rate)</div>
        <div className="metric-value success">{formattedValues.ctr}%</div>
      </div>
    </div>
  );
});

Summary.displayName = 'Summary';

export default Summary;
