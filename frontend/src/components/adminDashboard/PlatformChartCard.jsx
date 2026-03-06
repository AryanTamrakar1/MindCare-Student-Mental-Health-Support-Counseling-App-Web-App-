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
import { TrendingUp } from "lucide-react";
import API from "../../api/axios";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-lg">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
        {label}
      </p>
      <p className="text-xl font-black text-indigo-600">{payload[0].value}</p>
      <p className="text-xs text-slate-400">sessions</p>
    </div>
  );
};

const PlatformChartCard = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/analytics/sessions", {
          headers: { Authorization: "Bearer " + token },
        });
        setMonthlyData(res.data.monthlyData || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  const hasData = monthlyData.length > 0;
  const noData = monthlyData.length === 0;

  return (
    <div>
      {loading && (
        <div className="h-48 flex items-center justify-center">
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

      {!loading && hasData && (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyData}
              margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
            >
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
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
                dataKey="sessions"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#areaFill)"
                dot={{ fill: "#6366f1", r: 3, strokeWidth: 0 }}
                activeDot={{
                  fill: "#6366f1",
                  r: 5,
                  strokeWidth: 3,
                  stroke: "#e0e7ff",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {!loading && noData && (
        <div className="h-48 flex flex-col items-center justify-center gap-2">
          <TrendingUp size={28} className="text-slate-200" />
          <p className="text-slate-400 text-sm">
            No session data available yet
          </p>
        </div>
      )}
    </div>
  );
};

export default PlatformChartCard;
