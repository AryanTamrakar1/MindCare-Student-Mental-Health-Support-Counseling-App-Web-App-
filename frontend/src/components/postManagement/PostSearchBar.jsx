import { Search, X } from "lucide-react";

const PostSearchBar = ({ searchTerm, setSearchTerm, onClear }) => {
  return (
    <>
      <p className="text-[11px] font-black text-gray-800 uppercase tracking-widest mb-2">
        Search Posts
      </p>
      <div className="border-b border-gray-200 mb-3"></div>
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
    </>
  );
};

export default PostSearchBar;
