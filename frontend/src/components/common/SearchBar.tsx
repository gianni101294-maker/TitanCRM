import { Search } from "@mui/icons-material";
import {
  InputAdornment,
  TextField,
} from "@mui/material";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar...",
  fullWidth = true,
}: SearchBarProps) {
  return (
    <TextField
      fullWidth={fullWidth}
      value={value}
      placeholder={placeholder}
      onChange={(event) =>
        onChange(event.target.value)
      }
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}