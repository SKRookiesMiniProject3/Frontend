import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const ReportTrendChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis allowDecimals={false} domain={[0, "dataMax + 1"]} />
      <Tooltip
        formatter={(value) => [`${value}건`]}
        labelFormatter={(label) => `에러 리포트 수 (${label})`}
      />
      <Bar dataKey="count" fill="#6366f1" />
    </BarChart>
  </ResponsiveContainer>
);

export default ReportTrendChart;