import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import errorReportStore from "../../stores/errorReportStore";

const AttackErrorReportChart = () => {
  const { reports } = errorReportStore();

  const getDailyReportCounts = () => {
    const countMap = {};

    reports.forEach((report) => {
      if (report.reportCategory !== "ATTACK") return;
      const date = new Date(report.createdDt).toISOString().slice(0, 10);
      countMap[date] = (countMap[date] || 0) + 1;
    });

    return Object.entries(countMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const dailyCounts = getDailyReportCounts();

  return (
  <div className="chart-wrapper">
    <div className="chart-container">
      <h3 style={{ margin: "1rem 0" }}>📈 날짜별 공격 에러 리포트 발생 추이</h3>
      <div style={{ height: "300px" }}> {/* 그래프 전용 높이 박스 */}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailyCounts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

};

export default AttackErrorReportChart;