import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#0aff60", "#ff0a0a", "#640aff"]; //VALID / ATTACK / INVALID 순서
const LABELS = ["VALID", "ATTACK", "INVALID"];

const CategoryPieChart = ({ data }) => {

  const formattedData = Object.entries(data).map(([key, value]) => ({
    name: key,
    value,
  }));

  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label
          >
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* 범례 추가 */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "0px" }}>
        {LABELS.map((label, idx) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: COLORS[idx],
                borderRadius: "3px",
              }}
            />
            <span style={{ fontSize: "14px" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPieChart;
