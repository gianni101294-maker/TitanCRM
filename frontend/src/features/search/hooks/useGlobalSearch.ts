import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getActivities,
  type Activity,
} from "@/features/activities";

import {
  getCustomers,
  type Customer,
} from "@/features/customers";

import {
  getOpportunities,
  type Opportunity,
} from "@/features/opportunities";

import {
  searchActivities,
  searchCustomers,
  searchOpportunities,
} from "../utils/search";

export function useGlobalSearch() {
  const [
    query,
    setQuery,
  ] = useState("");

  const [
    customers,
    setCustomers,
  ] = useState<Customer[]>([]);

  const [
    opportunities,
    setOpportunities,
  ] = useState<Opportunity[]>([]);

  const [
    activities,
    setActivities,
  ] = useState<Activity[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [
          customerData,
          opportunityData,
          activityData,
        ] = await Promise.all([
          getCustomers(),
          getOpportunities(),
          getActivities(),
        ]);

        if (!isMounted) {
          return;
        }

        setCustomers(
          customerData,
        );

        setOpportunities(
          opportunityData,
        );

        setActivities(
          activityData,
        );
      } finally {
        if (isMounted) {
          setLoading(
            false,
          );
        }
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const results = useMemo(
    () => {
      const value =
        query.trim();

      if (
        value.length === 0
      ) {
        return [];
      }

      return [
        ...searchCustomers(
          customers,
          value,
        ),

        ...searchOpportunities(
          opportunities,
          customers,
          value,
        ),

        ...searchActivities(
          activities,
          value,
        ),
      ];
    },
    [
      query,
      customers,
      opportunities,
      activities,
    ],
  );

  return {
    query,
    setQuery,

    results,

    loading,
  };
}