import api from "@/api/client";

import type {
  AutomationRule,
  AutomationRuleCreate,
  AutomationRuleUpdate,
} from "../types";

export async function getAutomations(
  activeOnly = false,
): Promise<AutomationRule[]> {
  const response = await api.get<
    AutomationRule[]
  >(
    "/automations",
    {
      params: {
        active_only: activeOnly,
      },
    },
  );

  return response.data;
}

export async function getAutomation(
  automationId: number,
): Promise<AutomationRule> {
  const response = await api.get<
    AutomationRule
  >(
    `/automations/${automationId}`,
  );

  return response.data;
}

export async function createAutomation(
  data: AutomationRuleCreate,
): Promise<AutomationRule> {
  const response = await api.post<
    AutomationRule
  >(
    "/automations",
    data,
  );

  return response.data;
}

export async function updateAutomation(
  automationId: number,
  data: AutomationRuleUpdate,
): Promise<AutomationRule> {
  const response = await api.patch<
    AutomationRule
  >(
    `/automations/${automationId}`,
    data,
  );

  return response.data;
}

export async function deleteAutomation(
  automationId: number,
): Promise<void> {
  await api.delete(
    `/automations/${automationId}`,
  );
}
