import client from "../../../api/client";

export type OpportunityStage =
  | "prospect"
  | "contacted"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

export type OpportunityPriority =
  | "low"
  | "medium"
  | "high";

export interface Opportunity {
  id: number;

  title: string;

  value: number | string;

  stage: OpportunityStage;

  priority: OpportunityPriority;

  probability: number;

  expected_close_date: string | null;

  notes: string | null;

  assigned_user_id: number | null;

  customer_id: number;

  created_at: string;
}


export interface OpportunityEvent {
  id: number;
  opportunity_id: number;
  event_type: string;
  title: string;
  description: string | null;
  user_id: number | null;
  created_at: string;
}

export interface OpportunityCreate {
  title: string;

  value: number;

  stage: OpportunityStage;

  priority: OpportunityPriority;

  probability: number;

  expected_close_date: string | null;

  notes: string | null;

  assigned_user_id: number | null;

  customer_id: number;
}

export interface OpportunityUpdate {
  title: string;

  value: number;

  stage: OpportunityStage;

  priority: OpportunityPriority;

  probability: number;

  expected_close_date: string | null;

  notes: string | null;

  assigned_user_id: number | null;

  customer_id: number;
}

export async function getOpportunities():
Promise<Opportunity[]> {
  const response =
    await client.get<Opportunity[]>(
      "/opportunities",
    );

  return response.data;
}

export async function createOpportunity(
  opportunity: OpportunityCreate,
): Promise<Opportunity> {
  const response =
    await client.post<Opportunity>(
      "/opportunities",
      opportunity,
    );

  return response.data;
}

export async function updateOpportunity(
  opportunityId: number,
  opportunity: OpportunityUpdate,
): Promise<Opportunity> {
  const response =
    await client.put<Opportunity>(
      `/opportunities/${opportunityId}`,
      opportunity,
    );

  return response.data;
}

export async function deleteOpportunity(
  opportunityId: number,
): Promise<void> {
  await client.delete(
    `/opportunities/${opportunityId}`,
  );
}

export async function getOpportunityEvents(
  opportunityId: number,
): Promise<OpportunityEvent[]> {
  const response =
    await client.get<OpportunityEvent[]>(
      `/opportunities/${opportunityId}/events`,
    );

  return response.data;
}

