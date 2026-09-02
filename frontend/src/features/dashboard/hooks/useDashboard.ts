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
  type DashboardPeriod,
  type DashboardResponse,
} from "../api/dashboard";

export function useDashboard(
  period: DashboardPeriod,
) {
  const [data, setData] =
    useState<DashboardResponse | null>(null);

  const [activities, setActivities] = useState<
    Activity[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData =
    useCallback(async () => {
      const [
        dashboardData,
        activityData,
      ] = await Promise.all([
        getDashboard(period),
        getActivities(),
      ]);

      return {
        dashboardData,
        activityData,
      };
    }, [period]);

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        dashboardData,
        activityData,
      } = await loadDashboardData();

      setData(dashboardData);
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
      setLoading(true);

      try {
        const {
          dashboardData,
          activityData,
        } = await loadDashboardData();

        if (isMounted) {
          setData(dashboardData);
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
    activities,
    loading,
    error,
    reload,
  };
}
