import { useState } from "react";
import Navbar from "../components/Dashboard/Navbar";
import Sidebar from "../components/Dashboard/Sidebar";

const DashboardLayout = ({ children }) => {

  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* Sidebar */}
      <Sidebar
        open={open}
        setOpen={setOpen}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* Navbar */}
        <Navbar
          setOpen={setOpen}
        />

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;