import React, { useRef } from "react";
import { Upload, Check } from "lucide-react";

// Curated premium preset avatars with distinct HSL gradients
export const PRESET_AVATARS = [
  { id: "preset-1", label: "Violet-Indigo", css: "bg-gradient-to-tr from-violet-600 to-indigo-600" },
  { id: "preset-2", label: "Emerald-Teal", css: "bg-gradient-to-tr from-emerald-500 to-teal-500" },
  { id: "preset-3", label: "Amber-Orange", css: "bg-gradient-to-tr from-amber-500 to-orange-500" },
  { id: "preset-4", label: "Rose-Red", css: "bg-gradient-to-tr from-rose-500 to-red-500" },
  { id: "preset-5", label: "Cyan-Blue", css: "bg-gradient-to-tr from-cyan-500 to-blue-500" },
  { id: "preset-6", label: "Fuchsia-Pink", css: "bg-gradient-to-tr from-fuchsia-500 to-pink-500" },
];

const AvatarSelector = ({ currentAvatar, onSelectAvatar }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 200 * 1024) {
      alert("Image size should be less than 200KB to ensure fast cloud syncing.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      // Pass base64 string to parent callback
      onSelectAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const isCustom = currentAvatar && currentAvatar.startsWith("data:image/");

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Choose Avatar or Photo
        </label>
        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
          Select from premium presets or upload a custom image
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Preset list */}
        {PRESET_AVATARS.map((preset) => {
          const isSelected = currentAvatar === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectAvatar(preset.id)}
              className={`w-11 h-11 rounded-full flex items-center justify-center text-white relative transition hover:scale-105 duration-200 ${preset.css} shadow-sm`}
              title={preset.label}
            >
              {isSelected && (
                <div className="absolute inset-0 rounded-full bg-black/35 flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>
              )}
            </button>
          );
        })}

        {/* Custom Upload button selector */}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`h-11 px-4 rounded-xl border border-dashed flex items-center gap-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 ${
              isCustom ? "border-violet-400 bg-violet-50/20 text-violet-700" : "border-slate-300"
            }`}
          >
            <Upload size={14} />
            <span>{isCustom ? "Custom Photo Selected" : "Upload Custom Photo"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;
