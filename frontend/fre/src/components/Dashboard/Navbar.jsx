import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Menu,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const Navbar = ({ setOpen }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">

      {/* Left Side */}
      <div className="flex items-center gap-4">

        {/* Mobile Menu Button */}

        <button
          onClick={() => setOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="text-sm text-gray-500">
            Welcome back, {user?.name}
          </p>
        </div>

      </div>

      {/* Right Side */}

      <div className="flex items-center gap-4">

        {/* Search */}

        <div className="relative hidden md:block">
          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        {/* Notification */}

        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
          <Bell size={22} />

          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-10 h-10 rounded-full relative flex items-center justify-center font-bold shadow-sm transition-all focus:outline-none overflow-hidden"
          >
            {(() => {
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
                <div className={`w-full h-full rounded-full flex items-center justify-center text-white text-sm bg-gradient-to-tr ${gradientCss}`}>
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              );
            })()}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 text-slate-700">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-semibold text-sm text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition"
                onClick={() => setDropdownOpen(false)}
              >
                <User size={16} />
                Profile
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings size={16} />
                Settings
              </Link>
              <hr className="my-1 border-gray-100" />
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/logout");
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};

export default Navbar;