import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Button from "../components/common/Button.jsx";
import { Plus } from "lucide-react";

const Projects = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
            <p className="text-slate-500 mt-1">
              Manage your projects and collaborate
            </p>
          </div>
          <Button variant="primary" size="md">
            <Plus size={20} className="mr-2" />
            New Project
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600">Projects component coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Projects;
