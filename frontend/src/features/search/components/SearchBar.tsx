import { Search } from "@mui/icons-material";
import {
  Button,
  Typography,
} from "@mui/material";

interface SearchBarProps {
  onClick: () => void;
}

export function SearchBar({
  onClick,
}: SearchBarProps) {
  return (
    <Button
      variant="outlined"
      startIcon={<Search />}
      onClick={onClick}
      sx={{
        minWidth: 260,
        justifyContent: "space-between",
        textTransform: "none",
        borderRadius: 2,
        px: 2,
      }}
    >
      <Typography
        color="text.secondary"
        sx={{
          flexGrow: 1,
          textAlign: "left",
        }}
      >
        Buscar...
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
      >
        ⌘ K
      </Typography>
    </Button>
  );
}