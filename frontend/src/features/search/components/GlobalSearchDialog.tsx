import {
  Dialog,
  DialogContent,
  TextField,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useGlobalSearch } from "../hooks/useGlobalSearch";
import { SearchCategory } from "./SearchCategory";

interface GlobalSearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function GlobalSearchDialog({
  open,
  onClose,
}: GlobalSearchDialogProps) {
  const navigate = useNavigate();

  const {
    query,
    setQuery,
    results,
    loading,
  } = useGlobalSearch();

  function handleSelect(route: string) {
    navigate(route);
    onClose();
    setQuery("");
  }

  const customers = results.filter(
    (item) => item.type === "customer",
  );

  const opportunities = results.filter(
    (item) => item.type === "opportunity",
  );

  const activities = results.filter(
    (item) => item.type === "activity",
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          placeholder="Buscar clientes, oportunidades o actividades..."
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
        />

        <Box sx={{ mt: 2 }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 4,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <SearchCategory
                title="Clientes"
                results={customers}
                onSelect={handleSelect}
              />

              <SearchCategory
                title="Oportunidades"
                results={opportunities}
                onSelect={handleSelect}
              />

              <SearchCategory
                title="Actividades"
                results={activities}
                onSelect={handleSelect}
              />

              {results.length === 0 &&
                query.trim() !== "" && (
                  <Typography
                    align="center"
                    color="text.secondary"
                    sx={{ py: 4 }}
                  >
                    No se encontraron resultados.
                  </Typography>
                )}
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}