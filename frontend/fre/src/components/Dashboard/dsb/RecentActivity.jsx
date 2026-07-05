import {
  Video,
  Users,
  CheckCircle,
  Calendar,
  MessageSquare,
} from "lucide-react";

const activities = [
  {
    id: 1,
    icon: <Video size={18} />,
    title: "Joined Team Meeting",
    description: "Frontend Sprint Planning",
    time: "10 mins ago",
    color: "bg-violet-100 text-violet-600",
  },
  {
    id: 2,
    icon: <Users size={18} />,
    title: "New Member Added",
    description: "Harsh joined Workspace",
    time: "1 hour ago",
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 3,
    icon: <CheckCircle size={18} />,
    title: "Task Completed",
    description: "Dashboard UI Finished",
    time: "3 hours ago",
    color: "bg-green-100 text-green-600",
  },
  {
    id: 4,
    icon: <Calendar size={18} />,
    title: "Meeting Scheduled",
    description: "Client Discussion - Tomorrow",
    time: "Yesterday",
    color: "bg-orange-100 text-orange-600",
  },
  {
    id: 5,
    icon: <MessageSquare size={18} />,
    title: "New Message",
    description: "5 unread messages",
    time: "Yesterday",
    color: "bg-pink-100 text-pink-600",
  },
];

const RecentActivity = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          Recent Activity
        </h2>

        <button className="text-violet-600 text-sm font-medium hover:underline">
          View All
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-5">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center ${activity.color}`}
            >
              {activity.icon}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-slate-800">
                {activity.title}
              </h3>

              <p className="text-sm text-slate-500">
                {activity.description}
              </p>
            </div>

            <span className="text-xs text-slate-400 whitespace-nowrap">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;