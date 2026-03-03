import { Star } from "lucide-react";

const CounselorTable = ({ counselorStats }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full flex flex-col">
      <p className="text-[11px] font-black text-gray-800 uppercase tracking-widest mb-1">
        Counselor Ratings
      </p>
      <p className="text-gray-400 text-xs mb-4">Average rating per counselor</p>
      <div className="border-b border-gray-100 mb-5"></div>

      {counselorStats.length === 0 ? (
        <p className="text-center text-gray-400 font-bold py-8">
          No counselor data yet.
        </p>
      ) : (
        <div className="flex flex-col flex-1">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="text-[11px] font-black text-gray-400 uppercase tracking-widest pb-3">
                  Counselor
                </th>
                <th className="text-[11px] font-black text-gray-400 uppercase tracking-widest pb-3">
                  Avg Rating
                </th>
                <th className="text-[11px] font-black text-gray-400 uppercase tracking-widest pb-3">
                  Total Ratings
                </th>
              </tr>
            </thead>
          </table>

          <div className="overflow-y-auto" style={{ maxHeight: "260px" }}>
            <table className="w-full">
              <tbody>
                {counselorStats.map((c, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="py-3 text-sm font-bold text-gray-800">
                      {c.name}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <Star
                          size={14}
                          className="text-yellow-400 fill-yellow-400"
                        />
                        <span className="text-sm font-black text-gray-800">
                          {c.averageRating}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-sm font-bold text-gray-500">
                      {c.totalRatings}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselorTable;
