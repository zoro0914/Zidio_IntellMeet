
import { Clock, Users, Video } from "lucide-react";

const MeetingCard = ({ title, participants, startTime, duration, status = "upcoming" }) => {
  const statusStyles = {
    upcoming: "bg-blue-100 text-blue-800",
    ongoing: "bg-green-100 text-green-800",
    completed: "bg-slate-100 text-slate-800",
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyles[status]}`}>
          {status}
        </span>
      </div>

      <div className="space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Users size={16} />
          <span>{participants} participants</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>{startTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <Video size={16} />
          <span>{duration} mins</span>
        </div>
      </div>

      <button className="w-full mt-4 bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 transition text-sm font-medium">
        Join Meeting
      </button>
    </div>
  );
};

export default MeetingCard;
