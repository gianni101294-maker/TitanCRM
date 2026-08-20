import {
  Divider,
  List,
  Typography,
} from "@mui/material";

import type {
  SearchResultItem,
} from "../utils/search";

import {
  SearchResult,
} from "./SearchResult";

interface SearchCategoryProps {
  title: string;

  results:
    SearchResultItem[];

  onSelect: (
    route: string,
  ) => void;
}

export function SearchCategory({
  title,
  results,
  onSelect,
}: SearchCategoryProps) {
  if (
    results.length === 0
  ) {
    return null;
  }

  return (
    <>
      <Typography
        variant="overline"
        sx={{
          px: 2,
          pt: 1,
          display: "block",
          fontWeight: 700,
          color:
            "text.secondary",
        }}
      >
        {title}
      </Typography>

      <List
        disablePadding
        sx={{
          mb: 1,
        }}
      >
        {results.map(
          (result) => (
            <SearchResult
              key={
                `${result.type}-${result.id}`
              }
              result={
                result
              }
              onSelect={
                onSelect
              }
            />
          ),
        )}
      </List>

      <Divider />
    </>
  );
}