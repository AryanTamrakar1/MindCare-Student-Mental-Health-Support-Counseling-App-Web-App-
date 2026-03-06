import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import API from "../../api/axios";

const COLORS = [
  "#6366f1",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#06b6d4",
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
        {payload[0].name}:{" "}
        <span className="text-indigo-300">{payload[0].value}/5</span>
      </div>
    );
  }
  return null;
};

const MoodScoreCard = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/smart/mood-analysis", {
          headers: { Authorization: "Bearer " + token },
        });
        setAnalysis(res.data);
      } catch (err) {}
      setLoading(false);
    };
    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
          Wellness Breakdown
        </p>
        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!analysis || !analysis.hasEnoughData || !analysis.categoryAverages) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
          Wellness Breakdown
        </p>
        <p className="text-sm text-slate-400">
          Complete your first quiz to see your breakdown.
        </p>
      </div>
    );
  }

  const chartData = Object.entries(analysis.categoryAverages).map(
    ([name, value]) => ({ name, value }),
  );
  const total = chartData.reduce((s, d) => s + d.value, 0);
  const avgOverall = (total / chartData.length).toFixed(1);

  let centerValue = avgOverall;
  let centerSub = "avg / 5";
  let centerName = "";

  if (active !== null && chartData[active]) {
    centerValue = chartData[active].value;
    centerSub = "/5";
    centerName = chartData[active].name;
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
        Wellness Breakdown
      </p>

      <div
        className="flex-1"
        style={{ width: "100%", height: 320, position: "relative" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={165}
              dataKey="value"
              strokeWidth={3}
              stroke="#fff"
              onMouseEnter={function (_, index) {
                setActive(index);
              }}
              onMouseLeave={function () {
                setActive(null);
              }}
            >
              {chartData.map(function (entry, index) {
                let opacity = 1;
                if (active !== null && active !== index) opacity = 0.15;
                return (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index % COLORS.length]}
                    opacity={opacity}
                  />
                );
              })}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <span className="text-5xl font-black text-slate-800 leading-none">
            {centerValue}
          </span>
          <span className="text-sm text-slate-400 font-semibold mt-1">
            {centerSub}
          </span>
          {centerName.length > 0 && (
            <span className="text-xs text-slate-500 font-bold mt-2 text-center leading-tight px-6">
              {centerName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodScoreCard;
