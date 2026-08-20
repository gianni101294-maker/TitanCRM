import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getReports,
  type ReportsResponse,
} from "../api/reports";

export function useReports() {
  const [data, setData] =
    useState<ReportsResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const reportData = await getReports();
      setData(reportData);
    } catch {
      setError(
        "No se pudieron cargar los reportes.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialReports() {
      try {
        const reportData = await getReports();

        if (isMounted) {
          setData(reportData);
          setError("");
        }
      } catch {
        if (isMounted) {
          setError(
            "No se pudieron cargar los reportes.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadInitialReports();

    return () => {
      isMounted = false;
    };
  }, []);

  const metrics = useMemo(() => {
    if (!data) {
      return null;
    }

    const openOpportunities = [
      ...data.pipeline.prospect,
      ...data.pipeline.contacted,
      ...data.pipeline.proposal,
      ...data.pipeline.negotiation,
    ];

    const wonOpportunities = data.pipeline.won;
    const lostOpportunities = data.pipeline.lost;

    const closedOpportunities =
      wonOpportunities.length +
      lostOpportunities.length;

    const wonSalesValue = wonOpportunities.reduce(
      (total, opportunity) =>
        total + Number(opportunity.value),
      0,
    );

    const openPipelineValue =
      openOpportunities.reduce(
        (total, opportunity) =>
          total + Number(opportunity.value),
        0,
      );

    const averageTicket =
      wonOpportunities.length > 0
        ? wonSalesValue /
          wonOpportunities.length
        : 0;

    const conversionRate =
      closedOpportunities > 0
        ? (wonOpportunities.length /
            closedOpportunities) *
          100
        : 0;

    const pendingActivities =
      data.activities.filter(
        (activity) =>
          activity.status === "pending",
      ).length;

    const pipelineStages = [
      {
        name: "Prospectos",
        value: data.pipeline.prospect.length,
      },
      {
        name: "Contactados",
        value: data.pipeline.contacted.length,
      },
      {
        name: "Propuesta",
        value: data.pipeline.proposal.length,
      },
      {
        name: "Negociación",
        value:
          data.pipeline.negotiation.length,
      },
      {
        name: "Ganadas",
        value: data.pipeline.won.length,
      },
      {
        name: "Perdidas",
        value: data.pipeline.lost.length,
      },
    ];

    const activitySummary = {
      pending: pendingActivities,

      completed: data.activities.filter(
        (activity) =>
          activity.status === "completed",
      ).length,

      cancelled: data.activities.filter(
        (activity) =>
          activity.status === "cancelled",
      ).length,
    };

    const topCustomers = data.customers
      .map((customer) => {
        const totalValue =
          data.opportunities
            .filter(
              (opportunity) =>
                opportunity.customer_id ===
                customer.id,
            )
            .reduce(
              (sum, opportunity) =>
                sum +
                Number(opportunity.value),
              0,
            );

        return {
          id: customer.id,
          company: customer.company_name,
          totalValue,
        };
      })
      .sort(
        (first, second) =>
          second.totalValue -
          first.totalValue,
      )
      .slice(0, 5);

    return {
      totalCustomers: data.customers.length,
      totalOpportunities:
        data.opportunities.length,
      wonSalesValue,
      openPipelineValue,
      averageTicket,
      conversionRate,
      pendingActivities,

      wonOpportunities:
        wonOpportunities.length,
      lostOpportunities:
        lostOpportunities.length,
      openOpportunities:
        openOpportunities.length,

      pipelineStages,
      activitySummary,
      topCustomers,
    };
  }, [data]);

  return {
    data,
    metrics,
    loading,
    error,
    reload,
  };
}