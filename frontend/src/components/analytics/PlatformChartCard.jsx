import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
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
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="bg-slate-900 text-white px-4 py-3 shadow-xl"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
        {label}
      </p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 shrink-0" style={{ background: p.color }} />
          <p className="text-sm font-bold" style={{ color: p.color }}>
            {p.value}
          </p>
          <p className="text-sm text-slate-400">{p.name}</p>
        </div>
      ))}
    </div>
  );
};

const PlatformChartCard = ({ selectedYear }) => {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/analytics/sessions", {
          headers: { Authorization: "Bearer " + token },
          params: { year: selectedYear },
        });
        setRawData(res.data.monthlyData || []);
      } catch (err) {
        console.error(err);
        setRawData([]);
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, [selectedYear]);

  const chartData = MONTHS.map((month, monthIndex) => {
    const found = rawData.find((d) => {
      const label = (d.month || d.label || "").toString();
      const byIndex =
        d.monthIndex === monthIndex || d.month_index === monthIndex;
      const byName = label.toLowerCase().startsWith(month.toLowerCase());
      const byDate = (() => {
        try {
          const parsed = new Date(label);
          return !isNaN(parsed) && parsed.getMonth() === monthIndex;
        } catch {
          return false;
        }
      })();
      return byIndex || byName || byDate;
    });
    return {
      label: month,
      sessions: found ? found.sessions || 0 : 0,
      students: found ? found.students || 0 : 0,
    };
  });

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="flex gap-1.5">
          {[0, 150, 300].map((d) => (
            <span
              key={d}
              className="w-2 h-2 bg-blue-200 animate-bounce"
              style={{ animationDelay: `${d}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (rawData.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-2">
        <TrendingUp size={28} className="text-blue-200" />
        <p className="text-slate-400 text-sm">
          No session data for {selectedYear}
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 280, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={chartData}
          margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
          barCategoryGap="32%"
        >
          <CartesianGrid
            stroke="#F1F5F9"
            strokeDasharray="4 4"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 13, fill: "#94A3B8", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#94A3B8", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#EFF6FF" }} />
          <Bar dataKey="sessions" name="Sessions" fill="#1D4ED8" radius={0} />
          <Bar
            dataKey="students"
            name="New Students"
            fill="#93C5FD"
            radius={0}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlatformChartCard;
