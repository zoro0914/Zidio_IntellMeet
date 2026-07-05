import { useState } from 'react';
import Sidebar from './components/Admin/Sidebar';
import Header from './components/Admin/Header';

// Import Admin views
import Dashboard from './Admin/Dashboard';
import Users from './Admin/Users';
import Meetings from './Admin/Meetings';
import Recordings from './Admin/Recordings';
import Notes from './Admin/Notes';
import AI from './Admin/AI';
import Analytics from './Admin/Analytics';
import Storage from './Admin/Storage';
import Settings from './Admin/Settings';
import Login from './components/Admin/Login';

function App() {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!token) {
    return <Login onLoginSuccess={setToken} />;
  }

  // Tab configurations map
  const tabs = {
    dashboard: { component: <Dashboard />, title: "Dashboard Statistics" },
    users: { component: <Users />, title: "User Account Registry" },
    meetings: { component: <Meetings />, title: "Meeting Sessions Database" },
    recordings: { component: <Recordings />, title: "Recording Archives Registry" },
    notes: { component: <Notes />, title: "Meeting Discussion Notes" },
    ai: { component: <AI />, title: "AI Transcripts & Summaries" },
    analytics: { component: <Analytics />, title: "Platform Usage Analytics" },
    storage: { component: <Storage />, title: "Cloud Storage Space Metrics" },
    settings: { component: <Settings />, title: "System Gateways & Security Settings" }
  };

  const currentTab = tabs[activeTab] || tabs.dashboard;

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        onLogout={() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          setToken(null);
        }}
      />

      {/* Main Panel Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-900 relative">
        
        {/* Top Header Navigation */}
        <Header 
          title={currentTab.title} 
          setSidebarOpen={setSidebarOpen} 
        />

        {/* Dynamic Page Views */}
        <div className="p-6 max-w-6xl w-full mx-auto">
          {currentTab.component}
        </div>
      </main>

    </div>
  );
}

export default App;
