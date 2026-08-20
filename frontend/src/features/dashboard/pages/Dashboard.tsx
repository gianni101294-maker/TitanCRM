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
import { DashboardLayout } from "@/layouts/DashboardLayout";

function formatCurrency(value: number | string) {
  return Number(value).toLocaleString("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function Dashboard() {
  const {
    data,
    pipeline,
    activities,
    loading,
    error,
    reload,
  } = useDashboard();

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

  const won = pipeline.won.length;
  const lost = pipeline.lost.length;
  const closed = won + lost;

  const conversion =
    closed > 0 ? (won / closed) * 100 : 0;

  const pendingActivities = activities.filter(
    (activity) => activity.status === "pending",
  ).length;

  const stats = [
    {
      title: "Clientes",
      value: data?.total_customers ?? 0,
      description: "Clientes registrados",
      icon: <Groups />,
      color: "primary.main",
    },
    {
      title: "Oportunidades",
      value: data?.total_opportunities ?? 0,
      description: "Negocios activos",
      icon: <Work />,
      color: "secondary.main",
    },
    {
      title: "Pipeline",
      value: formatCurrency(
        data?.total_pipeline_value ?? 0,
      ),
      description: "Valor comercial",
      icon: <MonetizationOn />,
      color: "success.main",
    },
    {
      title: "Pendientes",
      value:
        data?.pending_activities ??
        pendingActivities,
      description: "Actividades abiertas",
      icon: <CalendarMonth />,
      color: "warning.main",
    },
    {
      title: "Conversión",
      value: `${conversion.toFixed(1)}%`,
      description: "Oportunidades ganadas",
      icon: <Percent />,
      color: "info.main",
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
        <PipelineChart pipeline={pipeline} />

        <ActivityChart
          activities={activities}
        />
      </Box>

      <RecentActivity
        activities={activities}
      />
    </DashboardLayout>
  );
}