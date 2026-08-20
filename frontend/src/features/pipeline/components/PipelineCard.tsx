import type {
  DragEvent,
} from "react";

import {
  AccountCircle,
  DragIndicator,
} from "@mui/icons-material";

import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import type {
  Opportunity,
  OpportunityStage,
} from "@/features/opportunities";

import {
  formatPipelineCurrency,
} from "../utils/pipeline";

interface PipelineCardProps {
  opportunity:
    Opportunity;

  stage:
    OpportunityStage;

  customerName:
    string;

  isMoving:
    boolean;

  isBeingDragged:
    boolean;

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

export function PipelineCard({
  opportunity,
  stage,
  customerName,
  isMoving,
  isBeingDragged,
  onDragStart,
  onDragEnd,
}: PipelineCardProps) {
  return (
    <Card
      draggable={
        !isMoving
      }
      onDragStart={(event) =>
        onDragStart(
          event,
          opportunity,
          stage,
        )
      }
      onDragEnd={
        onDragEnd
      }
      variant="outlined"
      sx={{
        borderRadius: 2.5,
        bgcolor:
          "background.paper",

        cursor:
          isMoving
            ? "wait"
            : "grab",

        opacity:
          isBeingDragged
            ? 0.45
            : 1,

        transform:
          isBeingDragged
            ? "scale(0.98)"
            : "none",

        transition:
          "transform 0.2s, opacity 0.2s, box-shadow 0.2s, border-color 0.2s",

        userSelect: "none",

        touchAction:
          "pan-y",

        "&:hover": {
          transform:
            isBeingDragged
              ? "scale(0.98)"
              : "translateY(-3px)",

          boxShadow: 3,

          borderColor:
            "primary.light",
        },

        "&:active": {
          cursor:
            "grabbing",
        },
      }}
    >
      <CardContent
        sx={{
          p: 2,

          "&:last-child": {
            pb: 2,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems:
              "flex-start",
            justifyContent:
              "space-between",
            gap: 1,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              lineHeight: 1.3,
              overflowWrap:
                "anywhere",
            }}
          >
            {opportunity.title}
          </Typography>

          <DragIndicator
            fontSize="small"
            sx={{
              flexShrink: 0,
              color:
                "text.disabled",
            }}
          />
        </Box>

        <Box
          sx={{
            mt: 1.25,
            display: "flex",
            alignItems:
              "center",
            gap: 0.75,
            color:
              "text.secondary",
          }}
        >
          <AccountCircle
            fontSize="small"
          />

          <Typography
            variant="body2"
            sx={{
              overflow:
                "hidden",
              textOverflow:
                "ellipsis",
              whiteSpace:
                "nowrap",
            }}
          >
            {customerName}
          </Typography>
        </Box>

        <Typography
          variant="h6"
          sx={{
            mt: 2,
            fontWeight: 900,
            color:
              "primary.main",
            overflowWrap:
              "anywhere",
          }}
        >
          {formatPipelineCurrency(
            opportunity.value,
          )}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 0.5,
          }}
        >
          Oportunidad #
          {opportunity.id}
        </Typography>
      </CardContent>
    </Card>
  );
}