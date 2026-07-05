import { useState } from "react";
import { UserPlus, User, Loader, Trash2, LogOut } from "lucide-react";
import api from "../../Utils/api";

const TeamMembers = ({ team, onMemberAdded }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: "", isError: false });

  // Custom confirm action popup state
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    memberId: "",
    memberName: "",
    isLeaving: false,
  });

  if (!team) return null;

  // Retrieve current user context details
  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const currentUserId = currentUser?._id || currentUser?.id;

  const isCreator = (memberId) => {
    const creatorId = team.creator?._id || team.creator;
    return creatorId === memberId;
  };

  const currentUserIsCreator = isCreator(currentUserId);

  const shouldShowAction = (memberId) => {
    // Creator cannot remove themselves using this endpoint
    if (isCreator(memberId)) return false;
    
    // Logged in user can remove others if they are the creator
    if (currentUserIsCreator) return true;
    
    // Logged in user can leave the team (remove themselves)
    if (memberId === currentUserId) return true;
    
    return false;
  };

  const triggerRemove = (member, isLeaving = false) => {
    setConfirmDelete({
      isOpen: true,
      memberId: member._id,
      memberName: member.name,
      isLeaving,
    });
  };

  const executeRemove = async () => {
    const { memberId, isLeaving } = confirmDelete;
    try {
      setLoading(true);
      setStatusMsg({ text: "", isError: false });

      const res = await api.delete(`/teams/${team._id}/members/${memberId}`);

      if (res.data.success) {
        setStatusMsg({
          text: isLeaving ? "You left the team." : "Member removed successfully.",
          isError: false,
        });
        setConfirmDelete({ isOpen: false, memberId: "", memberName: "", isLeaving: false });
        onMemberAdded(res.data.team);
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({
        text: err.response?.data?.message || "Failed to remove member.",
        isError: true,
      });
      setConfirmDelete({ isOpen: false, memberId: "", memberName: "", isLeaving: false });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setStatusMsg({ text: "", isError: false });
      }, 4000);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      setStatusMsg({ text: "", isError: false });

      const res = await api.post(`/teams/${team._id}/members`, {
        email: email.trim().toLowerCase(),
      });

      if (res.data.success) {
        setStatusMsg({ text: "Member added successfully!", isError: false });
        setEmail("");
        onMemberAdded(res.data.team);
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({
        text: err.response?.data?.message || "Failed to add member.",
        isError: true,
      });
    } finally {
      setLoading(false);
      // Clear status message after 4 seconds
      setTimeout(() => {
        setStatusMsg({ text: "", isError: false });
      }, 4000);
    }
  };

  const renderMemberAvatar = (member) => {
    const avatarValue = member?.avatar;

    if (avatarValue && avatarValue.startsWith("data:image/")) {
      return (
        <img
          src={avatarValue}
          alt={member?.name}
          className="object-cover w-full h-full rounded-full"
        />
      );
    }

    const presetGradients = {
      "preset-1": "from-violet-600 to-indigo-600",
      "preset-2": "from-emerald-500 to-teal-500",
      "preset-3": "from-amber-500 to-orange-500",
      "preset-4": "from-rose-555 to-red-500",
      "preset-5": "from-cyan-500 to-blue-500",
      "preset-6": "from-fuchsia-500 to-pink-500",
    };

    const gradientCss = presetGradients[avatarValue] || "from-violet-600 to-indigo-600";

    return (
      <div className={`w-full h-full rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-tr text-white ${gradientCss}`}>
        {member?.name?.charAt(0)?.toUpperCase() || "U"}
      </div>
    );
  };

  return (
    <div className="w-full lg:w-72 border-l border-gray-200 bg-white flex flex-col h-full relative">
      {/* Invite Member form */}
      <div className="p-4 border-b border-gray-200 bg-gray-50/50">
        <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <UserPlus size={16} className="text-violet-600" />
          Add Member
        </h3>
        <form onSubmit={handleAddMember} className="space-y-2">
          <input
            type="email"
            required
            placeholder="Invite by email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-slate-800 placeholder-gray-400 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <Loader size={12} className="animate-spin" />
            ) : (
              <UserPlus size={12} />
            )}
            {loading ? "Adding..." : "Add to Team"}
          </button>
        </form>

        {statusMsg.text && (
          <div
            className={`mt-2.5 p-2 rounded-lg text-[11px] leading-relaxed border ${
              statusMsg.isError
                ? "bg-red-50 border-red-200 text-red-650"
                : "bg-emerald-55 bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
          >
            {statusMsg.text}
          </div>
        )}
      </div>

      {/* Members List */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h4 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            Team Members ({team.members?.length || 0})
          </h4>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-200">
          {team.members?.map((member) => (
            <div
              key={member._id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group/item transition-colors"
            >
              <div className="w-8 h-8 rounded-full flex-shrink-0 relative">
                {renderMemberAvatar(member)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 justify-between">
                  <span className="text-xs font-semibold text-slate-800 truncate block">
                    {member.name}
                  </span>
                  {isCreator(member._id) && (
                    <span className="text-[8px] bg-violet-100 border border-violet-200 text-violet-650 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                      Creator
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-450 truncate block">
                  {member.role || "Guest"}
                </span>
              </div>

              {/* Actions Button */}
              {shouldShowAction(member._id) && (
                <button
                  onClick={() => triggerRemove(member, member._id === currentUserId)}
                  title={member._id === currentUserId ? "Leave Team" : "Remove Member"}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-55/40 transition opacity-0 group-hover/item:opacity-100 cursor-pointer"
                >
                  {member._id === currentUserId ? (
                    <LogOut size={13} />
                  ) : (
                    <Trash2 size={13} />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Local Member Action Confirm Modal */}
      {confirmDelete.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-xs shadow-2xl p-5 relative border border-slate-100 text-slate-900 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-slate-800 mb-1.5">
              {confirmDelete.isLeaving ? "Leave Team?" : "Remove Member?"}
            </h3>
            <p className="text-xs text-slate-500 mb-5 font-semibold leading-relaxed">
              {confirmDelete.isLeaving
                ? "Are you sure you want to leave this team? You will lose access to team messages."
                : `Are you sure you want to remove "${confirmDelete.memberName}" from the team?`}
            </p>
            
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setConfirmDelete({ isOpen: false, memberId: "", memberName: "", isLeaving: false })}
                className="px-4 py-2 rounded-xl text-slate-700 bg-gray-100 hover:bg-gray-200 transition text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeRemove}
                className="px-4 py-2 rounded-xl text-white bg-red-500 hover:bg-red-600 transition text-xs font-semibold cursor-pointer shadow-sm"
              >
                {confirmDelete.isLeaving ? "Leave" : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
