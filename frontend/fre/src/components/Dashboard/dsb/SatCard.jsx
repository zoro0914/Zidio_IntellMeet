import React from "react";
import {
  Video,
  Users,
  CalendarDays,
  Clock,
} from "lucide-react";

const mockStats = [
  {
    title: "Total Meetings",
    value: "24",
    icon: Video,
    color: "from-violet-500 to-purple-600",
    percentage: 72,
  },
  {
    title: "Participants",
    value: "138",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    percentage: 60,
  },
  {
    title: "Scheduled",
    value: "08",
    icon: CalendarDays,
    color: "from-emerald-500 to-green-600",
    percentage: 45,
  },
  {
    title: "Meeting Hours",
    value: "56h",
    icon: Clock,
    color: "from-orange-500 to-red-500",
    percentage: 80,
  },
];

const StatCard = ({ stats }) => {
  const displayStats = stats && stats.length > 0 ? stats : mockStats;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
      {displayStats.map((item, index) => {
        const Icon = item.icon || Video;

        return (
          <div
            key={index}
            className="
              bg-white
              rounded-2xl
              shadow-sm
              border
              border-gray-100
              p-6
              hover:shadow-xl
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-505 text-sm font-semibold">
                  {item.title}
                </p>

                <h2 className="text-3xl font-bold mt-2 text-gray-800">
                  {item.value}
                </h2>
              </div>

              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-r ${item.color}
                flex items-center justify-center shadow-md`}
              >
                <Icon className="text-white" size={26} />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Month progress</span>
                <span>{item.percentage}%</span>
              </div>

              <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default StatCard;