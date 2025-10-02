"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function HabitChart({ series }: { series: { date: string; done: number }[] }) {
  return (
    <div style={{ width: '100%', height: 120 }}>
      <ResponsiveContainer>
        <LineChart data={series}>
          <XAxis dataKey="date" hide />
          <YAxis domain={[0,1]} hide />
          <Tooltip />
          <Line type="monotone" dataKey="done" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
