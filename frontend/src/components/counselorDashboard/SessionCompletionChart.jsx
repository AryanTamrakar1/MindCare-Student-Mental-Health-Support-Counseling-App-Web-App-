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

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-lg">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
        {label}
      </p>
      {payload.map(function (entry) {
        return (
          <div key={entry.name} className="flex items-center gap-2 mb-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: entry.color }}
            />
            <span className="text-xs font-semibold text-slate-600">
              {entry.name}
            </span>
            <span className="text-xs font-black text-slate-800 ml-auto">
              {entry.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const SessionCompletionChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/appointments/my-sessions", {
          headers: { Authorization: "Bearer " + token },
        });
        const sessions = res.data;

        const monthlyCompleted = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const monthlyMissed = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        for (let i = 0; i < sessions.length; i++) {
          const session = sessions[i];
          const monthIndex = new Date(session.createdAt).getMonth();
          if (session.status === "Completed") {
            monthlyCompleted[monthIndex] = monthlyCompleted[monthIndex] + 1;
          }
          if (session.status === "Cancelled" || session.status === "Rejected") {
            monthlyMissed[monthIndex] = monthlyMissed[monthIndex] + 1;
          }
        }

        const data = [];
        for (let i = 0; i < 12; i++) {
          data.push({
            month: MONTHS[i],
            Completed: monthlyCompleted[i],
            Missed: monthlyMissed[i],
          });
        }
        setChartData(data);
      } catch (err) {}
      setLoading(false);
    };
    fetchSessions();
  }, []);

  const isLoading = loading;
  const hasData = !loading && mounted;

  return (
    <div>
      {isLoading && (
        <div
          style={{ width: "100%", height: 192 }}
          className="flex items-center justify-center"
        >
          <div className="flex gap-1.5">
            <span
              className="w-2 h-2 rounded-full bg-slate-200 animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-2 h-2 rounded-full bg-slate-200 animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-2 h-2 rounded-full bg-slate-200 animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      )}

      {hasData && (
        <div style={{ width: "100%", height: 192 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
            >
              <defs>
                <linearGradient id="completedFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="missedFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="#f1f5f9"
                strokeDasharray="0"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="Completed"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#completedFill)"
                dot={{ fill: "#6366f1", r: 3, strokeWidth: 0 }}
                activeDot={{
                  fill: "#6366f1",
                  r: 5,
                  strokeWidth: 3,
                  stroke: "#e0e7ff",
                }}
              />
              <Area
                type="monotone"
                dataKey="Missed"
                stroke="#f43f5e"
                strokeWidth={2}
                fill="url(#missedFill)"
                dot={{ fill: "#f43f5e", r: 3, strokeWidth: 0 }}
                activeDot={{
                  fill: "#f43f5e",
                  r: 5,
                  strokeWidth: 3,
                  stroke: "#ffe4e6",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SessionCompletionChart;
