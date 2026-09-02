import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Typography } from "@mui/material";

import type {
  OpportunitiesByStage,
} from "../api/dashboard";
import {
  DashboardChartCard,
} from "./DashboardChartCard";

interface PipelineChartProps {
  opportunitiesByStage: OpportunitiesByStage;
}

const colors = [
  "#94A3B8",
  "#3B82F6",
  "#F59E0B",
  "#8B5CF6",
  "#22C55E",
  "#EF4444",
];

export function PipelineChart({
  opportunitiesByStage,
}: PipelineChartProps) {
  const data = [
    {
      stage: "Prospecto",
      total: opportunitiesByStage.prospect,
    },
    {
      stage: "Contacto",
      total: opportunitiesByStage.contacted,
    },
    {
      stage: "Propuesta",
      total: opportunitiesByStage.proposal,
    },
    {
      stage: "Negociación",
      total: opportunitiesByStage.negotiation,
    },
    {
      stage: "Ganado",
      total: opportunitiesByStage.won,
    },
    {
      stage: "Perdido",
      total: opportunitiesByStage.lost,
    },
  ];

  return (
    <DashboardChartCard
      title="Pipeline Comercial"
      description="Oportunidades del período por etapa."
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="stage"
            tick={{
              fontSize: 12,
            }}
          />

          <YAxis
            allowDecimals={false}
          />

          <Tooltip />

          <Bar
            dataKey="total"
            radius={[8, 8, 0, 0]}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={
                  colors[
                    index % colors.length
                  ]
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {data.every(
        (item) => item.total === 0,
      ) && (
        <Typography
          align="center"
          color="text.secondary"
        >
          No hay oportunidades en este período.
        </Typography>
      )}
    </DashboardChartCard>
  );
}
