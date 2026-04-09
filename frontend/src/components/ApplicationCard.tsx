import { Draggable } from "@hello-pangea/dnd";
import { Briefcase, Building2, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

interface ApplicationCardProps {
  application: any;
  index: number;
  onClick: (app: any) => void;
}

export const ApplicationCard = ({ application, index, onClick }: ApplicationCardProps) => {
  return (
    <Draggable draggableId={application._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(application)}
          className={`bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm cursor-pointer mb-3 transition-colors ${
            snapshot.isDragging ? "ring-2 ring-primary bg-slate-700" : "hover:bg-slate-700/50"
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-textMain text-sm truncate pr-2" title={application.role}>
              {application.role}
            </h3>
          </div>
          
          <div className="flex items-center text-slate-400 text-xs mt-2 mb-1">
            <Building2 className="w-3 h-3 mr-1.5" />
            <span className="truncate">{application.company}</span>
          </div>

          <div className="flex items-center justify-between mt-4 border-t border-slate-700 pt-3">
            <div className="flex items-center text-slate-500 text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              {format(new Date(application.dateApplied), "MMM d")}
            </div>
            {application.salaryRange && (
              <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                {application.salaryRange}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};
