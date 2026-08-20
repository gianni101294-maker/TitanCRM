import client from "@/api/client";

export interface OpportunitiesByStage {
  prospect: number;
  contacted: number;
  proposal: number;
  negotiation: number;
  won: number;
  lost: number;
}

export interface DashboardResponse {
  total_customers: number;
  total_opportunities: number;
  total_pipeline_value: string;
  won_value: string;
  lost_value: string;
  opportunities_by_stage: OpportunitiesByStage;
  pending_activities: number;
  overdue_activities: number;
  upcoming_activities: number;
}

function getAuthHeaders() {
  const token = localStorage.getItem(
    "titancrm_access_token",
  );

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getDashboard(): Promise<DashboardResponse> {
  const response = await client.get<DashboardResponse>(
    "/dashboard",
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}