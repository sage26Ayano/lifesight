import { memo, useCallback, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import '../styles/table.css';

interface DataRecord {
  id: number;
  channel: string;
  spend: number;
  impressions: number;
  conversions: number;
}

// Memoized formatters - created once outside component to prevent recreation
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

// Memoized TableRow component to prevent unnecessary re-renders
const TableRow = memo(({ row }: { row: DataRecord }) => (
  <tr>
    <td className="channel">{row.channel}</td>
    <td className="number">{formatCurrency(row.spend)}</td>
    <td className="number">{formatNumber(row.impressions)}</td>
    <td className="number">{formatNumber(row.conversions)}</td>
  </tr>
));

TableRow.displayName = 'TableRow';

const Table = memo(() => {
  const { paginatedData, sortField, sortDirection, setSorting } = useDashboard();

  const handleSort = useCallback((field: 'channel' | 'spend' | 'impressions' | 'conversions') => {
    setSorting(field);
  }, [setSorting]);

  const getSortClass = useCallback((field: string) => {
    if (sortField !== field) return 'sortable';
    return sortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc';
  }, [sortField, sortDirection]);

  const headerClasses = useMemo(() => ({
    channel: getSortClass('channel'),
    spend: getSortClass('spend'),
    impressions: getSortClass('impressions'),
    conversions: getSortClass('conversions'),
  }), [getSortClass]);

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th 
              className={headerClasses.channel}
              onClick={() => handleSort('channel')}
            >
              Channel
            </th>
            <th 
              className={headerClasses.spend}
              onClick={() => handleSort('spend')}
            >
              Spend
            </th>
            <th 
              className={headerClasses.impressions}
              onClick={() => handleSort('impressions')}
            >
              Impressions
            </th>
            <th 
              className={headerClasses.conversions}
              onClick={() => handleSort('conversions')}
            >
              Conversions
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row) => (
            <TableRow key={row.id} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
});

Table.displayName = 'Table';

export default Table;
