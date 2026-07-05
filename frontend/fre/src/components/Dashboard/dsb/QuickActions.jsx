import React from "react";
import { useNavigate } from "react-router-dom";
import { Video, PlusCircle, Sparkles, PlayCircle } from "lucide-react";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Schedule Call",
      description: "Book or setup a new room link",
      icon: PlusCircle,
      color: "bg-violet-50 text-violet-600 hover:bg-violet-100",
      path: "/meetings"
    },
    {
      title: "AI Chat Assistant",
      description: "Ask queries about transcripts",
      icon: Sparkles,
      color: "bg-amber-50 text-amber-600 hover:bg-amber-100",
      path: "/ai-chat"
    },
    {
      title: "Recording Logs",
      description: "Review recorded calls and summaries",
      icon: PlayCircle,
      color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
      path: "/recordings"
    }
  ];

  return (
    <section className="mt-8 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Quick Operations</h2>
        <p className="text-xs text-slate-500 mt-1">One-click actions to navigate the collaboration workspace</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((act, index) => {
          const Icon = act.icon;
          return (
            <button
              key={index}
              onClick={() => navigate(act.path)}
              className={`p-5 rounded-2xl border border-gray-150 flex items-start gap-4 transition-all duration-300 hover:shadow-md text-left ${act.color} group`}
            >
              <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
                <Icon size={22} />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-violet-700 transition">{act.title}</h3>
                <p className="text-xs text-slate-450 mt-1 leading-normal truncate">{act.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;
