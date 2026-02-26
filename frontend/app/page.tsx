"use client";

import { useState } from "react";
import ResearchForm from "@/components/ResearchForm";
import AgentTerminal from "@/components/AgentTerminal";
import ReportViewer from "@/components/ReportViewer";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);
  const [report, setReport] = useState<string[]>([]);

  const handleResearch = async () => {
    setLoading(true);
    setSteps(["Initiating Autonomous Agent..."]);
    setReport([]);

    try {
      const res = await fetch("http://localhost:8000/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      setSteps(data.steps);
      setReport(data.report);
    } catch (error) {
      setSteps(["Error connecting to DeepScan Engine."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Removed transition-colors since theme is now static
    <main className="min-h-screen bg-background text-foreground">
      
      {/* Removed <ThemeToggle /> 
         Everything is now Midnight Dark by default 
      */}

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
        {/* Header Section - Enhanced for Dark Mode */}
        <header className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
            DeepScan.AI
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Autonomous research agent for technical deep-dives and market synthesis.
          </p>
        </header>

        {/* Input Section */}
        <section className="max-w-3xl mx-auto">
          <div className="relative group">
            {/* Subtle glow effect behind the search bar */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            <ResearchForm 
              topic={topic} 
              setTopic={setTopic} 
              onRun={handleResearch} 
              isLoading={loading} 
            />
          </div>
        </section>

        {/* Dynamic Content Grid */}
        <div className="grid grid-cols-1 gap-8 pb-20">
          {(loading || steps.length > 0) && (
            <div className="animate-in fade-in duration-500">
              <AgentTerminal steps={steps} isLoading={loading} />
            </div>
          )}
          
          {report.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-forwards">
              <ReportViewer report={report} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}