"use client";

import { Search, Loader2 } from "lucide-react";

export default function ResearchForm({ topic, setTopic, onRun, isLoading }: any) {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
      <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm">
        <Search className="ml-4 text-slate-400" size={20} />
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Future of Solid-State Batteries 2026"
          className="w-full p-4 bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
          onKeyDown={(e) => e.key === "Enter" && onRun()}
        />
        <button
          onClick={onRun}
          disabled={isLoading || !topic}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Research"}
        </button>
      </div>
    </div>
  );
}