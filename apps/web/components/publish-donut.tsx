"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

type Props = {
  published: number;
  draft: number;
};

const COLORS = ["#7cc388", "#f97316"];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div style={{ background: "#12192b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 14px", fontSize: "0.85rem" }}>
      <span style={{ color: name === "Published" ? "#7cc388" : "#f97316", fontWeight: 600 }}>{name}</span>
      <span style={{ color: "#e2e8f0", marginLeft: 8 }}>{value.toLocaleString()}</span>
    </div>
  );
};

export function PublishDonut({ published, draft }: Props) {
  const data = [
    { name: "Published", value: published },
    { name: "Draft",     value: draft },
  ];

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
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            content={() => (
              <ul style={{ display: "flex", justifyContent: "center", gap: "1rem", listStyle: "none", margin: 0, padding: 0 }}>
                {[{ label: "Published", color: COLORS[0] }, { label: "Draft", color: COLORS[1] }].map(({ label, color }) => (
                  <li key={label} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill={color} /></svg>
                    <span style={{ color: "#9ba8c1", fontSize: "0.82rem" }}>{label}</span>
                  </li>
                ))}
              </ul>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
