// client/src/components/SearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    search: '',
    date: '',
    location: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };
  
  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <div className="search-inputs">
          <input
            type="text"
            name="search"
            placeholder="Search events..."
            value={filters.search}
            onChange={handleChange}
          />
          
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleChange}
          />
          
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleChange}
          />
          
          <button type="submit">Search</button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;