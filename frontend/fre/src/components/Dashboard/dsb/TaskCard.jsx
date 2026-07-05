import {
  CheckCircle2,
  Circle,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

const TaskCard = ({
  title,
  description,
  priority = "medium",
  status = "pending",
  dueDate,
}) => {
  const priorityStyles = {
    low: "bg-blue-100 text-blue-600",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-600",
  };

  const statusIcons = {
    completed: (
      <CheckCircle2 className="w-6 h-6 text-green-500" />
    ),

    pending: (
      <Circle className="w-6 h-6 text-slate-400" />
    ),

    in_progress: (
      <AlertCircle className="w-6 h-6 text-orange-500" />
    ),
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition duration-300 border border-slate-100">

      {/* Top */}
      <div className="flex justify-between items-start">

        <div>
          <h3 className="font-semibold text-lg text-slate-800">
            {title}
          </h3>

          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            {description}
          </p>
        </div>

        {statusIcons[status]}

      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between mt-6">

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${priorityStyles[priority]}`}
        >
          {priority}
        </span>

        {dueDate && (
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <CalendarDays size={15} />
            {dueDate}
          </div>
        )}

      </div>
    </div>
  );
};

export default TaskCard;