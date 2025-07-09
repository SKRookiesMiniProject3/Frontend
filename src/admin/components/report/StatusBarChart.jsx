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
    CANCELLED: "#A0AEC0",
    ON_HOLD: "#4D96FF",
  };

  const statusLabelMap = {
    NOT_STARTED: "시작 안함",
    IN_PROGRESS: "진행중",
    COMPLETED: "완료",
    CANCELLED: "취소",
    ON_HOLD: "보류",
  };

  const formattedData = Object.entries(data).map(([key, value]) => ({
    status: key,
    count: value,
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
      <ResponsiveContainer>
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
