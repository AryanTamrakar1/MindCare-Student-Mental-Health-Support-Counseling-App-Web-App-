const ForumChart = ({ topicData, totalPosts, totalReplies }) => {
  const sorted = [];
  for (let i = 0; i < topicData.length; i++) {
    sorted.push(topicData[i]);
  }
  sorted.sort((a, b) => b.count - a.count);

  let maxVal = 1;
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].count > maxVal) {
      maxVal = sorted[i].count;
    }
  }

  return (
    <div className="bg-white border border-blue-200 overflow-hidden flex flex-col h-full" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="px-8 pt-7 pb-5 flex items-start justify-between">
        <div>
          <p className="text-xl font-bold text-gray-900">Forum Analytics</p>
          <p className="text-sm text-gray-500 mt-1">Posts per topic category</p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-300 px-3 py-1">Total Posts: {totalPosts}</span>
        </div>
      </div>
      <div className="h-px w-full bg-slate-100" />

      <div className="px-8 pt-7 pb-4 flex flex-col gap-9">
        {sorted.map((item, index) => {
          const pct = Math.round((item.count / maxVal) * 100);
          let barColor = "#93C5FD";
          if (index === 0) {
            barColor = "#2563EB";
          }
          if (index === 1) {
            barColor = "#3B82F6";
          }

          return (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-gray-700 leading-tight max-w-[75%]">{item.topic}</span>
                <span className="text-base font-bold text-gray-900">{item.count}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5">
                <div
                  className="h-2.5 transition-all"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForumChart;