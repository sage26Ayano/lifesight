import { memo, useCallback } from 'react';
import { useDashboard } from '../context/DashboardContext';
import '../styles/pagination.css';

const Pagination = memo(() => {
  const { currentPage, totalPages, setCurrentPage, sortedData, pageSize } = useDashboard();

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

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, sortedData.length);

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing {startRecord} to {endRecord} of {sortedData.length} records
      </div>
      <div className="pagination-controls">
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
