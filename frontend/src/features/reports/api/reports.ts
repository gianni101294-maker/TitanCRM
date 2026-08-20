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


export interface ReportsResponse {
  customers: Customer[];

  opportunities: Opportunity[];

  activities: Activity[];

  pipeline: PipelineResponse;

  monthlySales: MonthlySalesResponse;
}

export async function getMonthlySales(
  year: number,
): Promise<MonthlySalesResponse> {
  const response =
    await client.get<MonthlySalesResponse>(
      "/reports/monthly-sales",
      {
        params: {
          year,
        },
      },
    );

  return response.data;
}


export async function getReports(): Promise<ReportsResponse> {
  const [
    customers,
    opportunities,
    activities,
    pipeline,
    monthlySales,
  ] = await Promise.all([
    getCustomers(),
    getOpportunities(),
    getActivities(),
    getPipeline(),
    getMonthlySales(
      new Date().getFullYear(),
    ),
  ]);

  return {
    customers,
    opportunities,
    activities,
    pipeline,
    monthlySales,
  };
}