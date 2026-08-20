import {
  useCallback,
  useEffect,
  useState,
  type DragEvent,
} from "react";

import {
  getPipeline,
  type PipelineResponse,
} from "../api/pipeline";

import {
  getCustomers,
  type Customer,
} from "@/features/customers";

import {
  updateOpportunity,
  type Opportunity,
  type OpportunityStage,
} from "@/features/opportunities";

import {
  getPipelineStageConfig,
} from "../utils/pipeline";

const emptyPipeline:
  PipelineResponse = {
    prospect: [],
    contacted: [],
    proposal: [],
    negotiation: [],
    won: [],
    lost: [],
  };

export function usePipeline() {
  const [
    pipeline,
    setPipeline,
  ] =
    useState<PipelineResponse>(
      emptyPipeline,
    );

  const [
    customers,
    setCustomers,
  ] =
    useState<Customer[]>(
      [],
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    isMoving,
    setIsMoving,
  ] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] =
    useState("");

  const [
    draggedOpportunity,
    setDraggedOpportunity,
  ] =
    useState<
      Opportunity | null
    >(null);

  const [
    draggedFromStage,
    setDraggedFromStage,
  ] =
    useState<
      OpportunityStage | null
    >(null);

  const [
    dragOverStage,
    setDragOverStage,
  ] =
    useState<
      OpportunityStage | null
    >(null);

  const reloadPipeline =
    useCallback(
      async () => {
        setIsLoading(
          true,
        );

        setErrorMessage(
          "",
        );

        try {
          const [
            pipelineData,
            customerData,
          ] =
            await Promise.all(
              [
                getPipeline(),
                getCustomers(),
              ],
            );

          setPipeline(
            pipelineData,
          );

          setCustomers(
            customerData,
          );
        } catch {
          setErrorMessage(
            "No se pudo cargar el Pipeline.",
          );
        } finally {
          setIsLoading(
            false,
          );
        }
      },
      [],
    );

  useEffect(() => {
    let isMounted =
      true;

    async function loadInitialPipeline() {
      try {
        const [
          pipelineData,
          customerData,
        ] =
          await Promise.all(
            [
              getPipeline(),
              getCustomers(),
            ],
          );

        if (
          isMounted
        ) {
          setPipeline(
            pipelineData,
          );

          setCustomers(
            customerData,
          );

          setErrorMessage(
            "",
          );
        }
      } catch {
        if (
          isMounted
        ) {
          setErrorMessage(
            "No se pudo cargar el Pipeline.",
          );
        }
      } finally {
        if (
          isMounted
        ) {
          setIsLoading(
            false,
          );
        }
      }
    }

    void loadInitialPipeline();

    return () => {
      isMounted =
        false;
    };
  }, []);

  const getCustomerName =
    useCallback(
      (
        customerId:
          number,
      ) => {
        const customer =
          customers.find(
            (item) =>
              item.id ===
              customerId,
          );

        return (
          customer
            ?.company_name ??
          "Cliente no encontrado"
        );
      },
      [
        customers,
      ],
    );

  function handleDragStart(
    event:
      DragEvent<HTMLDivElement>,
    opportunity:
      Opportunity,
    sourceStage:
      OpportunityStage,
  ) {
    if (
      isMoving
    ) {
      event.preventDefault();

      return;
    }

    setDraggedOpportunity(
      opportunity,
    );

    setDraggedFromStage(
      sourceStage,
    );

    event.dataTransfer.effectAllowed =
      "move";

    event.dataTransfer.setData(
      "text/plain",
      String(
        opportunity.id,
      ),
    );
  }

  function handleDragOver(
    event:
      DragEvent<HTMLDivElement>,
    targetStage:
      OpportunityStage,
  ) {
    event.preventDefault();

    if (
      isMoving
    ) {
      return;
    }

    event.dataTransfer.dropEffect =
      "move";

    setDragOverStage(
      targetStage,
    );
  }

  function handleDragLeave(
    event:
      DragEvent<HTMLDivElement>,
  ) {
    const currentTarget =
      event.currentTarget;

    const relatedTarget =
      event.relatedTarget;

    if (
      relatedTarget instanceof
        Node &&
      currentTarget.contains(
        relatedTarget,
      )
    ) {
      return;
    }

    setDragOverStage(
      null,
    );
  }

  function resetDragState() {
    setDraggedOpportunity(
      null,
    );

    setDraggedFromStage(
      null,
    );

    setDragOverStage(
      null,
    );
  }

  async function handleDrop(
    event:
      DragEvent<HTMLDivElement>,
    targetStage:
      OpportunityStage,
  ) {
    event.preventDefault();

    setDragOverStage(
      null,
    );

    if (
      !draggedOpportunity ||
      !draggedFromStage ||
      draggedFromStage ===
        targetStage ||
      isMoving
    ) {
      resetDragState();

      return;
    }

    const opportunityToMove =
      draggedOpportunity;

    const sourceStage =
      draggedFromStage;

    const previousPipeline =
      pipeline;

    const movedOpportunity:
      Opportunity = {
        ...opportunityToMove,

        stage:
          targetStage,
      };

    setPipeline(
      (
        currentPipeline,
      ) => ({
        ...currentPipeline,

        [sourceStage]:
          currentPipeline[
            sourceStage
          ].filter(
            (
              opportunity,
            ) =>
              opportunity.id !==
              opportunityToMove.id,
          ),

        [targetStage]: [
          ...currentPipeline[
            targetStage
          ],

          movedOpportunity,
        ],
      }),
    );

    setIsMoving(
      true,
    );

    resetDragState();

    try {
      const updatedOpportunity =
        await updateOpportunity(
          opportunityToMove.id,
          {
            title:
              opportunityToMove.title,

            value:
              Number(
                opportunityToMove.value,
              ),

            stage:
              targetStage,

            priority:
              opportunityToMove.priority,

            probability:
              opportunityToMove.probability,

            expected_close_date:
              opportunityToMove.expected_close_date,

            notes:
              opportunityToMove.notes,

            assigned_user_id:
              opportunityToMove.assigned_user_id,

            customer_id:
              opportunityToMove.customer_id,
          },
        );

      setPipeline(
        (
          currentPipeline,
        ) => ({
          ...currentPipeline,

          [targetStage]:
            currentPipeline[
              targetStage
            ].map(
              (
                opportunity,
              ) =>
                opportunity.id ===
                updatedOpportunity.id
                  ? updatedOpportunity
                  : opportunity,
            ),
        }),
      );

      const targetStageLabel =
        getPipelineStageConfig(
          targetStage,
        ).label;

      setSuccessMessage(
        `Oportunidad movida a ${targetStageLabel}.`,
      );
    } catch {
      setPipeline(
        previousPipeline,
      );

      setErrorMessage(
        "No se pudo cambiar la etapa. El movimiento fue revertido.",
      );
    } finally {
      setIsMoving(
        false,
      );
    }
  }

  return {
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

    reloadPipeline,
  };
}