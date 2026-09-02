import {
  useState,
} from "react";
import {
  CalendarMonth,
  Groups,
  MonetizationOn,
  Percent,
  Work,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
} from "@mui/material";

import { LoadingPage } from "@/components/common/LoadingPage";
import { PageHeader } from "@/components/common/PageHeader";
import { ActivityChart } from "../components/ActivityChart";
import { DashboardStatsCard } from "../components/DashboardStatsCard";
import { PipelineChart } from "../components/PipelineChart";
import { RecentActivity } from "../components/RecentActivity";
import { useDashboard } from "../hooks/useDashboard";
import type {
  DashboardPeriod,
} from "../api/dashboard";
import {
  ReportFilterBar,
} from "@/features/reports/components/ReportFilterBar";
import { DashboardLayout } from "@/layouts/DashboardLayout";

function formatCurrency(value: number | string) {
  return Number(value).toLocaleString("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getComparison(
  current: number,
  previous: number,
  lowerIsBetter = false,
) {
  if (current === 0 && previous === 0) {
    return {
      label:
        "Sin cambios vs. período anterior",
      direction:
        "neutral" as const,
    };
  }

  if (previous === 0 && current > 0) {
    return {
      label:
        "Nuevo vs. período anterior",
      direction:
        lowerIsBetter
          ? "down" as const
          : "up" as const,
    };
  }

  const percentage =
    ((current - previous) /
      previous) *
    100;

  if (percentage > 0) {
    return {
      label:
        `${Math.abs(percentage).toLocaleString(
          "es-PE",
          {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          },
        )}% vs. período anterior`,
      direction:
        lowerIsBetter
          ? "down" as const
          : "up" as const,
    };
  }

  if (percentage < 0) {
    return {
      label:
        `${Math.abs(percentage).toLocaleString(
          "es-PE",
          {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          },
        )}% vs. período anterior`,
      direction:
        lowerIsBetter
          ? "up" as const
          : "down" as const,
    };
  }

  return {
    label:
      "Sin cambios vs. período anterior",
    direction:
      "neutral" as const,
  };
}


export function Dashboard() {
  const [
    period,
    setPeriod,
  ] = useState<DashboardPeriod>(
    "30d",
  );

  const {
    data,
    activities,
    loading,
    error,
    reload,
  } = useDashboard(period);

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <LoadingPage
          message="Cargando Dashboard ejecutivo..."
          minHeight={420}
        />
      </DashboardLayout>
    );
  }

  const won =
    data?.opportunities_by_stage.won ?? 0;

  const lost =
    data?.opportunities_by_stage.lost ?? 0;

  const closed = won + lost;

  const conversion =
    closed > 0
      ? (won / closed) * 100
      : 0;

  const pendingActivities = activities.filter(
    (activity) => activity.status === "pending",
  ).length;

  const stats = [
    {
      title: "Clientes",
      value: data?.total_customers ?? 0,
      description: "Clientes del período",
      icon: <Groups />,
      color: "primary.main",
      comparison: data
        ? getComparison(
            data.comparison.current
              .total_customers,
            data.comparison.previous
              .total_customers,
          )
        : undefined,
    },
    {
      title: "Oportunidades",
      value: data?.total_opportunities ?? 0,
      description: "Oportunidades del período",
      icon: <Work />,
      color: "secondary.main",
      comparison: data
        ? getComparison(
            data.comparison.current
              .total_opportunities,
            data.comparison.previous
              .total_opportunities,
          )
        : undefined,
    },
    {
      title: "Pipeline",
      value: formatCurrency(
        data?.total_pipeline_value ?? 0,
      ),
      description: "Pipeline abierto del período",
      icon: <MonetizationOn />,
      color: "success.main",
    },
    {
      title: "Por atender",
      value:
        data?.pending_activities ??
        pendingActivities,
      description: "Actividades abiertas del período",
      icon: <CalendarMonth />,
      color: "warning.main",
      comparison: data
        ? getComparison(
            data.comparison.current
              .pending_activities,
            data.comparison.previous
              .pending_activities,
            true,
          )
        : undefined,
    },
    {
      title: "Conversión",
      value: `${conversion.toFixed(1)}%`,
      description: "Conversión de cierres del período",
      icon: <Percent />,
      color: "info.main",
      comparison: data
        ? getComparison(
            data.comparison.current
              .conversion_rate,
            data.comparison.previous
              .conversion_rate,
          )
        : undefined,
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <PageHeader
        title="Dashboard Ejecutivo"
        description="Resumen general de la operación comercial."
        action={
          <Button
            variant="outlined"
            onClick={() => void reload()}
          >
            Actualizar
          </Button>
        }
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 3,
        }}
      >
        <ReportFilterBar
          period={period}
          onPeriodChange={
            (newPeriod) =>
              setPeriod(
                newPeriod as DashboardPeriod,
              )
          }
        />
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2,1fr)",
            xl: "repeat(5,1fr)",
          },
          gap: 2.5,
          mb: 3,
        }}
      >
        {stats.map((stat) => (
          <DashboardStatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            color={stat.color}
            comparison={stat.comparison}
          />
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "2fr 1fr",
          },
          gap: 2.5,
          mb: 3,
        }}
      >
        <PipelineChart
          opportunitiesByStage={
            data?.opportunities_by_stage ?? {
              prospect: 0,
              contacted: 0,
              proposal: 0,
              negotiation: 0,
              won: 0,
              lost: 0,
            }
          }
        />

        <ActivityChart
          pending={
            data?.pending_activities ?? 0
          }
          overdue={
            data?.overdue_activities ?? 0
          }
          upcoming={
            data?.upcoming_activities ?? 0
          }
        />
      </Box>

      <RecentActivity
        activities={activities}
      />
    </DashboardLayout>
  );
}
