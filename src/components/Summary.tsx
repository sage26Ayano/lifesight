import { memo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import '../styles/layout.css';

const Summary = memo(() => {
  const { totalSpend, totalConversions, totalImpressions, ctr } = useDashboard();

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

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <div className="metric-label">Total Spend</div>
        <div className="metric-value">{formatCurrency(totalSpend)}</div>
      </div>
      
      <div className="metric-card">
        <div className="metric-label">Total Conversions</div>
        <div className="metric-value success">{formatNumber(totalConversions)}</div>
      </div>
      
      <div className="metric-card">
        <div className="metric-label">Total Impressions</div>
        <div className="metric-value">{formatNumber(totalImpressions)}</div>
      </div>
      
      <div className="metric-card">
        <div className="metric-label">CTR (Conversion Rate)</div>
        <div className="metric-value success">{ctr.toFixed(3)}%</div>
      </div>
    </div>
  );
});

Summary.displayName = 'Summary';

export default Summary;
