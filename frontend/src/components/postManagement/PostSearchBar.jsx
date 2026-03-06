import { Search, X } from "lucide-react";

const PostSearchBar = ({ searchTerm, setSearchTerm, onClear }) => {
  return (
    <div className="flex bg-white p-2 rounded-2xl border border-gray-200 shadow-sm mb-6">
      <div className="flex items-center gap-2 flex-1 px-2">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search posts by title or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none text-sm text-gray-600 font-medium"
        />
        {searchTerm && (
          <button
            onClick={onClear}
            className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default PostSearchBar;
