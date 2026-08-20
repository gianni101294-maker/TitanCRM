import type { ReactNode } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

interface DashboardStatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  color?: string;
}

export function DashboardStatsCard({
  title,
  value,
  description,
  icon,
  color = "primary.main",
}: DashboardStatsCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderRadius: 3,
        transition:
          "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: 3,
          borderColor: color,
        },
      }}
    >
      <CardContent
        sx={{
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
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mt: 0.75,
                fontWeight: 900,
                lineHeight: 1.2,
                overflowWrap: "anywhere",
              }}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 48,
              height: 48,
              flexShrink: 0,
              borderRadius: 2.5,
              bgcolor: color,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "& svg": {
                fontSize: 27,
              },
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}