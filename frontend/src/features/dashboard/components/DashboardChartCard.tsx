import type { ReactNode } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

interface DashboardChartCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  minHeight?: number | string;
}

export function DashboardChartCard({
  title,
  description,
  action,
  children,
  minHeight = 360,
}: DashboardChartCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          p: {
            xs: 2,
            sm: 2.5,
          },
          "&:last-child": {
            pb: {
              xs: 2,
              sm: 2.5,
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            mb: 2.5,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 800,
                lineHeight: 1.3,
              }}
            >
              {title}
            </Typography>

            {description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {description}
              </Typography>
            )}
          </Box>

          {action && (
            <Box sx={{ flexShrink: 0 }}>
              {action}
            </Box>
          )}
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            minHeight,
            minWidth: 0,
            position: "relative",
          }}
        >
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}