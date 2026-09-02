import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Typography } from "@mui/material";

import {
  DashboardChartCard,
} from "./DashboardChartCard";

interface ActivityChartProps {
  pending: number;
  overdue: number;
  upcoming: number;
}

const COLORS = [
  "#F59E0B",
  "#EF4444",
  "#3B82F6",
];

export function ActivityChart({
  pending,
  overdue,
  upcoming,
}: ActivityChartProps) {
  const data = [
    {
      name: "Pendientes",
      value: pending,
    },
    {
      name: "Vencidas",
      value: overdue,
    },
    {
      name: "Próximas",
      value: upcoming,
    },
  ];

  return (
    <DashboardChartCard
      title="Estado de actividades"
      description="Actividades del período seleccionado."
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
          No hay actividades en este período.
        </Typography>
      )}
    </DashboardChartCard>
  );
}
