import { useEffect } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { useKanbanStore, type ApplicationStatus, type Application } from "../store/kanbanStore";
import { Column } from "./Column";

const COLUMNS: { id: ApplicationStatus; title: string }[] = [
  { id: "Applied", title: "Applied" },
  { id: "Phone Screen", title: "Phone Screen" },
  { id: "Interview", title: "Interview" },
  { id: "Offer", title: "Offer" },
  { id: "Rejected", title: "Rejected" },
];

interface BoardProps {
  onCardClick: (app: Application) => void;
}

export const Board = ({ onCardClick }: BoardProps) => {
  const { applications, updateApplicationStatus, fetchApplications, isLoading } = useKanbanStore();

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as ApplicationStatus;
    updateApplicationStatus(draggableId, newStatus);
  };

  if (isLoading && applications.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-6 overflow-x-auto pb-4">
      <DragDropContext onDragEnd={onDragEnd}>
        {COLUMNS.map((col) => {
          const colApps = applications.filter((app) => app.status === col.id);
          return (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              applications={colApps}
              onCardClick={onCardClick}
            />
          );
        })}
      </DragDropContext>
    </div>
  );
};
