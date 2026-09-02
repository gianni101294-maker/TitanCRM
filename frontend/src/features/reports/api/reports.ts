import client from "@/api/client";

import {
  getActivities,
  type Activity,
} from "@/features/activities";

import {
  getPipeline,
  type PipelineResponse,
} from "@/features/pipeline";

import {
  getCustomers,
  type Customer,
} from "@/features/customers";

import {
  getOpportunities,
  type Opportunity,
} from "@/features/opportunities";

export interface MonthlySalesItem {
  month: string;
  value: number;
}

export interface MonthlySalesResponse {
  year: number;
  months: MonthlySalesItem[];
}

export interface ClosedOpportunitiesResponse {
  won: Opportunity[];
  lost: Opportunity[];
}


export type ReportsPeriod =
  | "7d"
  | "30d"
  | "90d"
  | "year";


function getPeriodStartDate(
  period: ReportsPeriod,
): Date {
  const now = new Date();

  if (period === "year") {
    return new Date(
      now.getFullYear(),
      0,
      1,
    );
  }

  const daysByPeriod: Record<
    Exclude<ReportsPeriod, "year">,
    number
  > = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
  };

  const startDate = new Date(now);

  startDate.setDate(
    startDate.getDate() -
      daysByPeriod[period],
  );

  return startDate;
}


export interface ReportsResponse {
  customers: Customer[];

  opportunities: Opportunity[];

  activities: Activity[];

  pipeline: PipelineResponse;

  monthlySales: MonthlySalesResponse;

  closedOpportunities: ClosedOpportunitiesResponse;
}

export async function getClosedOpportunities(
  period: ReportsPeriod,
): Promise<ClosedOpportunitiesResponse> {
  const response =
    await client.get<ClosedOpportunitiesResponse>(
      "/reports/closed-opportunities",
      {
        params: {
          period,
        },
      },
    );

  return response.data;
}


export async function getMonthlySales(
  year: number,
  period: ReportsPeriod,
): Promise<MonthlySalesResponse> {
  const response =
    await client.get<MonthlySalesResponse>(
      "/reports/monthly-sales",
      {
        params: {
          year,
          period,
        },
      },
    );

  return response.data;
}


export async function getReports(
  period: ReportsPeriod,
): Promise<ReportsResponse> {
  const [
    customers,
    opportunities,
    activities,
    pipeline,
    monthlySales,
    closedOpportunities,
  ] = await Promise.all([
    getCustomers(),
    getOpportunities(),
    getActivities(),
    getPipeline(),
    getMonthlySales(
      new Date().getFullYear(),
      period,
    ),
    getClosedOpportunities(
      period,
    ),
  ]);

  const startDate =
    getPeriodStartDate(period);

  const filteredOpportunities =
    opportunities.filter(
      (opportunity) => {
        const createdAt =
          new Date(
            opportunity.created_at,
          );

        return (
          !Number.isNaN(
            createdAt.getTime(),
          ) &&
          createdAt >= startDate
        );
      },
    );

  const filteredActivities =
    activities.filter(
      (activity) => {
        const scheduledAt =
          new Date(
            activity.scheduled_at,
          );

        return (
          !Number.isNaN(
            scheduledAt.getTime(),
          ) &&
          scheduledAt >= startDate
        );
      },
    );

  const filterPipelineStage = <
    T extends Opportunity
  >(
    rows: T[],
  ) =>
    rows.filter((opportunity) => {
      const createdAt =
        new Date(
          opportunity.created_at,
        );

      return (
        !Number.isNaN(
          createdAt.getTime(),
        ) &&
        createdAt >= startDate
      );
    });

  const filteredPipeline: PipelineResponse = {
    prospect:
      filterPipelineStage(
        pipeline.prospect,
      ),

    contacted:
      filterPipelineStage(
        pipeline.contacted,
      ),

    proposal:
      filterPipelineStage(
        pipeline.proposal,
      ),

    negotiation:
      filterPipelineStage(
        pipeline.negotiation,
      ),

    won:
      filterPipelineStage(
        pipeline.won,
      ),

    lost:
      filterPipelineStage(
        pipeline.lost,
      ),
  };

  return {
    customers,
    opportunities:
      filteredOpportunities,

    activities:
      filteredActivities,

    pipeline:
      filteredPipeline,

    monthlySales,

    closedOpportunities,
  };
}