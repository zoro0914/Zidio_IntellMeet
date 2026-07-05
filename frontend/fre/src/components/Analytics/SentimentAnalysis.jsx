import React from "react";
import { Smile, ShieldAlert, AlertCircle } from "lucide-react";

const SentimentAnalysis = ({ sentiments }) => {
  const { positive, neutral, negative } = sentiments;
  const total = positive + neutral + negative;

  const posPct = total > 0 ? Math.round((positive / total) * 100) : 0;
  const neuPct = total > 0 ? Math.round((neutral / total) * 100) : 0;
  const negPct = total > 0 ? Math.round((negative / total) * 100) : 0;

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
      
      <div>
        <h3 className="font-bold text-slate-800 text-lg">Overall Sentiment Pulse</h3>
        <p className="text-xs text-slate-450 mt-0.5 font-medium">Aggregated emotional index of transcript summaries</p>
      </div>

      {/* Dynamic horizontal percentage bar */}
      <div className="space-y-2">
        <div className="h-5 rounded-full overflow-hidden flex bg-slate-100">
          {total === 0 ? (
            <div className="w-full bg-slate-200 text-center text-[10px] text-slate-500 font-bold flex items-center justify-center">
              No sentiment data available
            </div>
          ) : (
            <>
              {posPct > 0 && (
                <div
                  style={{ width: `${posPct}%` }}
                  className="bg-emerald-500 hover:opacity-95 transition"
                  title={`Positive: ${posPct}%`}
                />
              )}
              {neuPct > 0 && (
                <div
                  style={{ width: `${neuPct}%` }}
                  className="bg-slate-400 hover:opacity-95 transition"
                  title={`Neutral: ${neuPct}%`}
                />
              )}
              {negPct > 0 && (
                <div
                  style={{ width: `${negPct}%` }}
                  className="bg-rose-500 hover:opacity-95 transition"
                  title={`Critical/Negative: ${negPct}%`}
                />
              )}
            </>
          )}
        </div>

        {/* Legend ratios */}
        <div className="flex justify-between items-center text-xs text-slate-400 font-semibold px-1">
          <span>Positive ({posPct}%)</span>
          <span>Neutral ({neuPct}%)</span>
          <span>Critical ({negPct}%)</span>
        </div>
      </div>

      {/* Grid boxes summaries */}
      <div className="grid grid-cols-3 gap-4 pt-2">
        
        <div className="bg-emerald-50/20 border border-emerald-100 rounded-xl p-3 flex flex-col items-center">
          <Smile className="text-emerald-500 mb-1" size={18} />
          <span className="text-[10px] font-bold text-emerald-600 block uppercase tracking-wider">Positive</span>
          <span className="text-xl font-extrabold text-slate-800 block mt-1">{positive}</span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col items-center">
          <AlertCircle className="text-slate-500 mb-1" size={18} />
          <span className="text-[10px] font-bold text-slate-550 block uppercase tracking-wider">Neutral</span>
          <span className="text-xl font-extrabold text-slate-800 block mt-1">{neutral}</span>
        </div>

        <div className="bg-rose-50/20 border border-rose-100 rounded-xl p-3 flex flex-col items-center">
          <ShieldAlert className="text-rose-500 mb-1" size={18} />
          <span className="text-[10px] font-bold text-rose-600 block uppercase tracking-wider">Critical</span>
          <span className="text-xl font-extrabold text-slate-800 block mt-1">{negative}</span>
        </div>

      </div>

    </div>
  );
};

export default SentimentAnalysis;
