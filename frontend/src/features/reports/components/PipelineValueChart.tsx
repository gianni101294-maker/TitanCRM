import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PipelineValueChartProps {
  data: {
    stage: string;
    value: number;
  }[];
}

function formatCurrency(value: number) {
  return value.toLocaleString("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 0,
  });
}

export function PipelineValueChart({
  data,
}: PipelineValueChartProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        height: 420,
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          Valor del Pipeline
        </Typography>

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="stage" />

            <YAxis
              tickFormatter={(value) => `S/ ${value}`}
            />

            <Tooltip
              formatter={(value) =>
                formatCurrency(Number(value))
              }
            />

            <Bar
              dataKey="value"
              fill="#2e7d32"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}