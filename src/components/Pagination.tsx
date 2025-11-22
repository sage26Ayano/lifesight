import { memo, useCallback } from 'react';
import { useDashboard } from '../context/DashboardContext';
import '../styles/pagination.css';

const Pagination = memo(() => {
  const { currentPage, totalPages, setCurrentPage, sortedData, pageSize, setPageSize } = useDashboard();

  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage, setCurrentPage]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages, setCurrentPage]);

  const handlePageSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
  }, [setPageSize]);

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, sortedData.length);

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing {startRecord} to {endRecord} of {sortedData.length.toLocaleString()} records
      </div>
      <div className="pagination-controls">
        <div className="pagination-page-size">
          <label htmlFor="page-size" style={{ marginRight: '8px', fontSize: '14px' }}>
            Per page:
          </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid var(--color-border)',
              fontSize: '14px',
              backgroundColor: 'var(--color-bg)',
              color: 'var(--color-text)',
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <button 
          className="pagination-button"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="pagination-current">
          Page {currentPage} of {totalPages}
        </span>
        <button 
          className="pagination-button"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;
