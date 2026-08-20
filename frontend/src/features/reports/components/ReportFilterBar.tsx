import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";

export type ReportPeriod =
  | "7d"
  | "30d"
  | "90d"
  | "year";

interface ReportFilterBarProps {
  period: ReportPeriod;
  onPeriodChange: (period: ReportPeriod) => void;
}

export function ReportFilterBar({
  period,
  onPeriodChange,
}: ReportFilterBarProps) {
  return (
    <Stack
      direction="row"
      sx={{
        mb: 3,
        justifyContent: "flex-end",
      }}
    >
      <FormControl
        size="small"
        sx={{
          minWidth: {
            xs: "100%",
            sm: 180,
          },
        }}
      >
        <InputLabel>
          Período
        </InputLabel>

        <Select
          value={period}
          label="Período"
          onChange={(event) =>
            onPeriodChange(
              event.target.value as ReportPeriod,
            )
          }
        >
          <MenuItem value="7d">
            Últimos 7 días
          </MenuItem>

          <MenuItem value="30d">
            Últimos 30 días
          </MenuItem>

          <MenuItem value="90d">
            Últimos 90 días
          </MenuItem>

          <MenuItem value="year">
            Todo el año
          </MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}