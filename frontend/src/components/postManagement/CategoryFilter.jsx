const categories = [
  "All",
  "Academic & Exam Pressure",
  "Skill Gap & Job Anxiety",
  "Family & Social Pressure",
  "Emotional & Personal Issues",
  "Sleep & Physical Wellbeing",
  "General Mental Health",
];

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">
      <p className="text-[11px] font-black text-gray-800 uppercase tracking-widest mb-3">
        Filter by Category
      </p>
      <div className="border-b border-gray-100 mb-4"></div>
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`text-xs font-bold px-4 py-2 rounded-full border transition-all duration-200 ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
