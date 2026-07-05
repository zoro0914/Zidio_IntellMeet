import React, { useState } from "react";
import { User, ShieldAlert, Phone, Briefcase, MapPin, Tag } from "lucide-react";

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);
import AvatarSelector from "./AvatarSelector";

const ProfileForm = ({ userData, onSave, saving }) => {
  const [formData, setFormData] = useState({
    name: userData.name || "",
    role: userData.role || "",
    phoneNumber: userData.phoneNumber || "",
    department: userData.department || "Engineering",
    avatar: userData.avatar || "",
    jobTitle: userData.jobTitle || "",
    company: userData.company || "",
    location: userData.location || "",
    skills: userData.skills ? userData.skills.join(", ") : "",
    linkedin: userData.linkedin || "",
    github: userData.github || "",
  });

  const handleSelectAvatar = (avatarValue) => {
    setFormData((prev) => ({ ...prev, avatar: avatarValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) {
      alert("Name and Role cannot be empty.");
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      
      <div className="border-b pb-4 mb-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Update Account Details</h3>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">Modify workspace profile configuration values</p>
      </div>

      {/* Avatar selection list */}
      <div className="border border-slate-100 bg-slate-50/20 p-5 rounded-2xl">
        <AvatarSelector
          currentAvatar={formData.avatar}
          onSelectAvatar={handleSelectAvatar}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm font-semibold"
              required
            />
          </div>
        </div>

        {/* Role Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Workspace Role</label>
          <div className="relative">
            <ShieldAlert className="absolute left-3 top-3 text-slate-400" size={16} />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm font-semibold bg-white text-slate-700"
              required
            >
              <option value="Host">Host / Owner</option>
              <option value="Guest">Guest / Developer</option>
              <option value="Participant">Participant / Analyst</option>
            </select>
          </div>
        </div>

        {/* Designation / Job Title Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Job Title / Designation</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="e.g. Lead Software Engineer"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm font-semibold"
            />
          </div>
        </div>

        {/* Company Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Company / Organization</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="e.g. Google"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm font-semibold"
            />
          </div>
        </div>

        {/* Department Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Department</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Engineering / Sales / Support"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm font-semibold"
            />
          </div>
        </div>

        {/* Location Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="e.g. New York, USA"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm font-semibold"
            />
          </div>
        </div>

        {/* Phone Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="+1 (555) 019-2834"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm font-semibold"
            />
          </div>
        </div>

        {/* Skills Comma Separated Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Skills <span className="text-[10px] text-slate-400 lowercase">(comma separated)</span>
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="React, Node.js, WebRTC, Tailwind"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm font-semibold"
            />
          </div>
        </div>

        {/* LinkedIn Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">LinkedIn URL</label>
          <div className="relative">
            <LinkedinIcon className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="linkedin.com/in/username"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm font-semibold"
            />
          </div>
        </div>

        {/* GitHub Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">GitHub URL</label>
          <div className="relative">
            <GithubIcon className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="github.com/username"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm font-semibold"
            />
          </div>
        </div>

      </div>

      <div className="pt-4 border-t flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition disabled:opacity-50"
        >
          {saving ? "Saving Updates..." : "Save Profile Updates"}
        </button>
      </div>

    </form>
  );
};

export default ProfileForm;
