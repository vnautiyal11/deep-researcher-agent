"use client";

import { useState } from "react";
import ResearchForm from "@/components/ResearchForm";
import AgentTerminal from "@/components/AgentTerminal";
import ReportViewer from "@/components/ReportViewer";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);
  const [report, setReport] = useState<string>("");  // ✅ string, not string[]

  const handleResearch = async () => {
    setLoading(true);
    setSteps(["Initiating Autonomous Agent..."]);
    setReport("");  // ✅ reset to empty string

    try {
      const res = await fetch("https://deepscan-2mrc.onrender.com/research", {  // ✅ /research endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${res.status}`);
      }

      const data = await res.json();
      setSteps(data.steps ?? []);
      setReport(typeof data.report === "string" ? data.report : String(data.report ?? ""));  // ✅ safe string coercion
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setSteps([`❌ Error connecting to DeepScan Engine: ${message}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
            DeepScan.AI
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Autonomous research agent for technical deep-dives and market synthesis.
          </p>
        </header>

        <section className="max-w-3xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <ResearchForm
              topic={topic}
              setTopic={setTopic}
              onRun={handleResearch}
              isLoading={loading}
            />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 pb-20">
          {(loading || steps.length > 0) && (
            <div className="animate-in fade-in duration-500">
              <AgentTerminal steps={steps} isLoading={loading} />
            </div>
          )}

          {report.length > 0 && (  // ✅ string .length works correctly
            <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-forwards">
              <ReportViewer report={report} />  {/* ✅ passing string */}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}