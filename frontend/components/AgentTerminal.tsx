"use client";

import { Terminal, CheckCircle2, Loader2 } from "lucide-react";

export default function AgentTerminal({ steps, isLoading }: { steps: string[], isLoading: boolean }) {
  return (
    <div className="w-full font-mono text-sm bg-[#0f172a] text-slate-300 rounded-xl shadow-2xl overflow-hidden border border-slate-700/50">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Agent Execution Log</span>
      </div>
      
      <div className="p-6 space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
            <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
            <span className={step.includes("ERROR") ? "text-red-400" : ""}>{step}</span>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-3 text-blue-400 animate-pulse">
            <Loader2 size={16} className="animate-spin" />
            <span>Agent is synthesizing data...</span>
          </div>
        )}
      </div>
    </div>
  );
}