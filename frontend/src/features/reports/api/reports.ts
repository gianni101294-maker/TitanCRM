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

export interface ReportsResponse {
  customers: Customer[];

  opportunities: Opportunity[];

  activities: Activity[];

  pipeline: PipelineResponse;
}

export async function getReports(): Promise<ReportsResponse> {
  const [
    customers,
    opportunities,
    activities,
    pipeline,
  ] = await Promise.all([
    getCustomers(),
    getOpportunities(),
    getActivities(),
    getPipeline(),
  ]);

  return {
    customers,
    opportunities,
    activities,
    pipeline,
  };
}