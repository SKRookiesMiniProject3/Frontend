import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const StatusBarChart = ({ data }) => {
  if (!data) return null;

  const colorMap = {
    NOT_STARTED: "#FF6B6B",
    IN_PROGRESS: "#FFD93D",
    COMPLETED: "#6BCB77",
  };

  const statusLabelMap = {
    NOT_STARTED: "시작 전",
    IN_PROGRESS: "진행 중",
    COMPLETED: "완료",
  };

  const statusOrder = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"];

  const formattedData = statusOrder
    .filter((status) => data[status] !== undefined)
    .map((status) => ({
      status,
      count: data[status],
    }));


  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const englishStatus = payload[0].payload.status;
      return (
        <div className="custom-tooltip" style={{ background: "#fff", padding: "8px", border: "1px solid #ccc" }}>
          <p><strong>{statusLabelMap[englishStatus] || englishStatus}</strong></p>
          <p>리포트 수: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count">
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colorMap[entry.status] || "#8884d8"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatusBarChart;
