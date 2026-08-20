import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

interface LoadingPageProps {
  message?: string;
  minHeight?: number | string;
}

export function LoadingPage({
  message = "Cargando información...",
  minHeight = 280,
}: LoadingPageProps) {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        minHeight,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        px: 2,
        textAlign: "center",
      }}
    >
      <CircularProgress />

      <Typography
        variant="body2"
        color="text.secondary"
      >
        {message}
      </Typography>
    </Box>
  );
}