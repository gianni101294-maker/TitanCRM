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

import type { PipelineResponse } from "@/features/pipeline";
import {
  DashboardChartCard,
} from "./DashboardChartCard";

interface PipelineChartProps {
  pipeline: PipelineResponse;
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
  pipeline,
}: PipelineChartProps) {
  const data = [
    {
      stage: "Prospecto",
      total: pipeline.prospect.length,
    },
    {
      stage: "Contacto",
      total: pipeline.contacted.length,
    },
    {
      stage: "Propuesta",
      total: pipeline.proposal.length,
    },
    {
      stage: "Negociación",
      total: pipeline.negotiation.length,
    },
    {
      stage: "Ganado",
      total: pipeline.won.length,
    },
    {
      stage: "Perdido",
      total: pipeline.lost.length,
    },
  ];

  return (
    <DashboardChartCard
      title="Pipeline Comercial"
      description="Cantidad de oportunidades por etapa."
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
          No hay oportunidades.
        </Typography>
      )}
    </DashboardChartCard>
  );
}