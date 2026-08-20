import type {
  DragEvent,
} from "react";

import {
  Box,
  Chip,
  Paper,
  Typography,
} from "@mui/material";

import type {
  Opportunity,
  OpportunityStage,
} from "@/features/opportunities";

import {
  formatPipelineCurrency,
  getPipelineStageAverage,
  getPipelineStageValue,
  type PipelineStageConfig,
} from "../utils/pipeline";

import {
  PipelineCard,
} from "./PipelineCard";

interface PipelineColumnProps {
  stage: PipelineStageConfig;

  opportunities:
    Opportunity[];

  dragOverStage:
    OpportunityStage | null;

  draggedFromStage:
    OpportunityStage | null;

  draggedOpportunity:
    Opportunity | null;

  isMoving: boolean;

  getCustomerName: (
    customerId: number,
  ) => string;

  onDragOver: (
    event:
      DragEvent<HTMLDivElement>,
    stage:
      OpportunityStage,
  ) => void;

  onDragLeave: (
    event:
      DragEvent<HTMLDivElement>,
  ) => void;

  onDrop: (
    event:
      DragEvent<HTMLDivElement>,
    stage:
      OpportunityStage,
  ) => void;

  onDragStart: (
    event:
      DragEvent<HTMLDivElement>,
    opportunity:
      Opportunity,
    sourceStage:
      OpportunityStage,
  ) => void;

  onDragEnd:
    () => void;
}

export function PipelineColumn({
  stage,
  opportunities,
  dragOverStage,
  draggedFromStage,
  draggedOpportunity,
  isMoving,
  getCustomerName,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
  onDragEnd,
}: PipelineColumnProps) {
  const totalValue =
    getPipelineStageValue(
      opportunities,
    );

  const averageValue =
    getPipelineStageAverage(
      opportunities,
    );

  const isCurrentDropZone =
    dragOverStage ===
      stage.key &&
    draggedFromStage !==
      stage.key;

  return (
    <Paper
      variant="outlined"
      onDragOver={(event) =>
        onDragOver(
          event,
          stage.key,
        )
      }
      onDragLeave={
        onDragLeave
      }
      onDrop={(event) =>
        onDrop(
          event,
          stage.key,
        )
      }
      sx={{
        minWidth: 290,
        borderRadius: 3,
        overflow: "hidden",

        bgcolor:
          isCurrentDropZone
            ? "action.hover"
            : "#f8fafc",

        borderWidth:
          isCurrentDropZone
            ? 2
            : 1,

        borderColor:
          isCurrentDropZone
            ? "primary.main"
            : "divider",

        transition:
          "all 0.2s ease",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 2,
          borderBottom:
            "1px solid",
          borderColor:
            "divider",
          bgcolor:
            "background.paper",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            gap: 1,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
            }}
          >
            {stage.label}
          </Typography>

          <Chip
            label={
              opportunities.length
            }
            color={
              stage.color
            }
            size="small"
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
          }}
        >
          Total
        </Typography>

        <Typography
          sx={{
            fontWeight: 700,
          }}
        >
          {formatPipelineCurrency(
            totalValue,
          )}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          Promedio{" "}
          {formatPipelineCurrency(
            averageValue,
          )}
        </Typography>
      </Box>

      <Box
        sx={{
          p: 1.5,
          display: "flex",
          flexDirection:
            "column",
          gap: 1.5,
          minHeight: 220,
        }}
      >
        {opportunities.map(
          (opportunity) => (
            <PipelineCard
              key={
                opportunity.id
              }
              opportunity={
                opportunity
              }
              stage={
                stage.key
              }
              customerName={
                getCustomerName(
                  opportunity.customer_id,
                )
              }
              isMoving={
                isMoving
              }
              isBeingDragged={
                draggedOpportunity?.id ===
                opportunity.id
              }
              onDragStart={
                onDragStart
              }
              onDragEnd={
                onDragEnd
              }
            />
          ),
        )}

        {opportunities.length ===
          0 && (
          <Box
            sx={{
              minHeight: 120,
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              borderRadius: 2,
              border:
                isCurrentDropZone
                  ? "2px dashed"
                  : "2px dashed transparent",
              borderColor:
                isCurrentDropZone
                  ? "primary.main"
                  : "transparent",
            }}
          >
            <Typography
              color="text.secondary"
            >
              {isCurrentDropZone
                ? "Suelta aquí"
                : "Sin oportunidades"}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}