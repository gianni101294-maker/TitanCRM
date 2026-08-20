import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getActivities,
  type Activity,
} from "@/features/activities";
import {
  getDashboard,
  type DashboardResponse,
} from "../api/dashboard";
import {
  getPipeline,
  type PipelineResponse,
} from "@/features/pipeline";

const emptyPipeline: PipelineResponse = {
  prospect: [],
  contacted: [],
  proposal: [],
  negotiation: [],
  won: [],
  lost: [],
};

export function useDashboard() {
  const [data, setData] =
    useState<DashboardResponse | null>(null);

  const [pipeline, setPipeline] =
    useState<PipelineResponse>(emptyPipeline);

  const [activities, setActivities] = useState<
    Activity[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = useCallback(async () => {
    const [
      dashboardData,
      pipelineData,
      activityData,
    ] = await Promise.all([
      getDashboard(),
      getPipeline(),
      getActivities(),
    ]);

    return {
      dashboardData,
      pipelineData,
      activityData,
    };
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        dashboardData,
        pipelineData,
        activityData,
      } = await loadDashboardData();

      setData(dashboardData);
      setPipeline(pipelineData);
      setActivities(activityData);
    } catch {
      setError(
        "No se pudieron cargar los datos del Dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }, [loadDashboardData]);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialDashboard() {
      try {
        const {
          dashboardData,
          pipelineData,
          activityData,
        } = await loadDashboardData();

        if (isMounted) {
          setData(dashboardData);
          setPipeline(pipelineData);
          setActivities(activityData);
          setError("");
        }
      } catch {
        if (isMounted) {
          setError(
            "No se pudieron cargar los datos del Dashboard.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadInitialDashboard();

    return () => {
      isMounted = false;
    };
  }, [loadDashboardData]);

  return {
    data,
    pipeline,
    activities,
    loading,
    error,
    reload,
  };
}