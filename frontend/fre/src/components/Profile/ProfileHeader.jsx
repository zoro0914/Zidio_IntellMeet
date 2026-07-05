import { Sparkles, Brain, Loader, MapPin, Briefcase, Tag } from "lucide-react";
import { PRESET_AVATARS } from "./AvatarSelector";

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

const ProfileHeader = ({ userData, onGenerateBio, bioGenerating }) => {
  
  // Dynamic avatar renderer
  const renderAvatar = () => {
    const avatarValue = userData.avatar;

    if (avatarValue && avatarValue.startsWith("data:image/")) {
      return (
        <img
          src={avatarValue}
          alt={userData.name}
          className="object-cover w-full h-full rounded-full border-2 border-white"
        />
      );
    }

    const preset = PRESET_AVATARS.find((p) => p.id === avatarValue);
    const gradientCss = preset ? preset.css : "bg-gradient-to-tr from-violet-605 to-indigo-650";

    return (
      <div className={`w-full h-full rounded-full flex items-center justify-center text-white text-3xl font-extrabold shadow-md border-2 border-white select-none ${gradientCss}`}>
        {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 border-b border-gray-100 bg-slate-50/50">
      
      {/* Avatar wrapper */}
      <div className="w-24 h-24 rounded-full flex-shrink-0 relative self-center md:self-start">
        {renderAvatar()}
      </div>

      <div className="text-center md:text-left space-y-2 flex-1 min-w-0 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h2 className="text-2xl font-extrabold text-slate-800 truncate">
                {userData.name || "User Profile"}
              </h2>
              <span className="inline-block bg-violet-100 text-violet-750 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider self-center">
                {userData.role || "Member"}
              </span>
            </div>

            {/* Title / Company / Location */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-1 gap-x-3 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1">
                <Briefcase size={12} className="text-slate-400" />
                {userData.jobTitle || "Professional Developer"}
                {userData.company && ` @ ${userData.company}`}
              </span>
              {userData.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-slate-400" />
                  {userData.location}
                </span>
              )}
            </div>

            <p className="text-[11px] font-bold text-slate-450">
              {userData.email} {userData.department && `| Department: ${userData.department}`}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center md:justify-end gap-2 flex-shrink-0">
            {userData.linkedin && (
              <a
                href={userData.linkedin.startsWith("http") ? userData.linkedin : `https://${userData.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
                title="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
            {userData.github && (
              <a
                href={userData.github.startsWith("http") ? userData.github : `https://${userData.github}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
                title="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Skills Tag badges */}
        {userData.skills && userData.skills.length > 0 && (
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Tag size={10} />
              Skills:
            </span>
            {userData.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-slate-200/60"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* AI Bio Section */}
        <div className="border border-violet-100/50 bg-violet-50/20 rounded-xl p-3 mt-3 flex items-start justify-between gap-4 w-full">
          <div className="space-y-1 text-left">
            <span className="text-[9px] font-bold text-violet-600 uppercase tracking-wider block flex items-center gap-1">
              <Brain size={10} />
              AI Workspace Tagline
            </span>
            <p className="text-xs text-slate-500 font-semibold italic leading-relaxed">
              {userData.bio || "No professional tagline has been generated yet. Click sparkle to compile one using Gemini!"}
            </p>
          </div>

          <button
            onClick={onGenerateBio}
            disabled={bioGenerating}
            className="bg-white hover:bg-violet-50 text-violet-650 border border-violet-100 p-2 rounded-lg shadow-sm flex items-center justify-center flex-shrink-0 transition disabled:opacity-50"
            title="Generate tagline using Gemini"
          >
            {bioGenerating ? (
              <Loader className="animate-spin text-violet-605" size={14} />
            ) : (
              <Sparkles className="text-amber-500" size={14} />
            )}
          </button>
        </div>

      </div>

    </div>
  );
};

export default ProfileHeader;
