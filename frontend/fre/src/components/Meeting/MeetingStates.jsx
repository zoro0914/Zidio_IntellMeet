import {
  CalendarCheck,
  Video,
  Clock3,
  Users,
} from "lucide-react";

const MeetingStats = ({ meetings = [] }) => {
  const totalMeetings = meetings.length;
  const upcomingMeetings = meetings.filter(m => m.status === "scheduled" || m.status === "live").length;
  const hoursSpent = meetings.filter(m => m.status === "completed").length;
  const totalParticipants = meetings.reduce((acc, m) => acc + (m.participants?.length || 0), 0);

  const stats = [
    {
      id: 1,
      title: "Total Meetings",
      value: totalMeetings.toString(),
      icon: Video,
      color: "bg-violet-100 text-violet-600",
    },
    {
      id: 2,
      title: "Upcoming",
      value: upcomingMeetings.toString().padStart(2, "0"),
      icon: CalendarCheck,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 3,
      title: "Hours Spent",
      value: `${hoursSpent}h`,
      icon: Clock3,
      color: "bg-green-100 text-green-600",
    },
    {
      id: 4,
      title: "Participants",
      value: totalParticipants.toString(),
      icon: Users,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-6 border border-slate-200"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  {item.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {item.value}
                </h2>

              </div>

              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}
              >
                <Icon size={28} />
              </div>

            </div>

          </div>
        );
      })}

    </div>
  );
};

export default MeetingStats;