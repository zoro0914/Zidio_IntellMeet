import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  Users,
  Video,
} from "lucide-react";

const mockUpcoming = [
  {
    id: "mock-upcoming-1",
    title: "AI Features & Socket Sync",
    date: "Today",
    time: "10:00 AM",
    members: 8,
    status: "Live",
    meetingLink: "gy7-1zv-deo"
  },
  {
    id: "mock-upcoming-2",
    title: "UI Layout Review Call",
    date: "Today",
    time: "02:30 PM",
    members: 5,
    status: "Upcoming",
    meetingLink: "abc-xyz-123"
  }
];

const UpcomingMeetings = ({ meetings, onJoinTrigger }) => {
  const navigate = useNavigate();
  const list = meetings && meetings.length > 0 ? meetings : mockUpcoming;

  const handleJoin = (link) => {
    if (onJoinTrigger) {
      onJoinTrigger(link);
    } else {
      const cleanLink = link.trim().replace(/^http.*\/meeting\//, "");
      navigate(`/meeting/${cleanLink}`);
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Upcoming Meetings
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Your dynamic scheduled room meetings
          </p>
        </div>

        <button 
          onClick={() => navigate("/meetings")}
          className="text-violet-650 font-bold hover:underline text-sm"
        >
          View All
        </button>
      </div>

      {/* Meeting Cards list */}
      <div className="space-y-4">
        {list.map((meeting) => (
          <div
            key={meeting.id || meeting._id}
            className="border rounded-xl p-5 hover:border-violet-500 hover:shadow-lg transition-all duration-300 bg-white"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              
              {/* Left Details */}
              <div className="flex gap-4 min-w-0">
                <div className="w-14 h-14 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <Video size={24} className="text-violet-600 animate-pulse" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-gray-850 truncate">
                      {meeting.title}
                    </h3>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase
                      ${
                        meeting.status === "Live" || meeting.status === "live"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {meeting.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-5 mt-3 text-xs text-gray-450 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={14} className="text-violet-500" />
                      {meeting.date || new Date(meeting.meetingDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock3 size={14} className="text-violet-500" />
                      {meeting.time || "Scheduled"}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-violet-500" />
                      {meeting.members || meeting.participants?.length || 1} Members
                    </div>
                  </div>
                </div>

              </div>

              {/* Join Action button */}
              <button
                onClick={() => handleJoin(meeting.meetingLink)}
                className="bg-violet-600 hover:bg-violet-750 text-white px-6 py-3 rounded-xl transition font-semibold shadow-sm flex-shrink-0 text-sm"
              >
                Join Room
              </button>

            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default UpcomingMeetings;