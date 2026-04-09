import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { ApplicationCard } from "./ApplicationCard";
import apiClient from "../api/apiClient";

const COLUMNS = ["Applied", "Phone Screen", "Interview", "Offer", "Rejected"];

interface KanbanBoardProps {
  applications: any[];
  setApplications: (apps: any[]) => void;
  onCardClick: (app: any) => void;
}

export const KanbanBoard = ({ applications, setApplications, onCardClick }: KanbanBoardProps) => {
  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      const draggedApp = applications.find((app) => app._id === draggableId);
      if (!draggedApp) return;

      const newStatus = destination.droppableId;
      const updatedApp = { ...draggedApp, status: newStatus };
      
      const updatedApplications = applications.map((app) =>
        app._id === draggableId ? updatedApp : app
      );

      setApplications(updatedApplications);

      try {
        await apiClient.patch(`/applications/${draggableId}`, { status: newStatus });
      } catch (error) {
        console.error("Failed to update status", error);
        // revert on failure
        setApplications(applications);
      }
    }
  };

  const getApplicationsByStatus = (status: string) => {
    return applications.filter((app) => app.status === status);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4 h-full">
        {COLUMNS.map((column) => (
          <div key={column} className="flex-shrink-0 w-80 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-textMain">{column}</h2>
              <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-full">
                {getApplicationsByStatus(column).length}
              </span>
            </div>
            
            <Droppable droppableId={column}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 rounded-2xl p-3 min-h-[200px] transition-colors overflow-y-auto ${
                    snapshot.isDraggingOver ? "bg-slate-800/80 ring-1 ring-primary/50" : "bg-slate-800/30"
                  }`}
                >
                  {getApplicationsByStatus(column).map((app, index) => (
                    <ApplicationCard
                      key={app._id}
                      application={app}
                      index={index}
                      onClick={onCardClick}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};
