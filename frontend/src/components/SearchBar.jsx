import { Search } from 'lucide-react';

const SearchBar = ({ placeholder, className = '', onChange }) => {
  return (
    <div className={`flex items-center bg-white px-4 py-2 rounded-lg shadow-sm ${className}`}>
      <Search className="text-gray-400 mr-2 w-5 h-5" />
      <input
        type="text"
        placeholder={placeholder || 'Search...'}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full outline-none text-sm"
      />
    </div>
  );
};

export default SearchBar;
