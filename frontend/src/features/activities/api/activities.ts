import client from "@/api/client";

export type ActivityType =
  | "call"
  | "meeting"
  | "task"
  | "email";

export type ActivityStatus =
  | "pending"
  | "completed"
  | "cancelled";

export interface Activity {
  id: number;
  title: string;
  activity_type: string;
  description: string;
  scheduled_at: string;
  status: string;
  customer_id: number;
  opportunity_id: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface ActivityCreate {
  title: string;
  activity_type: string;
  description: string;
  scheduled_at: string;
  status: string;
  customer_id: number;
  opportunity_id: number | null;
}

export interface ActivityUpdate {
  title: string;
  activity_type: string;
  description: string;
  scheduled_at: string;
  status: string;
  customer_id: number;
  opportunity_id: number | null;
}

function getAuthHeaders() {
  const token = localStorage.getItem(
    "titancrm_access_token",
  );

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getActivities(): Promise<Activity[]> {
  const response = await client.get<Activity[]>(
    "/activities",
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function getActivitiesByOpportunity(
  opportunityId: number,
): Promise<Activity[]> {
  const response = await client.get<Activity[]>(
    `/activities/opportunity/${opportunityId}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function createActivity(
  activity: ActivityCreate,
): Promise<Activity> {
  const response = await client.post<Activity>(
    "/activities",
    activity,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function updateActivity(
  activityId: number,
  activity: ActivityUpdate,
): Promise<Activity> {
  const response = await client.patch<Activity>(
    `/activities/${activityId}`,
    activity,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function deleteActivity(
  activityId: number,
): Promise<void> {
  await client.delete(
    `/activities/${activityId}`,
    {
      headers: getAuthHeaders(),
    },
  );
}
