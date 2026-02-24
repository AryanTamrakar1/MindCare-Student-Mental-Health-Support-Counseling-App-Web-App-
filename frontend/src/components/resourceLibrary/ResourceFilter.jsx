import { BookOpen, Bookmark, Search, X } from "lucide-react";

const categories = [
  "All",
  "General Mental Health",
  "Exam & Academic Pressure",
  "Skill Gap & Career Fear",
  "Family Expectation Burden",
  "Sleep & Energy",
  "Social Isolation",
  "Low Motivation",
];

const types = ["All", "Video", "Article"];

function ResourceFilter({
  searchDraft,
  setSearchDraft,
  handleSearch,
  handleClearSearch,
  activeTab,
  setActiveTab,
  counselorDraft,
  setCounselorDraft,
  typeDraft,
  setTypeDraft,
  categoryDraft,
  setCategoryDraft,
  sortDraft,
  setSortDraft,
  handleApplyFilter,
  handleClearFilter,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 gap-2">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={searchDraft}
            onChange={function (e) {
              setSearchDraft(e.target.value);
            }}
            onKeyDown={function (e) {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Search resources..."
            className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400"
          />
          {searchDraft !== "" && (
            <button
              onClick={handleClearSearch}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Search
        </button>
      </div>

      <div className="border-t border-gray-100"></div>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={function () {
            setActiveTab("all");
          }}
          className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl border transition-all duration-200 ${
            activeTab === "all"
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
          }`}
        >
          <BookOpen size={13} />
          All Resources
        </button>

        <button
          onClick={function () {
            setActiveTab("bookmarked");
          }}
          className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl border transition-all duration-200 ${
            activeTab === "bookmarked"
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
          }`}
        >
          <Bookmark size={13} />
          Saved Resources
        </button>

        <button
          onClick={function () {
            setCounselorDraft(!counselorDraft);
          }}
          className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl border transition-all duration-200 ${
            counselorDraft === true
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-600"
          }`}
        >
          Counselor Recommended
        </button>

        <div className="h-6 w-px bg-gray-200"></div>

        <select
          value={typeDraft}
          onChange={function (e) {
            setTypeDraft(e.target.value);
          }}
          className="text-xs font-bold px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 focus:outline-none focus:border-indigo-400"
        >
          {types.map(function (type) {
            return (
              <option key={type} value={type}>
                {type === "All" ? "All Types" : type}
              </option>
            );
          })}
        </select>

        <select
          value={categoryDraft}
          onChange={function (e) {
            setCategoryDraft(e.target.value);
          }}
          className="text-xs font-bold px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 focus:outline-none focus:border-indigo-400"
        >
          {categories.map(function (cat) {
            return (
              <option key={cat} value={cat}>
                {cat === "All" ? "All Categories" : cat}
              </option>
            );
          })}
        </select>

        <select
          value={sortDraft}
          onChange={function (e) {
            setSortDraft(e.target.value);
          }}
          className="text-xs font-bold px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 focus:outline-none focus:border-indigo-400"
        >
          <option value="None">Sort By</option>
          <option value="Most Liked">Most Liked</option>
          <option value="Least Liked">Least Liked</option>
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
        </select>

        <button
          onClick={handleApplyFilter}
          className="text-xs font-bold px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors ml-auto"
        >
          Apply Filter
        </button>

        <button
          onClick={handleClearFilter}
          className="text-xs font-bold px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default ResourceFilter;
