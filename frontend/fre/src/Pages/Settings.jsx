import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Button from "../components/common/Button.jsx";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account settings</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-6 max-w-2xl">
          {/* Notification Settings */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Notifications
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-violet-600"
                />
                <span className="text-slate-700">Email notifications</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-violet-600"
                />
                <span className="text-slate-700">Meeting reminders</span>
              </label>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Privacy
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-violet-600"
                />
                <span className="text-slate-700">Show profile to others</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 text-violet-600" />
                <span className="text-slate-700">Allow direct messages</span>
              </label>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-6">
            <h2 className="text-lg font-semibold text-red-600 mb-4">
              Danger Zone
            </h2>
            <Button variant="danger" size="md">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
