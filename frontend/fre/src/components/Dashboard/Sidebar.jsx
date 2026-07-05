import {
  LayoutDashboard,
  Video,
  Calendar,
  PlayCircle,
  FileText,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  X,
  Users,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Meetings", icon: Video, path: "/meetings" },
  { name: "Teams", icon: Users, path: "/teams" },
  { name: "Calendar", icon: Calendar, path: "/calendar" },
  { name: "Recordings", icon: PlayCircle, path: "/recordings" },
  { name: "Notes", icon: FileText, path: "/notes" },
  { name: "Meeting Summary", icon: ClipboardList, path: "/meeting-summary" },
  { name: "AI Chat", icon: Sparkles, path: "/ai-chat" },
  { name: "Analytics", icon: BarChart3, path: "/analytics" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

const Sidebar = ({ open, setOpen }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const renderAvatar = () => {
    const avatarValue = user?.avatar;

    if (avatarValue && avatarValue.startsWith("data:image/")) {
      return (
        <img
          src={avatarValue}
          alt={user?.name}
          className="object-cover w-full h-full rounded-full"
        />
      );
    }

    const presetGradients = {
      "preset-1": "from-violet-605 to-indigo-650",
      "preset-2": "from-emerald-500 to-teal-500",
      "preset-3": "from-amber-500 to-orange-500",
      "preset-4": "from-rose-500 to-red-500",
      "preset-5": "from-cyan-500 to-blue-500",
      "preset-6": "from-fuchsia-500 to-pink-500",
    };

    const gradientCss = presetGradients[avatarValue] || "from-violet-600 to-indigo-600";

    return (
      <div className={`w-full h-full rounded-full flex items-center justify-center font-bold bg-gradient-to-tr ${gradientCss}`}>
        {user?.name?.charAt(0)?.toUpperCase() || "U"}
      </div>
    );
  };

  return (
    <>
      {/* Overlay */}

      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity
        ${open
            ? "opacity-100 visible"
            : "opacity-0 invisible"
          }`}
      />

      {/* Sidebar */}

      <aside
        className={`
        fixed lg:static
        top-0 left-0
        h-screen
        w-72
        bg-[#070B24]
        text-white
        flex
        flex-col
        z-40
        transition-transform
        duration-300
        ${open
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          }
      `}
      >
        {/* Mobile Close */}

        <div className="flex justify-end p-4 lg:hidden flex-shrink-0">
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        {/* Logo */}

        <div className="px-6 pb-8 flex items-center gap-3 flex-shrink-0">
          <div className="w-11 h-11 rounded-xl bg-violet-600 flex items-center justify-center">
            <Sparkles size={20} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              Intell
              <span className="text-violet-500">
                Meet
              </span>
            </h1>

            <p className="text-xs text-slate-400">
              AI Collaboration Platform
            </p>
          </div>
        </div>

        {/* Scrollable links container */}
        <div className="flex-1 overflow-y-auto scrollbar-none pr-1">
          <nav className="px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-5 py-3 rounded-xl transition-all ${isActive
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600"
                      : "hover:bg-slate-800"
                    }`
                  }
                >
                  <Icon size={20} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User */}

        <div className="border-t border-slate-800 p-5 flex-shrink-0">

          <div className="flex items-center justify-between gap-3">

            <div
              onClick={() => navigate("/profile")}
              className="flex items-center gap-3 cursor-pointer hover:bg-slate-800/40 p-1.5 rounded-xl transition flex-1 min-w-0"
              title="View Profile Settings"
            >
              <div className="w-10 h-10 rounded-full relative flex-shrink-0">
                {renderAvatar()}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="truncate text-sm font-semibold">{user?.name}</h3>
                <p className="text-xs text-slate-400 truncate">
                  {user?.role}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/logout")}
              className="hover:text-red-500 transition-colors p-1.5 hover:bg-slate-800/30 rounded-lg flex-shrink-0"
              title="Log Out"
            >
              <LogOut size={18} />
            </button>

          </div>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;