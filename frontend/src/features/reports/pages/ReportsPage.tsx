import {
  useMemo,
  useState,
} from "react";

import {
  CalendarMonth,
  MonetizationOn,
  Percent,
  PriceCheck,
  TrendingUp,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import {
  PageHeader,
} from "@/components/common/PageHeader";

import {
  DashboardLayout,
} from "@/layouts/DashboardLayout";

import type {
  Opportunity,
} from "@/features/opportunities";

import {
  ExportMenu,
} from "../components/ExportMenu";

import {
  MonthlySalesChart,
} from "../components/MonthlySalesChart";

import {
  PipelineValueChart,
} from "../components/PipelineValueChart";

import {
  ReportFilterBar,
  type ReportPeriod,
} from "../components/ReportFilterBar";

import {
  ReportStatCard,
} from "../components/ReportStatCard";

import {
  TopCustomersTable,
} from "../components/TopCustomersTable";

import {
  exportToCSV,
} from "../export/exportCSV";

import {
  useReports,
} from "../hooks/useReports";


function formatCurrency(
  value: number,
) {
  return value.toLocaleString(
    "es-PE",
    {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  );
}


function getStageLabel(
  stage: string,
) {
  const labels:
    Record<string, string> = {
      prospect: "Prospecto",
      contacted: "Contactado",
      proposal: "Propuesta",
      negotiation: "Negociación",
      won: "Ganada",
      lost: "Perdida",
    };

  return (
    labels[stage] ??
    stage
  );
}


function getStatusLabel(
  status: string,
) {
  const labels:
    Record<string, string> = {
      pending: "Pendiente",
      completed: "Completada",
      cancelled: "Cancelada",
    };

  return (
    labels[status] ??
    status
  );
}


function getActivityTypeLabel(
  activityType: string,
) {
  const labels:
    Record<string, string> = {
      call: "Llamada",
      meeting: "Reunión",
      task: "Tarea",
      email: "Correo",
    };

  return (
    labels[activityType] ??
    activityType
  );
}


function formatDate(
  dateValue: string,
) {
  const date =
    new Date(dateValue);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat(
    "es-PE",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}


export function ReportsPage() {
  const [
    period,
    setPeriod,
  ] =
    useState<ReportPeriod>(
      "30d",
    );

  const {
    data,
    metrics,
    loading,
    error,
    reload,
  } =
    useReports();


  const monthlySales =
    useMemo(
      () => [
        {
          month: "Ene",
          value: 12000,
        },
        {
          month: "Feb",
          value: 18000,
        },
        {
          month: "Mar",
          value: 15000,
        },
        {
          month: "Abr",
          value: 23000,
        },
        {
          month: "May",
          value: 26000,
        },
        {
          month: "Jun",
          value: 32000,
        },
        {
          month: "Jul",
          value: 29000,
        },
        {
          month: "Ago",
          value: 36000,
        },
        {
          month: "Sep",
          value: 42000,
        },
        {
          month: "Oct",
          value: 39000,
        },
        {
          month: "Nov",
          value: 47000,
        },
        {
          month: "Dic",
          value: 52000,
        },
      ],
      [],
    );


  const pipelineValues =
    useMemo(
      () => {
        if (!data) {
          return [];
        }

        return [
          {
            stage:
              "Prospecto",

            value:
              data.pipeline.prospect.reduce(
                (
                  total,
                  opportunity,
                ) =>
                  total +
                  Number(
                    opportunity.value,
                  ),
                0,
              ),
          },

          {
            stage:
              "Contactado",

            value:
              data.pipeline.contacted.reduce(
                (
                  total,
                  opportunity,
                ) =>
                  total +
                  Number(
                    opportunity.value,
                  ),
                0,
              ),
          },

          {
            stage:
              "Propuesta",

            value:
              data.pipeline.proposal.reduce(
                (
                  total,
                  opportunity,
                ) =>
                  total +
                  Number(
                    opportunity.value,
                  ),
                0,
              ),
          },

          {
            stage:
              "Negociación",

            value:
              data.pipeline.negotiation.reduce(
                (
                  total,
                  opportunity,
                ) =>
                  total +
                  Number(
                    opportunity.value,
                  ),
                0,
              ),
          },

          {
            stage:
              "Ganada",

            value:
              data.pipeline.won.reduce(
                (
                  total,
                  opportunity,
                ) =>
                  total +
                  Number(
                    opportunity.value,
                  ),
                0,
              ),
          },

          {
            stage:
              "Perdida",

            value:
              data.pipeline.lost.reduce(
                (
                  total,
                  opportunity,
                ) =>
                  total +
                  Number(
                    opportunity.value,
                  ),
                0,
              ),
          },
        ];
      },
      [data],
    );


  const customerNameById =
    useMemo(
      () => {
        const names =
          new Map<
            number,
            string
          >();

        data?.customers.forEach(
          (customer) => {
            names.set(
              customer.id,
              customer.company_name,
            );
          },
        );

        return names;
      },
      [data],
    );


  const reportStats = [
    {
      title:
        "Ventas ganadas",

      value:
        formatCurrency(
          metrics
            ?.wonSalesValue ??
            0,
        ),

      description:
        `${
          metrics
            ?.wonOpportunities ??
          0
        } oportunidades ganadas`,

      icon:
        <PriceCheck />,

      color:
        "success.main",
    },

    {
      title:
        "Pipeline abierto",

      value:
        formatCurrency(
          metrics
            ?.openPipelineValue ??
            0,
        ),

      description:
        `${
          metrics
            ?.openOpportunities ??
          0
        } oportunidades activas`,

      icon:
        <TrendingUp />,

      color:
        "primary.main",
    },

    {
      title:
        "Conversión",

      value:
        `${(
          metrics
            ?.conversionRate ??
          0
        ).toLocaleString(
          "es-PE",
          {
            minimumFractionDigits:
              1,

            maximumFractionDigits:
              1,
          },
        )}%`,

      description:
        `${
          metrics
            ?.wonOpportunities ??
          0
        } ganadas y ${
          metrics
            ?.lostOpportunities ??
          0
        } perdidas`,

      icon:
        <Percent />,

      color:
        "info.main",
    },

    {
      title:
        "Ticket promedio",

      value:
        formatCurrency(
          metrics
            ?.averageTicket ??
            0,
        ),

      description:
        "Promedio de las oportunidades ganadas",

      icon:
        <MonetizationOn />,

      color:
        "secondary.main",
    },

    {
      title:
        "Actividades pendientes",

      value:
        metrics
          ?.pendingActivities ??
        0,

      description:
        "Actividades que requieren atención",

      icon:
        <CalendarMonth />,

      color:
        "warning.main",
    },
  ];


  async function handleExportExcel() {
    if (!data) {
      return;
    }

    const {
      exportToExcel,
    } =
      await import(
        "../export/exportExcel"
      );

    exportToExcel({
      fileName:
        `TitanCRM-Reportes-${period}`,

      sheets: [
        {
          name:
            "Clientes",

          rows:
            data.customers.map(
              (customer) => ({
                ID:
                  customer.id,

                Empresa:
                  customer.company_name,

                Contacto:
                  customer.contact_name,

                Correo:
                  customer.email ??
                  "",

                Teléfono:
                  customer.phone ??
                  "",
              }),
            ),
        },

        {
          name:
            "Oportunidades",

          rows:
            data.opportunities.map(
              (
                opportunity,
              ) => ({
                ID:
                  opportunity.id,

                Oportunidad:
                  opportunity.title,

                Cliente:
                  customerNameById.get(
                    opportunity.customer_id,
                  ) ??
                  "Cliente no encontrado",

                Etapa:
                  getStageLabel(
                    opportunity.stage,
                  ),

                Valor:
                  Number(
                    opportunity.value,
                  ),
              }),
            ),
        },

        {
          name:
            "Actividades",

          rows:
            data.activities.map(
              (activity) => ({
                ID:
                  activity.id,

                Título:
                  activity.title,

                Tipo:
                  getActivityTypeLabel(
                    activity.activity_type,
                  ),

                Estado:
                  getStatusLabel(
                    activity.status,
                  ),

                Cliente:
                  customerNameById.get(
                    activity.customer_id,
                  ) ??
                  "Cliente no encontrado",

                Fecha:
                  formatDate(
                    activity.scheduled_at,
                  ),

                Descripción:
                  activity.description ??
                  "",
              }),
            ),
        },

        {
          name:
            "Top Clientes",

          rows:
            (
              metrics
                ?.topCustomers ??
              []
            ).map(
              (
                customer,
                index,
              ) => ({
                Posición:
                  index + 1,

                Empresa:
                  customer.company,

                Valor:
                  customer.totalValue,
              }),
            ),
        },
      ],
    });
  }


  async function handleExportPDF() {
    if (!data) {
      return;
    }

    const {
      exportToPDF,
    } =
      await import(
        "../export/exportPDF"
      );

    exportToPDF<Opportunity>({
      title:
        "TitanCRM - Reporte de oportunidades",

      fileName:
        `TitanCRM-Oportunidades-${period}`,

      rows:
        data.opportunities,

      columns: [
        {
          header: "ID",

          value: (
            opportunity,
          ) =>
            opportunity.id,
        },

        {
          header:
            "Oportunidad",

          value: (
            opportunity,
          ) =>
            opportunity.title,
        },

        {
          header:
            "Cliente",

          value: (
            opportunity,
          ) =>
            customerNameById.get(
              opportunity.customer_id,
            ) ??
            "Cliente no encontrado",
        },

        {
          header:
            "Etapa",

          value: (
            opportunity,
          ) =>
            getStageLabel(
              opportunity.stage,
            ),
        },

        {
          header:
            "Valor",

          value: (
            opportunity,
          ) =>
            formatCurrency(
              Number(
                opportunity.value,
              ),
            ),
        },
      ],
    });
  }


  function handleExportCSV() {
    if (!data) {
      return;
    }

    exportToCSV<Opportunity>({
      fileName:
        `TitanCRM-Oportunidades-${period}`,

      rows:
        data.opportunities,

      columns: [
        {
          header: "ID",

          value: (
            opportunity,
          ) =>
            opportunity.id,
        },

        {
          header:
            "Oportunidad",

          value: (
            opportunity,
          ) =>
            opportunity.title,
        },

        {
          header:
            "Cliente",

          value: (
            opportunity,
          ) =>
            customerNameById.get(
              opportunity.customer_id,
            ) ??
            "Cliente no encontrado",
        },

        {
          header:
            "Etapa",

          value: (
            opportunity,
          ) =>
            getStageLabel(
              opportunity.stage,
            ),
        },

        {
          header:
            "Valor",

          value: (
            opportunity,
          ) =>
            Number(
              opportunity.value,
            ),
        },
      ],
    });
  }


  if (loading) {
    return (
      <DashboardLayout
        title="Reportes"
      >
        <Box
          sx={{
            display:
              "flex",

            justifyContent:
              "center",

            py: 10,
          }}
        >
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout
      title="Reportes"
    >
      <PageHeader
        title="Reportes"

        description="Analiza y exporta la información comercial de TitanCRM."

        action={
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            sx={{
              gap: 1,

              width: {
                xs: "100%",
                sm: "auto",
              },
            }}
          >
            <Button
              variant="outlined"
              onClick={() =>
                void reload()
              }
            >
              Actualizar
            </Button>

            <ExportMenu
              onExportExcel={() =>
                void handleExportExcel()
              }

              onExportPDF={() =>
                void handleExportPDF()
              }

              onExportCSV={
                handleExportCSV
              }

              disabled={
                !data
              }
            />
          </Stack>
        }
      />

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
          }}
        >
          {error}
        </Alert>
      )}

      <ReportFilterBar
        period={period}
        onPeriodChange={
          setPeriod
        }
      />

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs:
              "minmax(0, 1fr)",

            sm:
              "repeat(2, minmax(0, 1fr))",

            lg:
              "repeat(3, minmax(0, 1fr))",

            xl:
              "repeat(5, minmax(0, 1fr))",
          },

          gap: 2.5,

          mb: 3,
        }}
      >
        {reportStats.map(
          (stat) => (
            <ReportStatCard
              key={
                stat.title
              }

              title={
                stat.title
              }

              value={
                stat.value
              }

              description={
                stat.description
              }

              icon={
                stat.icon
              }

              color={
                stat.color
              }
            />
          ),
        )}
      </Box>

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs:
              "minmax(0, 1fr)",

            xl:
              "repeat(2, minmax(0, 1fr))",
          },

          gap: 3,

          mb: 3,
        }}
      >
        <MonthlySalesChart
          data={
            monthlySales
          }
        />

        <PipelineValueChart
          data={
            pipelineValues
          }
        />
      </Box>

      <TopCustomersTable
        customers={
          metrics
            ?.topCustomers ??
          []
        }
      />

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display:
            "block",

          mt: 3,
        }}
      >
        Período seleccionado:{" "}
        {period}
      </Typography>
    </DashboardLayout>
  );
}