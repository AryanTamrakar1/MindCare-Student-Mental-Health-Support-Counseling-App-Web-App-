const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-12 pb-10">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`w-10 h-10 rounded-xl font-bold text-sm border transition-all ${
            currentPage === num
              ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
              : "bg-white text-gray-400 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
          }`}
        >
          {num}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
