"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function PartyChart({ data }) {
  return (
    <ResponsiveContainer width="90%" height={500}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis unit="%" />
        <Tooltip />
        <Bar dataKey="percentage" fill="#4379F2" />
      </BarChart>
    </ResponsiveContainer>
  );
}