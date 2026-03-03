import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const ForumChart = ({ topicData, totalPosts, totalReplies }) => {
  const statusItems = [
    { label: "Total Posts", value: totalPosts, color: "bg-indigo-500" },
    { label: "Total Replies", value: totalReplies, color: "bg-purple-400" },
  ];

  const chartHeight = topicData.length * 50;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full flex flex-col">
      <p className="text-[11px] font-black text-gray-800 uppercase tracking-widest mb-1">
        Forum Analytics
      </p>
      <p className="text-gray-400 text-xs mb-4">Posts per category</p>
      <div className="border-b border-gray-100 mb-5"></div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={topicData}
            layout="vertical"
            margin={{ top: 10, right: 40, left: 10, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              tick={{ fontSize: 11 }}
              allowDecimals={false}
              label={{
                value: "Number of Posts",
                position: "insideBottom",
                offset: -15,
                fontSize: 11,
                fill: "#6b7280",
              }}
            />
            <YAxis
              dataKey="topic"
              type="category"
              tick={{ fontSize: 10, fontWeight: "bold" }}
              width={170}
              label={{
                value: "Category",
                angle: -90,
                position: "insideLeft",
                offset: 15,
                fontSize: 11,
                fill: "#6b7280",
              }}
            />
            <Tooltip />
            <Bar dataKey="count" fill="#818cf8" radius={[0, 6, 6, 0]}>
              <LabelList
                dataKey="count"
                position="right"
                style={{ fontSize: 11, fontWeight: "bold", fill: "#374151" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="border-t border-gray-100 mt-5 pt-4">
        <p className="text-[11px] font-black text-gray-800 uppercase tracking-widest mb-3">
          Forum Summary
        </p>
        <div className="flex flex-wrap gap-3">
          {statusItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className="text-xs font-bold text-gray-600">
                {item.label}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForumChart;
