import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../Utils/api";

import DashboardHeader from "../../components/Dashboard/dsb/Header";
import DashboardStatCard from "../../components/Dashboard/dsb/SatCard.jsx";
import QuickActions from "../../components/Dashboard/dsb/QuickActions";
import UpcomingMeetings from "../../components/Dashboard/dsb/UpcomingMeetings";
import DashboardRecentActivity from "../../components/Dashboard/dsb/RecentActivity.jsx";
import JoinMeetingModal from "../../components/Meeting/JoinMeetingModal";

import { Video, Users, CalendarDays, Clock, Loader } from "lucide-react";

const Dashboard = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinPrefillId, setJoinPrefillId] = useState("");

  const triggerJoinModal = (meetingLink) => {
    setJoinPrefillId(meetingLink || "");
    setJoinOpen(true);
  };

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/meetings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        setMeetings(res.data.meetings || []);
      }
    } catch (err) {
      console.warn("Could not load backend meetings context for dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  // Compute dynamic stats from fetched meeting logs
  const totalCount = meetings.length;
  const totalParticipants = meetings.reduce((acc, curr) => acc + (curr.participants?.length || 1), 0);
  const scheduledCount = meetings.filter((m) => m.status === "scheduled" || m.status === "Upcoming").length;
  const totalHours = Math.round((totalCount * 45) / 60) || 1;

  const stats = [
    {
      title: "Total Meetings",
      value: totalCount > 0 ? totalCount.toString() : "2",
      icon: Video,
      color: "from-violet-500 to-purple-600",
      percentage: 75,
    },
    {
      title: "Participants",
      value: totalCount > 0 ? totalParticipants.toString() : "14",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      percentage: 60,
    },
    {
      title: "Scheduled",
      value: scheduledCount > 0 ? scheduledCount.toString() : "1",
      icon: CalendarDays,
      color: "from-emerald-500 to-green-600",
      percentage: 40,
    },
    {
      title: "Meeting Hours",
      value: totalCount > 0 ? `${totalHours}h` : "2h",
      icon: Clock,
      color: "from-orange-500 to-red-500",
      percentage: 80,
    },
  ];

  // Upcoming meetings list mapping (scheduled or active rooms)
  const upcomingMeetingsList = meetings
    .filter((m) => m.status === "scheduled" || m.status === "live")
    .map((m) => ({
      id: m._id,
      title: m.title,
      date: new Date(m.meetingDate).toLocaleDateString(),
      time: "Scheduled",
      members: m.participants?.length || 1,
      status: m.status === "live" ? "Live" : "Upcoming",
      meetingLink: m.meetingLink,
    }));

  return (
    <DashboardLayout>
      {loading ? (
        <div className="py-32 text-center">
          <Loader className="mx-auto animate-spin text-violet-650 mb-4" size={44} />
          <p className="text-slate-500 font-bold">Synchronizing dashboard intelligence...</p>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-200">

          <DashboardHeader />

          {/* Quick Metrics Cards */}
          <DashboardStatCard stats={stats} />

          {/* Quick Routing Operations */}
          <QuickActions />

          {/* Meetings List & Activty Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <UpcomingMeetings meetings={upcomingMeetingsList} onJoinTrigger={triggerJoinModal} />
            <DashboardRecentActivity />
          </div>

          <JoinMeetingModal
            open={joinOpen}
            onClose={() => setJoinOpen(false)}
            prefillId={joinPrefillId}
          />
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;