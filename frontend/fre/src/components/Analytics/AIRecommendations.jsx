import React from "react";
import { Sparkles, Brain, Loader } from "lucide-react";

const AIRecommendations = ({ insights, loading, onGenerate }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="text-violet-650 animate-pulse" size={20} />
          <div>
            <h3 className="font-bold text-slate-800 text-lg">AI Performance Recommendations</h3>
            <p className="text-xs text-slate-450 mt-0.5 font-medium">Gemini-generated workspace productivity enhancements</p>
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={loading}
          className="bg-violet-50 hover:bg-violet-100 text-violet-650 border border-violet-100 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader className="animate-spin" size={12} />
              <span>Analysing Stats...</span>
            </>
          ) : (
            <>
              <Sparkles size={12} className="text-amber-500" />
              <span>Refresh AI Analysis</span>
            </>
          )}
        </button>
      </div>

      <div className="border border-dashed border-violet-100 bg-violet-50/10 rounded-xl p-5 min-h-[140px] flex flex-col justify-center">
        {loading ? (
          <div className="text-center space-y-2 py-6">
            <Loader className="mx-auto animate-spin text-violet-605" size={28} />
            <p className="text-xs text-slate-450 font-semibold">Gemini is analyzing session histories and keyword densities...</p>
          </div>
        ) : !insights ? (
          <div className="text-center py-6">
            <p className="text-xs text-slate-400 font-semibold mb-2">No AI performance logs drafted for this statistics batch yet.</p>
            <button
              onClick={onGenerate}
              className="text-xs text-violet-650 hover:text-violet-750 font-bold underline"
            >
              Generate AI Insights Now
            </button>
          </div>
        ) : (
          <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line space-y-3 font-medium">
            {insights}
          </div>
        )}
      </div>

    </div>
  );
};

export default AIRecommendations;
