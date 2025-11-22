import { memo, useCallback } from 'react';
import { useDashboard } from '../context/DashboardContext';
import '../styles/table.css';

const Table = memo(() => {
  const { paginatedData, sortField, sortDirection, setSorting } = useDashboard();

  const handleSort = useCallback((field: 'channel' | 'spend' | 'impressions' | 'conversions') => {
    setSorting(field);
  }, [setSorting]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const getSortClass = (field: string) => {
    if (sortField !== field) return 'sortable';
    return sortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc';
  };

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th 
              className={getSortClass('channel')}
              onClick={() => handleSort('channel')}
            >
              Channel
            </th>
            <th 
              className={getSortClass('spend')}
              onClick={() => handleSort('spend')}
            >
              Spend
            </th>
            <th 
              className={getSortClass('impressions')}
              onClick={() => handleSort('impressions')}
            >
              Impressions
            </th>
            <th 
              className={getSortClass('conversions')}
              onClick={() => handleSort('conversions')}
            >
              Conversions
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row) => (
            <tr key={row.id}>
              <td className="channel">{row.channel}</td>
              <td className="number">{formatCurrency(row.spend)}</td>
              <td className="number">{formatNumber(row.impressions)}</td>
              <td className="number">{formatNumber(row.conversions)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

Table.displayName = 'Table';

export default Table;
