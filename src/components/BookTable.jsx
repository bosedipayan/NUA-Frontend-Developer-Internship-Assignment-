import React from 'react';

const BooksTable = ({ books, sortColumn, sortOrder, onSort }) => {
  const handleSort = (column) => {
    const order = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(column, order);
  };

  return (
    <table>
      <thead>
        <tr>
          {['ratings_average', 'author_name', 'title', 'first_publish_year', 'subject', 'author_birth_date', 'author_top_work'].map(column => (
            <th key={column} onClick={() => handleSort(column)}>
              {column.replace('_', ' ')}
              {sortColumn === column ? (sortOrder === 'asc' ? ' 🔼' : ' 🔽') : null}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {books && books.length > 0 ? (
          books.map((book) => (
            <tr key={book.id || book.title}>
              <td>{book.ratings_average ? book.ratings_average : 'N/A'}</td>
              <td>{book.author_name}</td>
              <td>{book.title}</td>
              <td>{book.first_publish_year}</td>
              <td>{book.subject}</td>
              <td>{book.author_birth_date}</td>
              <td>{book.author_top_work}</td>
            </tr>
          ))
        ) : (
          <p>No books available.</p>
        )}
      </tbody>
    </table>
  );
};

export default BooksTable;