import {
  Alert,
  Box,
  Snackbar,
} from "@mui/material";

import { LoadingPage } from "@/components/common/LoadingPage";
import { PageHeader } from "@/components/common/PageHeader";
import { PipelineColumn } from "../components/PipelineColumn";
import { usePipeline } from "../hooks/usePipeline";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { pipelineStageConfig } from "../utils/pipeline";

export function PipelinePage() {
  const {
    pipeline,

    isLoading,
    isMoving,

    errorMessage,
    setErrorMessage,

    successMessage,
    setSuccessMessage,

    draggedOpportunity,
    draggedFromStage,
    dragOverStage,

    getCustomerName,

    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    resetDragState,
  } = usePipeline();

  return (
    <DashboardLayout title="Pipeline">
      <PageHeader
        title="Pipeline comercial"
        description="Arrastra las oportunidades para cambiar su etapa."
      />

      {errorMessage && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => setErrorMessage("")}
        >
          {errorMessage}
        </Alert>
      )}

      {isMoving && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Actualizando la etapa de la oportunidad...
        </Alert>
      )}

      {isLoading ? (
        <LoadingPage
          message="Cargando pipeline comercial..."
          minHeight={350}
        />
      ) : (
        <Box
          sx={{
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: {
              xs: "minmax(280px, 88vw)",
              sm: "minmax(290px, 360px)",
              lg: "minmax(290px, 1fr)",
            },
            gap: 2,
            alignItems: "start",
            overflowX: "auto",
            overscrollBehaviorX: "contain",
            scrollSnapType: {
              xs: "x proximity",
              md: "none",
            },
            WebkitOverflowScrolling: "touch",
            pb: 2,
            mx: {
              xs: -2,
              sm: -3,
            },
            px: {
              xs: 2,
              sm: 3,
            },
            "& > *": {
              scrollSnapAlign: "start",
            },
          }}
        >
          {pipelineStageConfig.map((stage) => (
            <PipelineColumn
              key={stage.key}
              stage={stage}
              opportunities={pipeline[stage.key]}
              dragOverStage={dragOverStage}
              draggedFromStage={draggedFromStage}
              draggedOpportunity={draggedOpportunity}
              isMoving={isMoving}
              getCustomerName={getCustomerName}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(event, targetStage) => {
                void handleDrop(event, targetStage);
              }}
              onDragStart={handleDragStart}
              onDragEnd={resetDragState}
            />
          ))}
        </Box>
      )}

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3500}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
      />
    </DashboardLayout>
  );
}