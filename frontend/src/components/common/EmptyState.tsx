import { Box, Button, Typography } from "@mui/material";
import { InboxOutlined } from "@mui/icons-material";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon = <InboxOutlined sx={{ fontSize: 72 }} />,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          color: "text.secondary",
          opacity: 0.7,
          mb: 2,
        }}
      >
        {icon}
      </Box>

      <Typography
        variant="h6"
        sx={{ fontWeight: 700 }}
      >
        {title}
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          mt: 1,
          maxWidth: 420,
        }}
      >
        {description}
      </Typography>

      {actionLabel && onAction && (
        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}