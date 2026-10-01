export interface AutomationRule {
  id: number;
  name: string;
  description: string | null;
  trigger_type: string;
  conditions: Record<string, unknown>;
  action_type: string;
  action_config: Record<string, unknown>;
  is_active: boolean;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface AutomationRuleCreate {
  name: string;
  description?: string | null;
  trigger_type: string;
  conditions: Record<string, unknown>;
  action_type: string;
  action_config: Record<string, unknown>;
  is_active: boolean;
}

export interface AutomationRuleUpdate {
  name?: string;
  description?: string | null;
  trigger_type?: string;
  conditions?: Record<string, unknown>;
  action_type?: string;
  action_config?: Record<string, unknown>;
  is_active?: boolean;
}
