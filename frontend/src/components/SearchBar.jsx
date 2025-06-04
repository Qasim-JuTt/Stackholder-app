// components/admin/SearchBar.js

import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ placeholder }) => {
  return (
    <div className="flex items-center w-full md:w-1/2 bg-white px-4 py-2 rounded-lg shadow-sm">
      <Search className="text-gray-400 mr-2 w-5 h-5" />
      <input
        type="text"
        placeholder={placeholder || 'Search...'}
        className="w-full outline-none text-sm"
      />
    </div>
  );
};

export default SearchBar;
