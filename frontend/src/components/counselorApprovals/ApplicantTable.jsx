const ApplicantTable = ({ pendingUsers, onViewApplication }) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Pending Verification
        </h2>
        <span className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-black uppercase">
          {pendingUsers.length} Applications
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-black tracking-[0.2em]">
              <th className="p-6">Counselor</th>
              <th className="p-6">Submission Status</th>
              <th className="p-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pendingUsers.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="p-20 text-center text-gray-400 italic"
                >
                  No pending applications found.
                </td>
              </tr>
            ) : (
              pendingUsers.map((u) => (
                <tr
                  key={u._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="p-6">
                    <div className="font-bold text-gray-900 text-lg">
                      {u.name}
                    </div>
                    <div className="text-gray-500 text-xs">{u.email}</div>
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold border border-amber-100">
                      Waiting for Review
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <button
                      onClick={() => onViewApplication(u)}
                      className="bg-indigo-50 text-indigo-600 px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition"
                    >
                      View Application →
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicantTable;
