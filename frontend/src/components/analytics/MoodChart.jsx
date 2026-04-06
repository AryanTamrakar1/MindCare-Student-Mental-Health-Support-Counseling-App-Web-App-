import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const MOOD_CONFIG = [
  { key: "positive", label: "Positive", color: "#1E3A8A" },
  { key: "neutral",  label: "Neutral",  color: "#2563EB" },
  { key: "negative", label: "Negative", color: "#93C5FD" },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="bg-white border border-slate-200 px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-gray-900">{payload[0].name}</p>
      <p className="text-2xl font-bold mt-0.5" style={{ color: payload[0].payload.color }}>{payload[0].value}</p>
      <p className="text-xs text-gray-500">students</p>
    </div>
  );
};

const MoodChart = ({ moodBreakdown }) => {
  const chartData = MOOD_CONFIG.map(({ key, label, color }) => ({
    name: label,
    value: moodBreakdown[key] || 0,
    color,
  }));

  let total = 0;
  for (let i = 0; i < chartData.length; i++) {
    total = total + chartData[i].value;
  }

  return (
    <div className="bg-white border border-slate-100 overflow-hidden flex flex-col h-full" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <div className="px-8 pt-7 pb-5 flex items-start justify-between">
        <div>
          <p className="text-xl font-bold text-gray-900">Student Mood Breakdown</p>
          <p className="text-sm text-gray-500 mt-1">Based on all weekly quiz submissions</p>
        </div>
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-300 px-3 py-1">
          Total Students Surveyed: {total}
        </span>
      </div>
      <div className="h-px w-full bg-slate-100" />

      <div className="grid flex-1" style={{ gridTemplateColumns: "1.2fr 1px 1fr" }}>

        <div className="flex items-center justify-center p-6">
          <ResponsiveContainer width="100%" height={310}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={155}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
                isAnimationActive={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-100" />

        <div className="flex flex-col overflow-hidden">
          <div className="px-8 py-4 border-b border-slate-100">
            <p className="text-sm font-bold text-gray-900 uppercase tracking-widest">
              Mood Distribution
            </p>
          </div>
          <div className="px-8 py-6 flex flex-col gap-6 justify-center flex-1">
            {MOOD_CONFIG.map(({ key, label, color }) => {
              const val = moodBreakdown[key] || 0;
              const pct = total > 0 ? Math.round((val / total) * 100) : 0;
              return (
                <div key={key} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-sm font-semibold text-gray-700">{label}</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color }}>{pct}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                  <p className="text-sm text-slate-400 font-medium">{val} students</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

export default MoodChart;