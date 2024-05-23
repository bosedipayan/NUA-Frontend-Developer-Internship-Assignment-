import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, perPage, setPerPage }) => {
  const validTotalPages = Number.isInteger(totalPages) && totalPages > 0 ? totalPages : 1;
  const pages = [...Array(validTotalPages).keys()].map(num => num + 1);

  return (
    <div>
      <select value={perPage} onChange={e => setPerPage(Number(e.target.value))} className="custom-select">
        {[10, 50, 100].map(num => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Pagination;