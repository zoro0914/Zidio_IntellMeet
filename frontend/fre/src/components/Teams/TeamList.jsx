import { useState } from "react";
import { Plus, Search, Users, ShieldAlert } from "lucide-react";

const TeamList = ({ teams, selectedTeam, onSelectTeam, onCreateTeamClick }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full lg:w-80 border-r border-gray-200 bg-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Users size={20} className="text-violet-600" />
          Teams
        </h2>
        <button
          onClick={onCreateTeamClick}
          className="p-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-sm"
          title="Create New Team"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Team items list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-200">
        {filteredTeams.length > 0 ? (
          filteredTeams.map((team) => {
            const isSelected = selectedTeam?._id === team._id;
            return (
              <button
                key={team._id}
                onClick={() => onSelectTeam(team)}
                className={`w-full text-left p-3.5 rounded-xl transition-all flex flex-col gap-1 ${isSelected
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-100"
                  : "hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                  }`}
              >
                <div className="flex justify-between items-start w-full">
                  <h4 className="font-semibold text-sm truncate pr-2">{team.name}</h4>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-slate-500"
                      }`}
                  >
                    {team.members?.length || 1} {team.members?.length === 1 ? "member" : "members"}
                  </span>
                </div>
                {team.description && (
                  <p
                    className={`text-xs line-clamp-1 leading-normal ${isSelected ? "text-slate-200" : "text-slate-400"
                      }`}
                  >
                    {team.description}
                  </p>
                )}
              </button>
            );
          })
        ) : (
          <div className="text-center py-12 px-4 space-y-2">
            <ShieldAlert className="mx-auto text-slate-300" size={32} />
            <p className="text-xs text-slate-400">
              {searchQuery ? "No matching teams found" : "Join or create a team to get started"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamList;
