const SearchBar = ({ searchTerm, setSearchTerm, onSearch }) => {
  return (
    <section className="mb-6">
      <div className="flex bg-white p-2 rounded-[15px] border border-gray-200 shadow-sm overflow-hidden">
        <input
          type="text"
          placeholder="Search by name or keyword..."
          className="flex-1 p-3 outline-none text-sm text-gray-600 font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={onSearch}
          className="bg-[#4f46e5] text-white px-8 py-2 rounded-[10px] font-bold hover:bg-[#3730a3] transition"
        >
          Search
        </button>
      </div>
    </section>
  );
};

export default SearchBar;
