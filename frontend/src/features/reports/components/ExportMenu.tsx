import {
  useState,
  type MouseEvent,
} from "react";
import {
  Download,
  PictureAsPdf,
  TableChart,
  TextSnippet,
} from "@mui/icons-material";
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";

interface ExportMenuProps {
  onExportExcel: () => void;
  onExportPDF: () => void;
  onExportCSV: () => void;
  disabled?: boolean;
}

export function ExportMenu({
  onExportExcel,
  onExportPDF,
  onExportCSV,
  disabled = false,
}: ExportMenuProps) {
  const [anchorElement, setAnchorElement] =
    useState<HTMLElement | null>(null);

  const isOpen = Boolean(anchorElement);

  function openMenu(
    event: MouseEvent<HTMLButtonElement>,
  ) {
    setAnchorElement(event.currentTarget);
  }

  function closeMenu() {
    setAnchorElement(null);
  }

  function handleExport(
    exportAction: () => void,
  ) {
    closeMenu();
    exportAction();
  }

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Download />}
        onClick={openMenu}
        disabled={disabled}
        aria-controls={
          isOpen
            ? "reports-export-menu"
            : undefined
        }
        aria-haspopup="true"
        aria-expanded={
          isOpen ? "true" : undefined
        }
      >
        Exportar
      </Button>

      <Menu
        id="reports-export-menu"
        anchorEl={anchorElement}
        open={isOpen}
        onClose={closeMenu}
        slotProps={{
          paper: {
            sx: {
              minWidth: 210,
              mt: 1,
              borderRadius: 2,
            },
          },
        }}
      >
        <MenuItem
          onClick={() =>
            handleExport(onExportExcel)
          }
        >
          <ListItemIcon>
            <TableChart color="success" />
          </ListItemIcon>

          <ListItemText
            primary="Exportar a Excel"
            secondary="Archivo .xlsx"
          />
        </MenuItem>

        <MenuItem
          onClick={() =>
            handleExport(onExportPDF)
          }
        >
          <ListItemIcon>
            <PictureAsPdf color="error" />
          </ListItemIcon>

          <ListItemText
            primary="Exportar a PDF"
            secondary="Documento .pdf"
          />
        </MenuItem>

        <MenuItem
          onClick={() =>
            handleExport(onExportCSV)
          }
        >
          <ListItemIcon>
            <TextSnippet color="primary" />
          </ListItemIcon>

          <ListItemText
            primary="Exportar a CSV"
            secondary="Archivo .csv"
          />
        </MenuItem>
      </Menu>
    </>
  );
}