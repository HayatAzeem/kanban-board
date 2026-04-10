import { Draggable } from "@hello-pangea/dnd";
import { format } from "date-fns";
import { Briefcase, Calendar, MoreHorizontal } from "lucide-react";
import { type Application } from "../store/kanbanStore";
import { Avatar } from "../../../components/ui/Avatar";

interface TaskCardProps {
  application: Application;
  index: number;
  onClick: (app: Application) => void;
}

export const TaskCard = ({ application, index, onClick }: TaskCardProps) => {
  return (
    <Draggable draggableId={application._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(application)}
          style={{
            ...provided.draggableProps.style,
          }}
          className={`group mb-3 cursor-pointer rounded-lg border bg-surface p-4 transition-all duration-200 
            ${snapshot.isDragging ? "border-accent shadow-glow scale-105 z-50" : "border-border shadow-card hover:border-textMuted/30 hover:bg-surfaceHover"}
          `}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar initials={application.company.substring(0, 2).toUpperCase()} className="h-8 w-8 bg-zinc-700 text-textMain" />
              <div>
                <h4 className="text-sm font-semibold text-textMain">{application.role}</h4>
                <div className="flex items-center text-xs text-textMuted mt-0.5">
                  <Briefcase className="mr-1 h-3 w-3" />
                  {application.company}
                </div>
              </div>
            </div>
            <button className="text-textMuted opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-border rounded-md hover:text-textMain">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            {application.skills && application.skills.length > 0 && (
              <div className="flex gap-1 overflow-hidden">
                {application.skills.slice(0, 2).map((skill, idx) => (
                  <span key={idx} className="rounded bg-border px-1.5 py-0.5 text-[10px] font-medium text-textMuted truncate max-w-[80px]">
                    {skill}
                  </span>
                ))}
                {application.skills.length > 2 && (
                  <span className="rounded bg-border px-1.5 py-0.5 text-[10px] font-medium text-textMuted">
                    +{application.skills.length - 2}
                  </span>
                )}
              </div>
            )}
            {!application.skills?.length && <div />}
            
            <div className="flex items-center text-xs text-textMuted shrink-0">
              <Calendar className="mr-1 h-3 w-3" />
              {application.dateApplied ? format(new Date(application.dateApplied), 'MMM d') : 'N/A'}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
