import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="bg-white border border-slate-200 px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{payload[0].value}</p>
      <p className="text-xs text-gray-500">sessions</p>
    </div>
  );
};

const SessionChart = ({ monthlyData, statusBreakdown }) => {
  let maxSessions = 0;
  for (let i = 0; i < monthlyData.length; i++) {
    if (monthlyData[i].sessions > maxSessions) {
      maxSessions = monthlyData[i].sessions;
    }
  }

  let sessionTotal = 0;
  const statusValues = Object.values(statusBreakdown);
  for (let i = 0; i < statusValues.length; i++) {
    sessionTotal = sessionTotal + (statusValues[i] || 0);
  }

  return (
    <div className="bg-white border border-blue-200 overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <div className="px-8 pt-7 pb-5 flex items-start justify-between">
        <div>
          <p className="text-xl font-bold text-gray-900">Session Analytics</p>
          <p className="text-sm text-gray-500 mt-1">Sessions booked per month</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-blue-700 inline-block shrink-0" />
            <span className="text-xs font-semibold text-gray-400">Sessions Completed</span>
          </div>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-300 px-3 py-1">
            Total Sessions: {sessionTotal}
          </span>
        </div>
      </div>

      <div className="h-px w-full bg-slate-100" />

      <div className="px-3 pt-4 pb-4">
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={monthlyData} margin={{ top: 10, right: 12, left: -8, bottom: 0 }} barCategoryGap="40%">
            <CartesianGrid vertical={false} stroke="#E2E8F0" strokeWidth={1} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94A3B8", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94A3B8", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              allowDecimals={false}
              width={36}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />
            <Bar dataKey="sessions" radius={0} maxBarSize={36} fill="#2563EB" isAnimationActive={false}>
              {monthlyData.map((entry, index) => {
                let cellColor = "#BFDBFE";
                if (entry.sessions === maxSessions) {
                  cellColor = "#1D4ED8";
                }
                return (
                  <Cell
                    key={index}
                    fill={cellColor}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default SessionChart;