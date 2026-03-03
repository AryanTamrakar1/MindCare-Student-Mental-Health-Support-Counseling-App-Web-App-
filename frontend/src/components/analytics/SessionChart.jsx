import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SessionChart = ({ monthlyData, statusBreakdown }) => {
  const statusItems = [
    {
      label: "Completed",
      value: statusBreakdown.completed,
      color: "bg-green-500",
    },
    {
      label: "Approved",
      value: statusBreakdown.approved,
      color: "bg-indigo-500",
    },
    {
      label: "Pending",
      value: statusBreakdown.pending,
      color: "bg-yellow-500",
    },
    { label: "Declined", value: statusBreakdown.declined, color: "bg-red-400" },
    { label: "Missed", value: statusBreakdown.missed, color: "bg-gray-400" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full flex flex-col">
      <p className="text-[11px] font-black text-gray-800 uppercase tracking-widest mb-1">
        Session Analytics
      </p>
      <p className="text-gray-400 text-xs mb-4">
        Total sessions booked per month
      </p>
      <div className="border-b border-gray-100 mb-5"></div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={monthlyData}
            margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fontWeight: "bold" }}
              label={{
                value: "Month",
                position: "insideBottom",
                offset: -15,
                fontSize: 11,
                fill: "#6b7280",
              }}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              allowDecimals={false}
              label={{
                value: "Sessions",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fontSize: 11,
                fill: "#6b7280",
              }}
            />
            <Tooltip />
            <Bar dataKey="sessions" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="border-t border-gray-100 mt-5 pt-4">
        <p className="text-[11px] font-black text-gray-800 uppercase tracking-widest mb-3">
          Status Breakdown
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

export default SessionChart;
