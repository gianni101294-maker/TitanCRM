import client from "@/api/client";

import type {
  Opportunity,
  OpportunityStage,
} from "@/features/opportunities";

export type PipelineResponse = Record<
  OpportunityStage,
  Opportunity[]
>;

function getAuthHeaders() {
  const token = localStorage.getItem(
    "titancrm_access_token",
  );

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getPipeline(): Promise<PipelineResponse> {
  const response =
    await client.get<PipelineResponse>(
      "/pipeline",
      {
        headers: getAuthHeaders(),
      },
    );

  return response.data;
}