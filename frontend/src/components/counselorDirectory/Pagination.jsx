const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const getPageClass = (num) => {
    if (currentPage === num) {
      return "w-10 h-10 rounded-xl font-bold text-sm transition-all border bg-indigo-600 text-white border-indigo-600 shadow-sm";
    }
    return "w-10 h-10 rounded-xl font-bold text-sm transition-all border bg-white text-gray-900 border-gray-200 hover:border-indigo-400 hover:text-indigo-600";
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8 pb-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-900 hover:border-indigo-400 hover:text-indigo-600 transition disabled:opacity-40 disabled:cursor-not-allowed bg-white"
      >
        ← Prev
      </button>

      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={getPageClass(num)}
        >
          {num}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-900 hover:border-indigo-400 hover:text-indigo-600 transition disabled:opacity-40 disabled:cursor-not-allowed bg-white"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;