import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Meetings from "./Pages/Dashboard/Meetings.jsx";
import MeetingRoom from "./Pages/Dashboard/MeetingRoom.jsx";
import Calendar from "./Pages/Calendar";
import Recordings from "./Pages/Recordings";
import Notes from "./Pages/Notes";
import MeetingSummary from "./Pages/MeetingSummary";
import Analytics from "./Pages/Analytics";
import Settings from "./Pages/Settings";
import AIChatPage from "./Pages/AIChatPage";
import Teams from "./Pages/Teams";

import Profile from "./components/Dashboard/Profile";
import Logout from "./components/auth/Logout";

function App() {
  return (
    <Routes>

      {/* Public */}

      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      {/* Dashboard */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Meetings */}

      <Route
        path="/meetings"
        element={
          <ProtectedRoute>
            <Meetings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teams"
        element={
          <ProtectedRoute>
            <Teams />
          </ProtectedRoute>
        }
      />

      <Route
        path="/meeting/:roomId"
        element={
          <ProtectedRoute>
            <MeetingRoom />
          </ProtectedRoute>
        }
      />

      {/* Calendar */}
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        }
      />

      {/* Recordings */}
      <Route
        path="/recordings"
        element={
          <ProtectedRoute>
            <Recordings />
          </ProtectedRoute>
        }
      />

      {/* Notes */}
      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        }
      />

      {/* Meeting Summary */}
      <Route
        path="/meeting-summary"
        element={
          <ProtectedRoute>
            <MeetingSummary />
          </ProtectedRoute>
        }
      />

      {/* AI Chat */}
      <Route
        path="/ai-chat"
        element={
          <ProtectedRoute>
            <AIChatPage />
          </ProtectedRoute>
        }
      />

      {/* Analytics */}
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      {/* Settings */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Profile */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Logout */}

      <Route
        path="/logout"
        element={
          <ProtectedRoute>
            <Logout />
          </ProtectedRoute>
        }
      />

      {/* 404 */}

      <Route
        path="*"
        element={<Navigate to="/dashboard" />}
      />

    </Routes>
  );
}

export default App;