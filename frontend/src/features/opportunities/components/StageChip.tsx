import {
  Chip,
} from "@mui/material";

import type {
  OpportunityStage,
} from "../api/opportunities";

import {
  getOpportunityStageData,
} from "../utils/opportunityStage";

interface StageChipProps {
  stage:
    OpportunityStage;
}

export function StageChip({
  stage,
}: StageChipProps) {
  const stageData =
    getOpportunityStageData(
      stage,
    );

  return (
    <Chip
      label={
        stageData.label
      }
      color={
        stageData.color
      }
      size="small"
    />
  );
}