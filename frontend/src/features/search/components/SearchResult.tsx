import {
  CalendarMonth,
  Groups,
  Work,
} from "@mui/icons-material";

import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import type {
  SearchResultItem,
} from "../utils/search";

interface SearchResultProps {
  result:
    SearchResultItem;

  onSelect: (
    route: string,
  ) => void;
}

function getIcon(
  type:
    SearchResultItem["type"],
) {
  switch (type) {
    case "customer":
      return (
        <Groups
          color="primary"
        />
      );

    case "opportunity":
      return (
        <Work
          color="success"
        />
      );

    case "activity":
      return (
        <CalendarMonth
          color="warning"
        />
      );
  }
}

export function SearchResult({
  result,
  onSelect,
}: SearchResultProps) {
  return (
    <ListItemButton
      onClick={() =>
        onSelect(
          result.route,
        )
      }
      sx={{
        borderRadius: 2,
        py: 1.25,
      }}
    >
      <ListItemIcon>
        {getIcon(
          result.type,
        )}
      </ListItemIcon>

      <ListItemText
        primary={
          result.title
        }
        secondary={
          <Box
            component="span"
            sx={{
              color:
                "text.secondary",
            }}
          >
            {
              result.subtitle
            }
          </Box>
        }
      />
    </ListItemButton>
  );
}