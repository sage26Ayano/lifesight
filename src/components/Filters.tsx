import { memo, useCallback } from 'react';
import { useDashboard } from '../context/DashboardContext';
import Select from './Select';
import '../styles/layout.css';

const Filters = memo(() => {
  const { filterChannel, setFilterChannel, uniqueChannels } = useDashboard();

  const handleChannelChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterChannel(e.target.value);
  }, [setFilterChannel]);

  return (
    <div className="filters-section">
      <h3 className="filters-title">Filters</h3>
      <div className="filters-grid">
        <Select
          label="Channel"
          options={uniqueChannels}
          value={filterChannel}
          onChange={handleChannelChange}
        />
      </div>
    </div>
  );
});

Filters.displayName = 'Filters';

export default Filters;
