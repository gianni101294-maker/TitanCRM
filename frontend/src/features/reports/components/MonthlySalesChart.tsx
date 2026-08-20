import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MonthlySalesChartProps {
  data: {
    month: string;
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

export function MonthlySalesChart({
  data,
}: MonthlySalesChartProps) {
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
          Ventas por mes
        </Typography>

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="month" />

            <YAxis
              tickFormatter={(value) =>
                `S/ ${value}`
              }
            />

            <Tooltip
              formatter={(value) =>
                formatCurrency(
                  Number(value),
                )
              }
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#1976d2"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}