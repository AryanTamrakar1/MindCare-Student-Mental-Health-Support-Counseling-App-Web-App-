import { Star } from "lucide-react";

const CounselorTable = ({ counselorStats }) => {
  return (
    <div className="bg-white border border-blue-200 overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="px-8 pt-7 pb-5 flex items-start justify-between">
        <div>
          <p className="text-xl font-bold text-gray-900">Counselor Ratings</p>
          <p className="text-sm text-gray-500 mt-1">Average rating per counselor</p>
        </div>
        {counselorStats.length > 0 && (
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-300 px-3 py-1">
            Total Counselors: {counselorStats.length}
          </span>
        )}
      </div>
      <div className="h-px w-full bg-slate-100" />

      {counselorStats.length === 0 && (
        <p className="text-center text-gray-400 font-medium py-10 text-base">No counselor data yet.</p>
      )}

      {counselorStats.length > 0 && (
        <>
          <div className="grid grid-cols-3 divide-x divide-slate-100">
            <span className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-widest">Counselor</span>
            <span className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-widest">Avg Rating</span>
            <span className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-widest">Reviews</span>
          </div>
          <div className="h-px w-full bg-slate-100" />
          <div className="overflow-y-auto" style={{ maxHeight: "252px" }}>
            {counselorStats.map((c, index) => (
              <div key={index} className="grid grid-cols-3 divide-x divide-slate-100 border-b border-blue-50 last:border-0 hover:bg-blue-50 transition-colors">
                <span className="px-6 py-4 text-base font-semibold text-gray-900 truncate">{c.name}</span>
                <div className="px-6 py-4 flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => {
                      const roundedRating = Math.round(c.averageRating);
                      const shouldFill = i <= roundedRating;
                      let starClass = "fill-gray-200";
                      if (shouldFill) {
                        starClass = "fill-yellow-600";
                      }
                      return (
                        <Star
                          key={i}
                          size={13}
                          strokeWidth={0}
                          className={starClass}
                        />
                      );
                    })}
                  </div>
                  <span className="text-base font-bold text-gray-900">{c.averageRating}</span>
                </div>
                <span className="px-6 py-4 text-base font-medium text-gray-500">{c.totalRatings}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CounselorTable;