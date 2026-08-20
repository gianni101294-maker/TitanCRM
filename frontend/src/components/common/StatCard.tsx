import type { ReactNode } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  color?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  color = "primary.main",
}: StatCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        height: "100%",
        transition: "all .25s",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mt: .5,
              }}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2,
              bgcolor: color,
              color: "white",

              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}