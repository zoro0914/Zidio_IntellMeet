import React from "react";
import { Search, Sparkles, Loader } from "lucide-react";

const SearchBar = ({ searchQuery, setSearchQuery, isAISearch, setIsAISearch, onSearch, aiSearchLoading }) => {
  return (
    <div className="flex items-center gap-2 w-full lg:w-fit bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm">
      <div className="relative flex-1 lg:w-80">
        <Search className="absolute left-3 top-3 text-slate-400" size={16} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder={isAISearch ? "Search semantically (e.g. CORS)..." : "Search by meeting title, host..."}
          className="w-full pl-9 pr-3 py-2 text-sm border-0 bg-transparent outline-none focus:ring-0"
        />
      </div>

      <button
        onClick={() => setIsAISearch(!isAISearch)}
        type="button"
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
          isAISearch
            ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
            : "bg-slate-50 text-slate-500 hover:bg-slate-100"
        }`}
      >
        <Sparkles size={14} />
        <span>AI Search</span>
      </button>

      {isAISearch && (
        <button
          onClick={onSearch}
          disabled={aiSearchLoading}
          type="button"
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold px-3 py-2 transition disabled:opacity-50"
        >
          {aiSearchLoading ? <Loader className="animate-spin" size={14} /> : "Search"}
        </button>
      )}
    </div>
  );
};

export default SearchBar;
