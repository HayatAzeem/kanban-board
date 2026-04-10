import { Droppable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { type Application } from "../store/kanbanStore";

interface ColumnProps {
  id: string;
  title: string;
  applications: Application[];
  onCardClick: (app: Application) => void;
}

export const Column = ({ id, title, applications, onCardClick }: ColumnProps) => {
  return (
    <div className="flex flex-col w-80 shrink-0">
      <div className="mb-3 flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-textMain">{title}</h3>
          <span className="flex h-5 items-center justify-center rounded-full bg-surfaceHover px-2 text-xs font-medium text-textMuted">
            {applications.length}
          </span>
        </div>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 min-h-[150px] rounded-xl p-2 transition-colors duration-200 ${
              snapshot.isDraggingOver ? "bg-surfaceHover/80" : "bg-transparent"
            }`}
          >
            {applications.map((app, index) => (
              <TaskCard 
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
  );
};
