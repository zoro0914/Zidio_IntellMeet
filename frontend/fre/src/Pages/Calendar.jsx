import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../Utils/api";

// Reusable Calendar components
import CalendarHeader from "../components/Calendar/CalendarHeader";
import CalendarGrid from "../components/Calendar/CalendarGrid";
import CalendarSidebar from "../components/Calendar/CalendarSidebar";

import CreateMeetingModal from "../components/Meeting/CreateMeetingModal";
import JoinMeetingModal from "../components/Meeting/JoinMeetingModal";

const mockUpcoming = [
  {
    _id: "mock-cal-1",
    title: "AI Features Sync Call",
    meetingDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), // Tomorrow
    meetingLink: "abc-def-ghi",
    status: "scheduled",
    createdBy: { name: "Sania Malhotra" },
  },
  {
    _id: "mock-cal-2",
    title: "Responsive CSS Standup",
    meetingDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(), // In 3 days
    meetingLink: "xyz-lmn-opq",
    status: "scheduled",
    createdBy: { name: "Laxmi Prasad" },
  }
];

const Calendar = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Month and Date selection
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Modal display parameters
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [rescheduleData, setRescheduleData] = useState(null);
  const [createdMeetingInfo, setCreatedMeetingInfo] = useState(null);

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
        setMeetings([...res.data.meetings, ...mockUpcoming]);
      } else {
        setMeetings(mockUpcoming);
      }
    } catch (err) {
      console.warn("Could not fetch db meetings for calendar, using offline mode:", err);
      setMeetings(mockUpcoming);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  // Calendar dates calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOfWeek = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDaySelect = (day) => {
    setSelectedDate(new Date(year, month, day));
  };

  // Match events to dates
  const getEventsForDate = (date) => {
    const formattedDate = date.toDateString();
    return meetings.filter((m) => {
      const meetingDate = new Date(m.meetingDate).toDateString();
      return meetingDate === formattedDate && m.status === "scheduled";
    });
  };

  const activeDateEvents = getEventsForDate(selectedDate);

  const handleCreateMeeting = async (formData) => {
    try {
      const token = localStorage.getItem("accessToken");
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
        setRescheduleData(null);
        fetchMeetings();
      }
    } catch (err) {
      console.error("Error creating calendar meeting:", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] overflow-hidden">
        
        {/* Left Side: Calendar Grid */}
        <div className="lg:col-span-8 flex flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          
          <CalendarHeader
            monthName={monthNames[month]}
            year={year}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onScheduleClick={() => setCreateOpen(true)}
          />

          <CalendarGrid
            year={year}
            month={month}
            daysInMonth={daysInMonth}
            startDayOfWeek={startDayOfWeek}
            selectedDate={selectedDate}
            onDaySelect={handleDaySelect}
            getEventsForDate={getEventsForDate}
          />

        </div>

        {/* Right Side: Selected day Agenda sidebar layout */}
        <div className="lg:col-span-4 h-full">
          <CalendarSidebar
            selectedDate={selectedDate}
            loading={loading}
            activeDateEvents={activeDateEvents}
            onScheduleClick={() => setCreateOpen(true)}
            onJoinClick={(link) => navigate(`/meeting/${link}`)}
          />
        </div>

      </div>

      <CreateMeetingModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          setRescheduleData(null);
        }}
        onCreate={handleCreateMeeting}
        prefill={rescheduleData}
      />

      <JoinMeetingModal
        open={joinOpen}
        onClose={() => setJoinOpen(false)}
      />

      {createdMeetingInfo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative border border-slate-100 text-slate-900 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold mb-2">Meeting Created!</h3>
            <p className="text-sm text-slate-505 mb-5">Here is your meeting code. Share it with others to join.</p>
            
            <div className="bg-slate-50 border rounded-xl p-4 flex items-center justify-between mb-6">
              <span className="font-mono text-lg font-bold text-violet-750 tracking-wider">
                {createdMeetingInfo.id}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(createdMeetingInfo.id);
                  alert("Copied to clipboard!");
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

    </DashboardLayout>
  );
};

export default Calendar;
