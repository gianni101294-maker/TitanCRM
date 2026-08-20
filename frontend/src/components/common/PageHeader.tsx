import type { ReactNode } from "react";
import {
  Box,
  Typography,
} from "@mui/material";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: {
          xs: "flex-start",
          sm: "center",
        },
        flexDirection: {
          xs: "column",
          sm: "row",
        },
        gap: 2,
        mb: 3,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 800,
            fontSize: {
              xs: "1.8rem",
              sm: "2.125rem",
            },
            lineHeight: 1.2,
            overflowWrap: "anywhere",
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5,
              maxWidth: 720,
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      {action && (
        <Box
          sx={{
            flexShrink: 0,
            width: {
              xs: "100%",
              sm: "auto",
            },
            "& > *": {
              width: {
                xs: "100%",
                sm: "auto",
              },
            },
          }}
        >
          {action}
        </Box>
      )}
    </Box>
  );
}