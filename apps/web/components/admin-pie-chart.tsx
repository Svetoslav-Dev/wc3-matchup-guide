"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

type Slice = { name: string; value: number };

type Props = {
  data: Slice[];
  colors: string[];
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: { fill: string } }[] }) => {
  if (!active || !payload?.length) return null;
  const { name, value, payload: p } = payload[0];
  return (
    <div style={{ background: "#12192b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 14px", fontSize: "0.85rem" }}>
      <span style={{ color: p.fill, fontWeight: 600 }}>{name}</span>
      <span style={{ color: "#e2e8f0", marginLeft: 8 }}>{value.toLocaleString()}</span>
    </div>
  );
};

export function AdminPieChart({ data, colors }: Props) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="publish-donut">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={75}
            outerRadius={108}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: "#9ba8c1", fontSize: "0.82rem" }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
