import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../Utils/api";

// Reusable components
import ProfileHeader from "../Profile/ProfileHeader";
import ProfileForm from "../Profile/ProfileForm";
import ProfileStats from "../Profile/ProfileStats";
import ProfileTimeline from "../Profile/ProfileTimeline";

import { Loader, CheckCircle } from "lucide-react";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bioGenerating, setBioGenerating] = useState(false);
  const [error, setError] = useState(null);

  const [notification, setNotification] = useState("");

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const fetchProfileAndStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("No token found. Please login again.");
        setLoading(false);
        return;
      }

      // 1. Fetch Profile
      const profileRes = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 2. Fetch Meetings to get accurate stats and timeline logs
      const meetingsRes = await api.get("/meetings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (profileRes.data?.user) {
        setUserData(profileRes.data.user);
        localStorage.setItem("user", JSON.stringify(profileRes.data.user));
      }

      if (meetingsRes.data?.meetings) {
        setMeetings(meetingsRes.data.meetings);
      }
    } catch (err) {
      console.error("Profile loading error:", err);
      setError(err.response?.data?.message || "Failed to load profile logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndStats();
  }, []);

  const handleSaveProfile = async (formData) => {
    try {
      setSaving(true);
      const token = localStorage.getItem("accessToken");

      const res = await api.put(
        "/auth/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        showNotification("Profile updated successfully!");
        setUserData(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error("Profile updates submission error:", err);
      showNotification("Error: " + (err.response?.data?.message || "Failed to update profile details"));
    } finally {
      setSaving(false);
    }
  };

  // Generate tagline/biography using Gemini AI model
  const handleGenerateBio = async () => {
    try {
      setBioGenerating(true);
      showNotification("Gemini is composing profile bio tagline...");
      const token = localStorage.getItem("accessToken");

      const res = await api.post(
        "/auth/generate-bio",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        showNotification("AI Biography tagline generated!");
        setUserData(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error("AI Bio taglines generation failed:", err);
      showNotification("Could not compile AI biography tagline.");
    } finally {
      setBioGenerating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-32 text-center bg-white border rounded-2xl shadow-sm">
          <Loader className="mx-auto animate-spin text-violet-605 mb-4" size={40} />
          <p className="text-slate-500 font-bold">Synchronizing user profile files...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center max-w-lg mx-auto mt-10">
          <p className="text-rose-700 font-bold mb-4">{error}</p>
          <button
            onClick={fetchProfileAndStats}
            className="bg-rose-600 hover:bg-rose-750 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
          >
            Retry Sync
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Banner Alert Toast */}
        {notification && (
          <div className="fixed bottom-5 right-5 bg-slate-900 text-white rounded-2xl px-5 py-3.5 shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <CheckCircle className="text-emerald-400" size={20} />
            <span className="text-sm font-semibold">{notification}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Profile Settings</h1>
            <p className="text-slate-500 mt-1">Manage user account profile details, tags, and workspace access configuration.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Left Column: User Summary & Stats & Activity */}
          <div className="lg:col-span-1 space-y-6">

            {/* Header & Bio */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-200">
              <ProfileHeader
                userData={userData}
                onGenerateBio={handleGenerateBio}
                bioGenerating={bioGenerating}
              />
            </div>

            {/* Stats Summary */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-200">
              <ProfileStats meetingCount={meetings.length} />
            </div>

            {/* Recent Timeline */}
            {/* <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-200">
              <ProfileTimeline meetings={meetings} />
            </div> */}

          </div>

          {/* Right Column: Edit Profile details form */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-200">
            <ProfileForm
              userData={userData}
              onSave={handleSaveProfile}
              saving={saving}
            />
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default Profile;