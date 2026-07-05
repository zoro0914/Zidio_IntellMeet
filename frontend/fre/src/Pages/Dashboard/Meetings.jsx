import { useState, useEffect } from "react";
import api from "../../Utils/api";

import DashboardLayout from "../../layouts/DashboardLayout";

import MeetingStats from "../../components/Meeting/MeetingStates.jsx";
import SearchMeeting from "../../components/Meeting/SearchMeeting";
import UpcomingMeetings from "../../components/Meeting/UpcomingMeetings";
import Completed from "../../components/Meeting/Completed.jsx";
import Cancelled from "../../components/Meeting/Cancelled.jsx";

import JoinMeetingModal from "../../components/Meeting/JoinMeetingModal";
import CreateMeetingModal from "../../components/Meeting/CreateMeetingModal";

const Meetings = () => {
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinPrefillId, setJoinPrefillId] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createdMeetingInfo, setCreatedMeetingInfo] = useState(null);

  const triggerJoinModal = (meetingLink) => {
    setJoinPrefillId(meetingLink || "");
    setJoinOpen(true);
  };

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("All Dates");

  // Prefill state for reschedule operations
  const [rescheduleData, setRescheduleData] = useState(null);

  // Custom dialog popup state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "confirm", // 'confirm' or 'alert'
  });

  const triggerConfirm = (title, message, onConfirm) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm,
      type: "confirm",
    });
  };

  const triggerAlert = (title, message) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: null,
      type: "alert",
    });
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
    } catch (error) {
      console.error("Error fetching meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleCreateMeeting = async (formData) => {
    try {
      const token = localStorage.getItem("accessToken");
      // Generate a random 9-character room code slug
      const randomId = Math.random().toString(36).substring(2, 11);
      const formattedLink = `${randomId.slice(0, 3)}-${randomId.slice(3, 6)}-${randomId.slice(6, 9)}`;

      const meetingDateTime = new Date(`${formData.date}T${formData.time}`);

      const res = await api.post(
        "/meetings",
        {
          title: formData.title,
          description: formData.description,
          meetingDate: meetingDateTime.toISOString(),
          meetingLink: formattedLink,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setCreatedMeetingInfo({
          id: formattedLink,
          title: formData.title,
        });
        setCreateOpen(false);
        setRescheduleData(null); // Clear reschedule cache
        fetchMeetings();
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
      triggerAlert("Error", error.response?.data?.message || "Failed to create meeting");
    }
  };

  // Cancel upcoming meeting call
  const handleCancelMeeting = async (meetingId) => {
    triggerConfirm(
      "Cancel Meeting",
      "Are you sure you want to cancel this meeting?",
      async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const res = await api.put(
            `/meetings/${meetingId}/cancel`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (res.data.success) {
            fetchMeetings();
          }
        } catch (error) {
          console.error("Error cancelling meeting:", error);
          triggerAlert("Error", "Failed to cancel meeting.");
        }
      }
    );
  };

  // Delete meeting permanently from logs
  const handleDeleteMeeting = async (meetingId) => {
    triggerConfirm(
      "Permanently Delete",
      "Are you sure you want to permanently delete this meeting record?",
      async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const res = await api.delete(`/meetings/${meetingId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.data.success) {
            fetchMeetings();
          }
        } catch (error) {
          console.error("Error deleting meeting:", error);
          triggerAlert("Error", "Failed to delete meeting.");
        }
      }
    );
  };

  // Reschedule trigger
  const handleRescheduleTrigger = (meeting) => {
    setRescheduleData({
      title: `${meeting.title} - Rescheduled`,
      description: meeting.description || "",
    });
    setCreateOpen(true);
  };

  // Dynamic searches & filter queries logic
  const filteredMeetings = meetings.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.meetingLink && m.meetingLink.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "All Status" || m.status.toLowerCase() === statusFilter.toLowerCase();

    let matchesDate = true;
    if (dateFilter === "Today") {
      const today = new Date().toDateString();
      matchesDate = new Date(m.meetingDate).toDateString() === today;
    } else if (dateFilter === "This Week") {
      const diff = new Date().getTime() - new Date(m.meetingDate).getTime();
      matchesDate = diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000;
    } else if (dateFilter === "This Month") {
      const diff = new Date().getTime() - new Date(m.meetingDate).getTime();
      matchesDate = diff >= 0 && diff <= 30 * 24 * 60 * 60 * 1000;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header Options */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Meetings</h1>
            <p className="text-slate-500 mt-1">Create, join, and manage your team meetings.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => triggerJoinModal("")}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-semibold shadow-sm transition cursor-pointer"
            >
              Join Meeting
            </button>
          </div>
        </div>

        {/* Dynamic Filters block */}
        <SearchMeeting
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />

        {/* Global stats indicators */}
        <MeetingStats meetings={meetings} />

        {/* Active categories lists */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 font-bold">
            Refreshing workspace schedules...
          </div>
        ) : (
          <div className="space-y-10">
            <UpcomingMeetings
              meetings={filteredMeetings.filter((m) => m.status === "scheduled" || m.status === "live")}
              onCancel={handleCancelMeeting}
              onJoinTrigger={triggerJoinModal}
            />

            <Completed
              meetings={filteredMeetings.filter((m) => m.status === "completed")}
              onDelete={handleDeleteMeeting}
            />

            <Cancelled
              meetings={filteredMeetings.filter((m) => m.status === "cancelled")}
              onDelete={handleDeleteMeeting}
              onReschedule={handleRescheduleTrigger}
            />
          </div>
        )}

        <JoinMeetingModal
          open={joinOpen}
          onClose={() => setJoinOpen(false)}
          prefillId={joinPrefillId}
        />

        <CreateMeetingModal
          open={createOpen}
          onClose={() => {
            setCreateOpen(false);
            setRescheduleData(null);
          }}
          onCreate={handleCreateMeeting}
          prefill={rescheduleData}
        />

        {createdMeetingInfo && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative border border-slate-100 text-slate-900 animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-2xl font-bold mb-2">Meeting Created!</h3>
              <p className="text-sm text-slate-500 mb-5">Here is your meeting code. Share it with others to join.</p>

              <div className="bg-slate-50 border rounded-xl p-4 flex items-center justify-between mb-6">
                <span className="font-mono text-lg font-bold text-violet-750 tracking-wider">
                  {createdMeetingInfo.id}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(createdMeetingInfo.id);
                    triggerAlert("Success", "Meeting code copied to clipboard!");
                  }}
                  className="bg-violet-650 hover:bg-violet-750 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  Copy Code
                </button>
              </div>

              <button
                onClick={() => setCreatedMeetingInfo(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3 font-semibold transition"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Custom Confirmation / Alert Dialog Popup */}
        {confirmDialog.isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 relative border border-slate-100 text-slate-900 animate-in zoom-in-95 duration-200">
              <h3 className="text-xl font-bold text-slate-800 mb-2">{confirmDialog.title}</h3>
              <p className="text-sm text-slate-550 mb-6 font-semibold">{confirmDialog.message}</p>

              <div className="flex justify-end gap-3">
                {confirmDialog.type === "confirm" ? (
                  <>
                    <button
                      onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                      className="px-5 py-2.5 rounded-xl text-slate-700 bg-gray-100 hover:bg-gray-200 transition text-sm font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                        if (confirmDialog.onConfirm) confirmDialog.onConfirm();
                      }}
                      className="px-5 py-2.5 rounded-xl text-white bg-red-400 hover:bg-red-500 shadow-sm transition text-sm font-semibold cursor-pointer"
                    >
                      Confirm
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                    className="px-6 py-2.5 rounded-xl text-white bg-violet-600 hover:bg-violet-750 shadow-sm transition text-sm font-semibold cursor-pointer"
                  >
                    Okay
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Meetings;