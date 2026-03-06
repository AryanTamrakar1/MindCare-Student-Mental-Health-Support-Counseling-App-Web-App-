import { Search, X } from "lucide-react";

const SearchBar = ({ searchTerm, setSearchTerm, onSearch, onClear }) => {
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearch(searchTerm);
  };

  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex items-center gap-2 flex-1 bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by name or keyword..."
          className="flex-1 outline-none text-sm text-gray-600 font-medium"
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        {searchTerm && (
          <button
            onClick={onClear}
            className="text-gray-400 hover:text-gray-600 transition shrink-0"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <button
        onClick={handleSearch}
        className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition shrink-0"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;