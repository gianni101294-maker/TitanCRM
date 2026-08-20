import type {
  Activity,
} from "@/features/activities";

import type {
  Customer,
} from "@/features/customers";

import type {
  Opportunity,
} from "@/features/opportunities";

export type SearchResultType =
  | "customer"
  | "opportunity"
  | "activity";

export interface SearchResultItem {
  id: number;

  title: string;

  subtitle: string;

  type: SearchResultType;

  route: string;
}

function normalizeSearchValue(
  value: string,
) {
  return value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .trim();
}

function includesSearch(
  value:
    | string
    | null
    | undefined,
  query: string,
) {
  if (!value) {
    return false;
  }

  return normalizeSearchValue(
    value,
  ).includes(
    normalizeSearchValue(
      query,
    ),
  );
}

export function searchCustomers(
  customers: Customer[],
  query: string,
): SearchResultItem[] {
  const normalizedQuery =
    normalizeSearchValue(
      query,
    );

  if (!normalizedQuery) {
    return [];
  }

  return customers
    .filter(
      (customer) =>
        includesSearch(
          customer.company_name,
          normalizedQuery,
        ) ||
        includesSearch(
          customer.contact_name,
          normalizedQuery,
        ) ||
        includesSearch(
          customer.email,
          normalizedQuery,
        ) ||
        includesSearch(
          customer.phone,
          normalizedQuery,
        ),
    )
    .map(
      (
        customer,
      ): SearchResultItem => ({
        id: customer.id,

        title:
          customer.company_name,

        subtitle:
          customer.contact_name,

        type: "customer",

        route:
          `/customers?selected=${customer.id}`,
      }),
    );
}

export function searchOpportunities(
  opportunities: Opportunity[],
  customers: Customer[],
  query: string,
): SearchResultItem[] {
  const normalizedQuery =
    normalizeSearchValue(
      query,
    );

  if (!normalizedQuery) {
    return [];
  }

  return opportunities
    .filter((opportunity) => {
      const customer =
        customers.find(
          (item) =>
            item.id ===
            opportunity.customer_id,
        );

      return (
        includesSearch(
          opportunity.title,
          normalizedQuery,
        ) ||
        includesSearch(
          opportunity.stage,
          normalizedQuery,
        ) ||
        includesSearch(
          opportunity.priority,
          normalizedQuery,
        ) ||
        includesSearch(
          customer?.company_name,
          normalizedQuery,
        ) ||
        includesSearch(
          customer?.contact_name,
          normalizedQuery,
        )
      );
    })
    .map(
      (
        opportunity,
      ): SearchResultItem => {
        const customer =
          customers.find(
            (item) =>
              item.id ===
              opportunity.customer_id,
          );

        return {
          id: opportunity.id,

          title:
            opportunity.title,

          subtitle:
            customer?.company_name ??
            "Oportunidad comercial",

          type: "opportunity",

          route:
            `/opportunities?selected=${opportunity.id}`,
        };
      },
    );
}

export function searchActivities(
  activities: Activity[],
  query: string,
): SearchResultItem[] {
  const normalizedQuery =
    normalizeSearchValue(
      query,
    );

  if (!normalizedQuery) {
    return [];
  }

  return activities
    .filter(
      (activity) =>
        includesSearch(
          activity.title,
          normalizedQuery,
        ) ||
        includesSearch(
          activity.activity_type,
          normalizedQuery,
        ) ||
        includesSearch(
          activity.description,
          normalizedQuery,
        ) ||
        includesSearch(
          activity.status,
          normalizedQuery,
        ),
    )
    .map(
      (
        activity,
      ): SearchResultItem => ({
        id: activity.id,

        title:
          activity.title,

        subtitle:
          activity.description ||
          "Actividad comercial",

        type: "activity",

        route:
          `/activities?selected=${activity.id}`,
      }),
    );
}