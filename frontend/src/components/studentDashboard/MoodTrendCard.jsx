import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import API from "../../api/axios";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg">
        <p className="text-slate-400 text-xs mb-0.5">{label}</p>
        <p>{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const MoodTrendCard = () => {
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/quiz/history", {
          headers: { Authorization: "Bearer " + token },
        });
        const quizzes = res.data;
        let startIndex = 0;
        if (quizzes.length > 7) {
          startIndex = quizzes.length - 7;
        }
        const data = [];
        for (let i = startIndex; i < quizzes.length; i++) {
          let weekLabel = quizzes[i].weekLabel;
          let label = weekLabel;
          if (weekLabel && weekLabel.split("-W")[1]) {
            label = "W" + weekLabel.split("-W")[1];
          }
          data.push({ score: quizzes[i].moodScore, label: label });
        }
        setTrendData(data);
      } catch (err) {}
      setLoading(false);
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm col-span-2">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
          Weekly Mood Trend
        </p>
        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    );
  }

  if (trendData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm col-span-2">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
          Weekly Mood Trend
        </p>
        <p className="text-sm text-slate-400">No quiz history yet.</p>
      </div>
    );
  }

  const scores = trendData.map((d) => d.score);
  const latest = scores[scores.length - 1];
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const best = Math.max(...scores);
  const minDomain = Math.max(0, Math.min(...scores) - 15);
  const maxDomain = Math.min(100, Math.max(...scores) + 15);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm col-span-2">
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5">
        Weekly Mood Trend
      </p>

      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trendData}
            margin={{ top: 4, right: 4, bottom: 0, left: -16 }}
          >
            <defs>
              <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fontWeight: 700, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[minDomain, maxDomain]}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={function (v) {
                return v + "%";
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#trendGrad)"
              dot={{ fill: "#6366f1", r: 4, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{
                r: 6,
                fill: "#6366f1",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-8 mt-5 pt-4 border-t border-slate-100">
        <div>
          <p className="text-xs text-slate-400 font-medium mb-0.5">Latest</p>
          <p className="text-xl font-black text-indigo-600">{latest}%</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium mb-0.5">Average</p>
          <p className="text-xl font-black text-slate-700">{avg}%</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium mb-0.5">Best</p>
          <p className="text-xl font-black text-emerald-600">{best}%</p>
        </div>
      </div>
    </div>
  );
};

export default MoodTrendCard;
