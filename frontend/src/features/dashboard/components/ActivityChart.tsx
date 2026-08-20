import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Typography } from "@mui/material";

import type { Activity } from "@/features/activities";
import { DashboardChartCard } from "./DashboardChartCard";

interface ActivityChartProps {
  activities: Activity[];
}

const COLORS = [
  "#F59E0B",
  "#22C55E",
  "#3B82F6",
];

export function ActivityChart({
  activities,
}: ActivityChartProps) {
  const pending = activities.filter(
    (activity) => activity.status === "pending",
  ).length;

  const completed = activities.filter(
    (activity) => activity.status === "completed",
  ).length;

  const cancelled = activities.filter(
    (activity) => activity.status === "cancelled",
  ).length;

  const data = [
    {
      name: "Pendientes",
      value: pending,
    },
    {
      name: "Completadas",
      value: completed,
    },
    {
      name: "Canceladas",
      value: cancelled,
    },
  ];

  return (
    <DashboardChartCard
      title="Estado de actividades"
      description="Distribución de actividades registradas."
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={
                  COLORS[
                    index % COLORS.length
                  ]
                }
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {data.every(
        (item) => item.value === 0,
      ) && (
        <Typography
          align="center"
          color="text.secondary"
        >
          No hay actividades registradas.
        </Typography>
      )}
    </DashboardChartCard>
  );
}