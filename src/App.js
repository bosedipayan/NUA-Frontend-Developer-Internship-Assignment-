import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookTable from './components/BookTable';
import Pagination from './components/Pagination';
import { saveAs } from 'file-saver';
import './App.css';

const App = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);  // by default only 10 pages
  const [totalPages, setTotalPages] = useState(1);
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('');  // for sorting order of columns
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const offset = (currentPage - 1) * perPage;
        const response = await axios.get(`https://openlibrary.org/subjects/love.json?limit=${perPage}&offset=${offset}`);
        
        const bookWorks = response.data.works;
        const booksWithDetails = await Promise.all(bookWorks.map(async (work) => {
            const workDetails = await axios.get(`https://openlibrary.org${work.key}.json`);
            
            const authorsDetails = await Promise.all(work.authors.map(async (author) => {
              const authorDetails = await axios.get(`https://openlibrary.org${author.key}.json`);
          return {
              name: authorDetails.data.name,
              birth_date: authorDetails.data.birth_date,
              top_work: authorDetails.data.top_work,
            };
          }));
          
          return {
            key: work.key,
            title: workDetails.data.title,
            author_name: authorsDetails.map(author => author.name).join(', '),
            first_publish_year: work.first_publish_year,
            subject: work.subject ? work.subject.join(', ') : '',
            author_birth_date: authorsDetails.map(author => author.birth_date).join(', '),
            author_top_work: authorsDetails.map(author => author.top_work),
            ratings_average: workDetails.data.rating ? workDetails.data.rating.average : 'N/A', // Assuming 'N/A' if not available
          };
        }));
        
        setBooks(booksWithDetails);
        setTotalPages(Math.ceil(response.data.work_count / perPage));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBooks();
  }, [currentPage, perPage]);

  // sorting column 
  const handleSort = (column, order) => {
    setSortColumn(column);
    setSortOrder(order);
    const sortedBooks = [...books].sort((a, b) => {
      if (a[column] < b[column]) return order === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setBooks(sortedBooks);
  };

  // Filter books based on the search query
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const downloadCSV = () => {
    const headers = ["Title", "Author", "First Publish Year", "Subject", "Author Birth Date", "Author Top Work", "Ratings Average"];
    const rows = filteredBooks.map(book => [
      book.title,
      book.author_name,
      book.first_publish_year,
      book.subject,
      book.author_birth_date,
      book.author_top_work,
      book.ratings_average
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'books.csv');
  };

  return (
    <div className="app-container">
      <div className="sub-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search books by title"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button onClick={downloadCSV} className="download-button">Download CSV</button>
      </div>

      <BookTable books={filteredBooks} sortColumn={sortColumn} sortOrder={sortOrder} onSort={handleSort} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        perPage={perPage}
        setPerPage={setPerPage}
      />
    </div>
  );
};

export default App;
